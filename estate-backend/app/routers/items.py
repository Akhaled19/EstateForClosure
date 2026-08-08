import logging 

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from motor.motor_asyncio import AsyncIOMotorDatabase 
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession 

from app.db.postgres import get_db
from app.db.mongo import get_mongo
from app.core.deps import get_current_user
from app.models.item import Item, ItemStatus
from app.schemas.item_scan_draft import ItemScanDraft, ScanResponse, ItemDetailResponse
from app.services.storage_service import upload_item_image
from app.services import item_scan_draft_service as draft_service 
from app.worker.actors import run_ai_scan

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/items", tags=["items"])

MAX_IMAGE_BYTES = 10 * 1024 * 1024 #10MB

@router.post("/scan", response_model=ScanResponse, status_code=202)
async def scan_item(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    mongo: AsyncIOMotorDatabase = Depends(get_mongo),
    current_user= Depends(get_current_user),
):
    if file.content_type != "image/jpeg":
        raise HTTPException(400, "Only JPEG images are accepted")
    
    image_bytes = await file.read()
    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(400, "image too large (max 10MB)")
    
    try: 
        image_url = upload_item_image(image_bytes, file.content_type, str(current_user.id))
    except Exception as e:
        logger.error("Image upload failed: %s", e)
        raise HTTPException(502, "Failed to upload image, please try again")

    if not image_url:
        raise HTTPException(502, "Image upload did not return a valid URL")

    item = Item(
        user_id = current_user.id,
        image_url = image_url,
        status = ItemStatus.draft,
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)

    await draft_service.start_scan(mongo, item.id, str(current_user.id))

    run_ai_scan.send(item.id, str(current_user.id), image_url)

    return ScanResponse(item_id=item.id, ai_status="processing", image_url=image_url)


#fetch the item row from Postgres by item_id
@router.get("/{item_id}", response_model=ItemDetailResponse)
async def get_item(
    item_id: str,
    db: AsyncSession = Depends(get_db),
    mongo: AsyncIOMotorDatabase = Depends(get_mongo),
    current_user = Depends(get_current_user),
):
    #ownership check - else 403 
    result = await db.execute(select(Item).where(Item.id == item_id))
    item = result.scalar_one_or_none()
    if item is None:
        raise HTTPException(404, "Item not found")
    if str(item.user_id) != str(current_user.id):
        raise HTTPException(403, "Not your item")
    
    #determine if drafr is finalized based on the field item.title
    is_finalized = item.title is not None

    ai_fields = {
        "ai_status": "pending",
        "ai_title_suggestion": None,
        "ai_description_draft": None,
        "ai_category": None,
        "ai_condition": None,
        "ai_brand": None,
        "ai_estimated_value_low": None,
        "ai_estimated_value_high": None,
        "ai_dimensions_estimate": None,
        "ai_confidence": None,
        "ai_error": None 
    }

    #if not finalized - fetch the Mongo draft
    if not is_finalized:
        draft = await draft_service.get_draft(mongo, item_id)
        
        if draft:
            ai_fields.update({
                "ai_status": draft.get("status", "pending"),
                "ai_title_suggestion": draft.get("title_suggestion"),
                "ai_description_draft": draft.get("description_draft"),
                "ai_category": draft.get("category"),
                "ai_condition": draft.get("condition"),
                "ai_brand": draft.get("brand"),
                "ai_estimated_value_low": draft.get("estimated_value_low"),
                "ai_estimated_value_high": draft.get("estimated_value_high"),
                "ai_dimensions_estimate": draft.get("dimensions_estimate"),
                "ai_confidence": draft.get("confidence"),
                "ai_error": draft.get("error"),
            })
    
    return ItemDetailResponse(
        id = item.id,
        is_finalized = is_finalized,
        status = item.status.value,
        image_url = item.image_url,
        title = item.title,
        description=item.description,
        category=item.category,
        condition=item.condition.value if item.condition else None,
        brand=item.brand,
        dimensions=item.dimensions,
        asking_price=item.asking_price,
        **ai_fields,
    )
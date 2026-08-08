import logging 

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from motor.motor_asyncio import AsyncIOMotorDatabase 
from sqlalchemy.ext.asyncio import AsyncSession 

from app.db.postgres import get_db
from app.db.mongo import get_mongo
from app.core.deps import get_current_user
from app.models.item import Item, ItemStatus
from app.schemas.item_scan_draft import ScanResponse
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
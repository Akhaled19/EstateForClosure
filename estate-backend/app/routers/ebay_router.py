import logging
import json
import uuid

from app.db.redis import get_redis

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession 

from app.db.postgres import get_db
from app.core.deps import get_current_user
from app.models.item import Item, ItemStatus
from app.models.ebay_connect import EbayConnect

from app.schemas.ebay import EbayListingAspects

from fastapi.responses import RedirectResponse
from app.services.ebay_service import ( 
    ebay_auth_url,
    get_ebay_category_and_aspects,
    get_item_ebay_requirements, 
    update_offer, 
    get_offer,
    create_inventory_item, 
    create_inventory_location, 
    create_offer, 
    publish_offer,
    get_existing_offer,
    exchange_ebay_code,
    delete_offer,
    parse_dimensions,
    get_missing_required_aspects,
    get_item_condition_policies,
    get_matching_ebay_condition,
    get_ebay_condition_enum,
    refresh_ebay_access_token,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ebay", tags=["ebay"])


async def get_user_ebay_connect(db: AsyncSession, user_id: str):
    result = await db.execute(select(EbayConnect).where(EbayConnect.user_id == uuid.UUID(user_id)))
    return result.scalar_one_or_none()


# http://localhost:8000/ebay/auth
# send user to eBay to authorize
@router.get("/auth")
async def ebay_auth(current_user = Depends(get_current_user)):

    state = str(uuid.uuid4())
    redis = await get_redis()
    await redis.set(f"ebay_oauth_state:{state}", current_user.id, ex=600)

    authorization_url = ebay_auth_url(state)

    return RedirectResponse(url=authorization_url)


@router.get("/auth/callback")
async def ebay_auth_callback(code: str, state: str, db: AsyncSession = Depends(get_db)):

    redis = await get_redis()
    user_id = await redis.get(f"ebay_oauth_state:{state}")
    if user_id is None:
        raise HTTPException(status_code=400, detail="Invalid or expired eBay OAuth state")

    await redis.delete(f"ebay_oauth_state:{state}")

    token_data = await exchange_ebay_code(code)

    refresh_token = token_data.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=502, detail="Failed to obtain eBay refresh token")

    result = await db.execute(select(EbayConnect).where(EbayConnect.user_id == uuid.UUID(user_id)))
    ebay_connect = result.scalar_one_or_none()

    if ebay_connect:
        ebay_connect.refresh_token = refresh_token
    else:
        ebay_connect = EbayConnect(user_id=uuid.UUID(user_id), refresh_token=refresh_token)
        db.add(ebay_connect)

    await db.commit()

    return RedirectResponse(url="https://localhost:5173/inventory")

# creates eBay listing of a item from our db
@router.post("/list/{item_id}")
async def list_item(
    item_id: str, 
    listing_aspects: EbayListingAspects | None = None,
    db: AsyncSession = Depends(get_db),
    current_user= Depends(get_current_user),
):

    result = await db.execute(select(Item).where(Item.id == item_id))
    item = result.scalar_one_or_none()

    if item is None:
        raise HTTPException(404, "item not found")

    if item.ebay_listing_id:
        raise HTTPException(400, "Item already has an eBay listing")

    if str(item.user_id) != str(current_user.id):
        raise HTTPException(403, "You don't own this item")

    if not item.title: 
        raise HTTPException(400, "Item needs a title")
    
    if item.asking_price is None:
        raise HTTPException(400, "Item needs a asking price")


    status_code, category_result = await get_ebay_category_and_aspects(title=item.title, category=item.category)

    if status_code != 200:
        raise HTTPException(502, f"Failed to identify eBay category: {category_result}")

    category_id = category_result["category_id"]
    category_name = category_result["category_name"]
    required_aspects = category_result["required_aspects"]

    status_code, condition_policy = await get_item_condition_policies(category_id)

    if status_code != 200:
        raise HTTPException(502, f"Failed to get eBay item conditions: {condition_policy}")

    ebay_conditions = condition_policy["itemConditions"]

    # check if our item condition matches any of ebay's allowed conditions
    if item.condition:
        matching_condition = get_matching_ebay_condition(item_condition = item.condition.value, ebay_conditions = ebay_conditions)
    else:
        matching_condition = None

    if matching_condition is None:
        if not listing_aspects or not listing_aspects.ebay_condition:
            raise HTTPException(status_code = 400, detail = {
                "message": "Please select a eBay condition",
                "available_conditions": ebay_conditions
            },)

        matching_condition = get_matching_ebay_condition(item_condition = listing_aspects.ebay_condition, ebay_conditions = ebay_conditions)

    if matching_condition is None:
        raise HTTPException(status_code = 400, detail = { 
            "message": "Current item condition is not supported for this eBay category",
            "available_conditions": ebay_conditions
        },)

    dimensions = parse_dimensions(item.dimensions)
    aspects = {}
    aspects.update(dimensions)

    for aspect in required_aspects:
        name = aspect["name"]

        if name == "Brand":
            aspects[name] = [item.brand or "Unbranded"]

        elif name in dimensions:
            aspects[name] = dimensions[name]

    if listing_aspects:
        aspects.update(listing_aspects.aspects)

    missing_aspects = get_missing_required_aspects(required_aspects=required_aspects, available_aspects=aspects)

    if missing_aspects:
        raise HTTPException(status_code=400, detail={
            "message" : f"Missing required aspects for eBay listing",
            "category_id" : category_id,
            "category_name": category_name,
            "missing_aspects" : missing_aspects
        },)


    ebay_condition = get_ebay_condition_enum(matching_condition["conditionId"])

    if ebay_condition is None:
        raise HTTPException(status_code=400, detail={
            "message": "Selected eBay condition is not supported",
        },)


    ebay_connect = await get_user_ebay_connect(db, current_user.id)

    if not ebay_connect:
        raise HTTPException(status_code=400, detail={
            "message": "No eBay account connected"
        },)

    refresh_token = ebay_connect.refresh_token
    access_token = await refresh_ebay_access_token(refresh_token)

    status_code, response = await create_inventory_item(
        item_id = item.id,
        title = item.title,
        description = item.description or "",
        aspects = aspects,
        condition = ebay_condition,
        image_url = item.image_url,
        access_token = access_token
    )

    if status_code not in (200, 204):
        raise HTTPException(502, f"eBay inventory item creation failed: {response}")



    # check if there is already an existing offer
    status_code, response = await get_existing_offer(item.id, access_token=access_token)
    offer_id = None

    if status_code == 200:
        try:
            offer_data = json.loads(response)

            if offer_data.get("offers"):
                offer_id = offer_data["offers"][0]["offerId"]

        except (json.JSONDecodeError, KeyError, IndexError):
            raise HTTPException(502, f"Failed to read existing eBay offer: {response}")

    # if no offer, create one
    if offer_id is None:
        status_code, response = await create_offer(item_id=item.id, price=item.asking_price, category_id=category_id, access_token = access_token)

        if status_code not in (200, 201):
            raise HTTPException(502, f"eBay offer creation failed: {response}")

        try:
            offer_data = json.loads(response)
            offer_id = offer_data["offerId"]

        except (json.JSONDecodeError, KeyError):
            raise HTTPException(502, f"Failed to retrieve offer ID from eBay: {response}")


    status_code, response = await publish_offer(offer_id, access_token=access_token)

    if status_code not in (200, 201):
        raise HTTPException(502, f"Failed to publish eBay offer")

    try:
        publish_data = json.loads(response)
        listing_id = publish_data["listingId"]
    except (json.JSONDecodeError, KeyError):
        raise HTTPException(502, f"Failed to retrieve listing ID from eBay : {response}")


    item.ebay_listing_id = listing_id
    item.status = ItemStatus.listed

    await db.commit()
    await db.refresh(item)

    
    return { "message" : "Item successfully listed on eBay", "item_id" : item.id, "ebay_listing_id" : listing_id }

# deletes ebay listing
@router.delete("/list/{item_id}")
async def cancel_listing(
    item_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):

    result = await db.execute(select(Item).where(Item.id==item_id))
    item = result.scalar_one_or_none()

    if item is None:
        raise HTTPException(404, "Item not found")

    if str(item.user_id) != str(current_user.id): 
        raise HTTPException(403, "You don't own this item")

    if not item.ebay_listing_id:
        raise HTTPException(400, "Item doesn't have an eBay listing")

    ebay_connect = await get_user_ebay_connect(db, current_user.id)

    if not ebay_connect:
        raise HTTPException(status_code=400, detail={
            "message": "No eBay account connected"
        },)

    refresh_token = ebay_connect.refresh_token
    access_token = await refresh_ebay_access_token(refresh_token)

    status_code, response = await get_existing_offer(item.id, access_token = access_token)

    if status_code != 200:
        raise HTTPException(502, f"Failed to find existing eBay offer: {response}")

    try: 
        offer_data = json.loads(response)

        if not offer_data.get("offers"):
            raise HTTPException(404, "No eBay offer found for this item")
        offer_id = offer_data["offers"][0]["offerId"]

    except (json.JSONDecodeError, KeyError, IndexError):
        raise HTTPException(502, f"Failed to read existing eBay offer: {response}")

    status_code, response = await delete_offer(offer_id, access_token=access_token)

    if status_code not in (200, 204):
        raise HTTPException(502, f"Failed to cancel eBay Listing: {response}")

    item.ebay_listing_id = None
    item.status = ItemStatus.draft

    await db.commit()
    await db.refresh(item)

    return {
        "message" : "eBay listing successfully cancelled",
        "item_id" : item.id,
    }



# TESTING:

# creating / updating inventory items on eBay
@router.post("/test-inventory")
async def test_inventory():
    return await create_inventory_item(
        item_id="estate-9",
        title="test chair 9",
        description="test chair 9 - description",
        aspects = {
            "Brand": ["Unbranded"],
            "Item Length": ["30 in"],
            "Item Height": ["31 in"],
            "Item Width": ["32 in"],
        },
        condition="NEW",
    )

# creating offer for an item
@router.post("/test-offer")
async def test_offer():
    return await create_offer(item_id="estate-9", price=35)

# publish an offer as a actual listing
@router.post("/test-publish")
async def test_publish():
    return await publish_offer("11488375010")

# ebay specifically requires a inventory location
@router.put("/test-location")
async def test_location():
    return await create_inventory_location()

# get details of an posted offer
@router.get("/test-offer-details")
async def test_offer_details():
    return await get_offer("11488375010")

# update offer
@router.put("/test-update-offer")
async def test_update_offer():
    return await update_offer()



@router.get("/test-existing-offer/{item_id}")
async def test_existing_offer(item_id: str):
    return await get_existing_offer(item_id)

@router.delete("/test-delete-offer/{offer_id}")
async def test_delete_offer(offer_id: str):
    return await delete_offer(offer_id)



@router.get("/test-category-and-aspects")
async def test_category_and_aspects(title: str, category: str | None = None):
    status_code, result = await get_ebay_category_and_aspects(title=title, category=category)

    return {
        "status": status_code,
        "result": result,
    }

@router.get("/list/{item_id}/requirements")
async def get_listing_requirements(
    item_id: str,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Item).where(Item.id == item_id))

    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if str(item.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to access this item")

    status_code, requirements = await get_item_ebay_requirements(
        title=item.title,
        category=item.category,
        brand=item.brand,
        dimensions=item.dimensions,
    )

    if status_code != 200:
        raise HTTPException(status_code=502, detail=f"Failed to determine eBay requirements: {requirements}")

    category_id = requirements["category_id"]
    status_code, condition_policy = await get_item_condition_policies(category_id)

    if status_code != 200:
        raise HTTPException(status_code=502, detail=f"Failed to get eBay condition requirements: {condition_policy}")

    ebay_conditions = condition_policy["itemConditions"]


    if item.condition:
        matching_condition = get_matching_ebay_condition(item_condition = item.condition.value, ebay_conditions = ebay_conditions)
    else:
        matching_condition = None



    return {
        **requirements, 

        "condition_match": matching_condition is not None,

        "available_conditions": ebay_conditions if matching_condition is None else [],
    }



@router.get("/status")
async def get_ebay_status(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    ebay_connect = await get_user_ebay_connect(db, current_user.id)

    
    return {
        "connected": ebay_connect is not None  # "connected": False to test what it looks like if the user is not connected to eBay. 

    }
import logging
import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession 

from app.db.postgres import get_db
from app.core.deps import get_current_user
from app.models.item import Item, ItemStatus


from fastapi.responses import RedirectResponse
from app.services.ebay_service import ( 
    ebay_auth_url, 
    update_offer, 
    get_offer,
    create_inventory_item, 
    create_inventory_location, 
    create_offer, 
    publish_offer,
    find_categories,
    get_existing_offer,
    exchange_ebay_code,
    delete_offer,
    
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ebay", tags=["ebay"])


# send user to eBay to authorize
@router.get("/auth")
async def ebay_auth():

    authorization_url = ebay_auth_url()

    return RedirectResponse(url=authorization_url)


@router.get("/auth/callback")
async def ebay_auth_callback(code: str):

    token_data = await exchange_ebay_code(code)


    return token_data

# creates eBay listing of a item from our db
@router.post("/list/{item_id}")
async def list_item(
    item_id: str, 
    db: AsyncSession = Depends(get_db),
    current_user= Depends(get_current_user),
):

    result = await db.execute(select(Item).where(Item.id == item_id))
    item = result.scalar_one_or_none()

    if item is None:
        raise HTTPException(404, "item not found")

    if str(item.user_id) != str(current_user.id):
        raise HTTPException(403, "You don't own this item")

    if not item.title: 
        raise HTTPException(400, "Item needs a title")
    if item.asking_price is None:
        raise HTTPException(400, "Item needs a asking price")

    status_code, response = await create_inventory_item(
        item_id = item.id,
        title = item.title,
        description = item.description or "",
        brand = item.brand,
        condition = item.condition.value if item.condition else None,
    )

    if status_code not in (200, 204):
        raise HTTPException(502, f"eBay inventory item creation failed: {response}")



    # check if there is already an existing offer
    status_code, response = await get_existing_offer(item.id)
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
        status_code, response = await create_offer(item_id=item.id, price=item.asking_price)

        if status_code not in (200, 201):
            raise HTTPException(502, f"eBay offer creation failed: {response}")

        try:
            offer_data = json.loads(response)
            offer_id = offer_data["offerId"]

        except (json.JSONDecodeError, KeyError):
            raise HTTPException(502, f"Failed to retrieve offer ID from eBay: {response}")


    status_code, response = await publish_offer(offer_id)

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

    status_code, response = await get_existing_offer(item.id)

    if status_code != 200:
        raise HTTPException(502, f"Failed to find existing eBay offer: {response}")

    try: 
        offer_data = json.loads(response)

        if not offer_data.get("offers"):
            raise HTTPException(404, "No eBay offer found for this item")
        offer_id = offer_data["offers"][0]["offerId"]

    except (json.JSONDecodeError, KeyError, IndexError):
        raise HTTPException(502, f"Failed to read existing eBay offer: {response}")

    status_code, response = await delete_offer(offer_id)

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
        brand="Unbranded",
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

# searching for ebay categories
@router.get("/test-find-categories")
async def test_find_categories():
    return await find_categories("Chair")


@router.get("/test-existing-offer/{item_id}")
async def test_existing_offer(item_id: str):
    return await get_existing_offer(item_id)

@router.delete("/test-delete-offer/{offer_id}")
async def test_delete_offer(offer_id: str):
    return await delete_offer(offer_id)
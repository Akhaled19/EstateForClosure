from sqlalchemy import select, func 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgres import get_db
from app.models.item_interest import ItemInterest
from app.schemas.item_interest_schema import (ItemInterestCreate, ItemInterestResponse)
from app.core.deps import get_current_user
from app.models.FamilyFriendUsers import FamilyFriendUsers
from app.models.item import Item

router = APIRouter(prefix="/item-interest", tags=["item-interest"])


# express interest
@router.post("/{item_id}", response_model=ItemInterestResponse)

async def create_interest(
    item_id: str,
    interest: ItemInterestCreate,
    db: AsyncSession = Depends(get_db)
):


    new_interest = ItemInterest(item_id=item_id, family_friend_user_id=interest.family_friend_user_id)

    db.add(new_interest)
    await db.commit()
    await db.refresh(new_interest)

    result = await db.execute(select(FamilyFriendUsers).where(FamilyFriendUsers.id == interest.family_friend_user_id))

    family_friend_user = result.scalar_one()



    return {
        "id": new_interest.id,
        "item_id": new_interest.item_id,
        "family_friend_user_id": new_interest.family_friend_user_id,
        "status": new_interest.status,
        "created_at": new_interest.created_at,
        "name": family_friend_user.name,
        "phone": family_friend_user.phone
    }

# checks if a specific family/friend user is interested in an item
@router.get("/{item_id}/check/{family_friend_user_id}")

async def check_interest(
    item_id: str,
    family_friend_user_id: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(ItemInterest).where(ItemInterest.item_id == item_id, ItemInterest.family_friend_user_id == family_friend_user_id))

    interest = result.scalar_one_or_none()

    return {"interested": interest is not None}

# owner - can get list of ALL users of whom is interested
@router.get("/{item_id}", response_model=list[ItemInterestResponse])

async def get_item_interests(
    item_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    
    item_result = await db.execute(select(Item).where(Item.id == item_id))
    item = item_result.scalar_one_or_none()
    if item is None:
        raise HTTPException(404, "Item not found")
    
    if str(item.user_id) != str(current_user.id):
        raise HTTPException(403, "Not your item")


    result = await db.execute(
        select(ItemInterest, FamilyFriendUsers.name, FamilyFriendUsers.phone)
        .join(FamilyFriendUsers, ItemInterest.family_friend_user_id == FamilyFriendUsers.id)
        .where(ItemInterest.item_id == item_id)
    )

    rows = result.all()

    return [
        {
            "id": interest.id,
            "item_id": interest.item_id,
            "family_friend_user_id": interest.family_friend_user_id,
            "name": name,
            "phone": phone,
            "status": interest.status,
            "created_at": interest.created_at
        }
        for interest, name, phone in rows
    ]

# if express interest button is clicked again, remove interest
@router.delete("/{item_id}")
async def delete_interest(
    item_id: str,
    interest: ItemInterestCreate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(ItemInterest).where(ItemInterest.item_id == item_id, ItemInterest.family_friend_user_id == interest.family_friend_user_id))

    family_friend_interest = result.scalar_one_or_none()

    if family_friend_interest is None:
        raise HTTPException(404, "Interest not found")


    await db.delete(family_friend_interest)
    await db.commit()

    return {"message": "Interest removed"}

#return interest count 
@router.get("/{item_id}/count")
async def get_interest_count(
    item_id : str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(func.count()).select_from(ItemInterest).where(ItemInterest.item_id == item_id)
    )
    
    count = result.scalar_one()

    return {"interest_count": count}
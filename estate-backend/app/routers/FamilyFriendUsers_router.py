from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgres import get_db
from app.models.FamilyFriendUsers import FamilyFriendUsers
from app.schemas.FamilyFriendUsers_schema import (FamilyFriendUserCreate, FamilyFriendUserResponse)


router = APIRouter(prefix="/family-friend-users", tags=["family-friend-users"])


@router.post("/", response_model=FamilyFriendUserResponse)
async def create_family_friend_user(
    user: FamilyFriendUserCreate,
    db: AsyncSession = Depends(get_db)
):

    new_user = FamilyFriendUsers(name=user.name, phone=user.phone)

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return new_user
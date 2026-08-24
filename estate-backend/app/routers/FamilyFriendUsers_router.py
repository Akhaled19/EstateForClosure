import secrets 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.deps import get_current_user
from app.db.postgres import get_db
from app.models.FamilyFriendUsers import FamilyFriendUsers
from app.models.profile import Profile
from app.schemas.FamilyFriendUsers_schema import (FamilyFriendUserCreate, FamilyFriendUserResponse, ShareLinkResponse)


router = APIRouter(prefix="/family-friend-users", tags=["family-friend-users"])


@router.post("/", response_model=FamilyFriendUserResponse)
async def create_family_friend_user(
    user: FamilyFriendUserCreate,
    db: AsyncSession = Depends(get_db)
):

    result = await db.execute(select(Profile).where(Profile.share_token == user.share_token))
    owner = result.scalar_one_or_none()

    if owner is None:
        raise HTTPException(401, "Invalid share link")
    
    new_user = FamilyFriendUsers(name=user.name, phone=user.phone, owner_id = owner.id)

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return new_user

@router.get("/share-link", response_model=ShareLinkResponse)
async def get_share_link(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
):
    result = await db.execute(select(Profile).where(Profile.id == current_user.id))
    profile = result.scalar_one_or_none()

    if profile is None:
        raise HTTPException(404, "Profile not found")
    
    if not profile.share_token:
        profile.share_token = secrets.token_urlsafe(16)
        await db.commit()
        await db.refresh(profile)

    return ShareLinkResponse(share_token=profile.share_token)
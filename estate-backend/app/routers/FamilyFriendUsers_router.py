import secrets 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.deps import get_current_user
from app.db.postgres import get_db
from app.models.FamilyFriendUsers import FamilyFriendUsers
from app.models.family_friend_owner_link import FamilyFriendOwnerLink
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
    
    result = await db.execute(select(FamilyFriendUsers).where(FamilyFriendUsers.phone == user.phone))
    visitor = result.scalar_one_or_none()

    if visitor is None:
        visitor = FamilyFriendUsers(name=user.name, phone=user.phone)
        db.add(visitor)
        await db.commit()
        await db.refresh(visitor)
    

    result = await db.execute(
        select(FamilyFriendOwnerLink).where(
            FamilyFriendOwnerLink.family_friend_user_id == visitor.id,
            FamilyFriendOwnerLink.owner_id == owner.id,
        )
    )

    link = result.scalar_one_or_none()

    if link is None:
        link = FamilyFriendOwnerLink(family_friend_user_id= visitor.id, owner_id = owner.id)
        db.add(link)
        await db.commit()
        
    return visitor

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
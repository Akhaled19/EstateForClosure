from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.models.item_interest import InterestStatus


class ItemInterestCreate(BaseModel):
    family_friend_user_id: str


class ItemInterestResponse(BaseModel):
    id: str
    item_id: str
    family_friend_user_id: str
    status: InterestStatus
    created_at: datetime
    name: str
    phone: str

    class Config:
        from_attributes = True

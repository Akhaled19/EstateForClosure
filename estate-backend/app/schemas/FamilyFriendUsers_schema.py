from datetime import datetime
from pydantic import BaseModel


class FamilyFriendUserCreate(BaseModel):
    name: str
    phone: str


class FamilyFriendUserResponse(BaseModel):
    id: str
    name: str
    phone: str
    created_at: datetime

    class Config:
        from_attributes = True
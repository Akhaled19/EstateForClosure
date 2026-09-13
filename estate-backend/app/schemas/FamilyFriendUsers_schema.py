import re
from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class FamilyFriendUserCreate(BaseModel):
    name: str = Field(min_length=1)
    phone: str
    share_token : str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v:str) -> str:
        if not re.match(r'^[0-9+\-\s()]{7,}$', v):
            raise ValueError("Invalid phone number format")
        return v


class FamilyFriendUserResponse(BaseModel):
    id: str
    name: str
    phone: str
    created_at: datetime

    class Config:
        from_attributes = True

class ShareLinkResponse(BaseModel):
    share_token : str 
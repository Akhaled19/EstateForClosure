from pydantic import BaseModel, Field


class EbayListingAspects(BaseModel):
    aspects: dict[str, list[str]] = Field(default_factory=dict)
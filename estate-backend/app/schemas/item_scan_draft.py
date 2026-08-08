from datetime import datetime 
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field 

class ItemScanDraft(BaseModel):
    item_id: str 
    user_id: str
    status: str = "pending" #pending | processing | complete | failed
    title_suggestion: Optional[str] = None 
    description_draft: Optional[str] = None 
    category: Optional[str] = None 
    condition: Optional[str] = None
    brand: Optional[str] = None 
    estimated_value_low: Optional[float] = None 
    estimated_value_high: Optional[float] = None 
    dimensions_estimate: Optional[str] = None 
    confidence: Optional[str] = None #hIgh | medium | low 
    raw_response: Optional[Dict[str, Any]] = None 
    error: Optional[str] = None 
    created_at: datetime = Field(default_factory = datetime.utcnow)
    processed_at: Optional[datetime] = None 

class ScanResponse(BaseModel):
    item_id: str
    ai_status: str 
    image_url: str 

class ItemDetailResponse(BaseModel):
    id: str
    is_finalized: bool
    status: str
    image_url: str

    title: Optional[str] = None
    description: Optional[str] = None 
    category: Optional[str] = None 
    brand: Optional[str] = None 
    dimensions: Optional[str] = None 
    asking_price: Optional[float] = None 

    ai_status: Optional[str] = None
    ai_title_suggestion: Optional[str] = None
    ai_description_draft: Optional[str] = None
    ai_category: Optional[str] = None
    ai_condition: Optional[str] = None
    ai_brand: Optional[str] = None
    ai_estimated_value_low: Optional[float] = None
    ai_estimated_value_high: Optional[float] = None
    ai_dimensions_estimate: Optional[str] = None
    ai_confidence: Optional[str] = None
    ai_error: Optional[str] = None

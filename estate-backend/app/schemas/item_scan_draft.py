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
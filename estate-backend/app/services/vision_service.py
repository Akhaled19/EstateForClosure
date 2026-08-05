import base64
import logging
from dataclasses import dataclass
from typing import Optional

import anthropic 
from app.core.config import settings

logger = logging.getLogger(__name__)

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

MODEL = "claude-sonnet-5"

ANALYZE_TOOL = {
    "name": "record_item_analysis",
    "description": "Record structured analysis of a secondhand/estate from a photo for a resale marketplace listing.",
    "input_schema": {
        "type": "object",
        "properties": {
            "title_suggestion": {"type": "string", "description": "Concise listing title, under 80 chars."},
            "description_draft": {"type": "string", "description": "2-4 sentence draft description, editable by the seller."},
            "category": {"type": "string", "description": "Best-fit category, e.g. 'Furniture', 'Kitchenware', 'Electronics', 'Jewelry', 'Art & Decor', 'Clothing', 'Tools', 'Collectibles', 'Books & Media', 'Other'."},
            "condition": {"type": "string", "enum": ["New", "Like New", "Good", "Fair", "Poor"]},
            "brand": {"type": ["string", "null"], "description": "Brand if identifiable, else null."},
            "estimated_value_low": {"type": "number"},
            "estimated_value_high": {"type": "number"},
            "dimensions_estimate": {"type": ["string", "null"]},
            "confidence": {"type": "string", "enum": ["high", "medium", "low"]},
        },
        "required": [
            "title_suggestion", "description_draft", "category", "condition", 
            "brand", "estimated_value_low", "estimated_value_high", 
            "dimensions_estimate", "confidence"
        ],
    },

}

SYSTEM_PROMPT = (
    """ You are a helpful assistant for an estate liquidation marketplace app.
    Sellers photograph secondhand items and you help draft the listing by analyzing the photo.
    Be realistic and conservative with price estimates.
    If you can't tell what something is, say so via confidence rather than guessing confidently.
"""
)

@dataclass
class ItemAnalysis:
    title_suggestion: str
    description_draft: str 
    category: str 
    condition: str
    brand: Optional[str]
    estimated_value_low: float
    estimated_value_high: float
    dimensions_estimate: Optional[str]
    confidence: str 
    raw_response: dict

class VisionAnalysisError(Exception):
    pass

def analyze_item_image(image_bytes: bytes, media_type: str = "image/jpeg") -> ItemAnalysis:
    b64_image = base64.standard_b64encode(image_bytes).decode("utf-8")

    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            tools=[ANALYZE_TOOL],
            tool_choice={"type": "tool", "name": "record_item_analysis"},
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": b64_image}},
                    {"type": "text", "text": "Analyze this item for a resale listsing."},
                ],
            }],
        )
    except anthropic.APIError as e:
        logger.error("Anthropic API error during item scan: %s", e)
        raise VisionAnalysisError(str(e)) from e 
    
    tool_use_block = next((b for b in response.content if b.type == "tool_use"), None)
    if tool_use_block is None:
        raise VisionAnalysisError("Model did not return a tool use block")
    
    data = tool_use_block.input 

    try:
        return ItemAnalysis(
            title_suggestion=data["title_suggestion"],
            description_draft=data["description_draft"],
            category=data["category"],
            condition=data["condition"],
            brand=data.get("brand"),
            estimated_value_low=float(data["estimated_value_low"]),
            estimated_value_high=float(data["estimated_value_high"]),
            dimensions_estimate=data.get("dimensions_estimate"),
            confidence=data["confidence"],
            raw_response=data,
        )
    
    except (KeyError, ValueError, TypeError) as e:
        raise VisionAnalysisError(f"Malformed tool response: {e}") from e 

from datetime import datetime
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase

COLLECTION = "item_scan_drafts"

async def start_scan(
    mongo: AsyncIOMotorDatabase,
    item_id: str, 
    user_id: str
) -> None:
    #upsert -> overwrites any prior draft for this item, per no duplicates rule 
    await mongo[COLLECTION].update_one(
        {"item_id": item_id},
        { 
            "$set": {
                "item_id": item_id,
                "user_id": user_id,
                "status": "processing",
                "error": None,
            },
            "$setOnInsert": {"created_at": datetime.utcnow()},
        },
        upsert=True,
    ) 

async def mark_success(mongo: AsyncIOMotorDatabase, item_id: str, analysis) -> None:
    await mongo[COLLECTION].update_one(
        {"item_id": item_id},
        {"$set": {
            "status": "complete",
            "title_suggestion": analysis.title_suggestion,
            "description_draft": analysis.description_draft,
            "category": analysis.category,
            "condition": analysis.condition,
            "brand": analysis.brand,
            "estimated_value_low": analysis.estimated_value_low,
            "estimated_value_high": analysis.estimated_value_high,
            "dimensions_estimate": analysis.dimensions_estimate,
            "confidence": analysis.confidence,
            "raw_response": analysis.raw_response,
            "processed_at": datetime.utcnow(),
        }},
    )


async def mark_failure(mongo: AsyncIOMotorDatabase, item_id: str, error: str) -> None:
    await mongo[COLLECTION].update_one(
        {"item_id": item_id},
        {"$set": {"status": "failed", "error": error, "processed_at": datetime.utcnow()}},
    )


async def get_draft(mongo: AsyncIOMotorDatabase, item_id: str) -> Optional[dict]:
    return await mongo[COLLECTION].find_one({"item_id": item_id})
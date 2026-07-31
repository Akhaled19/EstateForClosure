import asyncio
import logging

import dramatiq 
import httpx
from motor.motor_asyncio import AsyncIOMotorClient 

from app.worker import broker 
from app.core.config import settings
from app.services.Vision_service import analyze_item_image, VisionAnalysisError
from app.services import item_scan_draft_service as draft_service 

logger = logging.getLogger(__name__)

@dramatiq.actor(max_retries=3, time_limit=60_000) #time_limit in ms - 60s ceiling per job 
def run_ai_scan(item_id: str, user_id: str, image_url: str) -> None:
    asyncio.run(_run_ai_scan_async(item_id, user_id, image_url))

async def _run_ai_scan_async(item_id: str, user_id: str, image_url: str) -> None:
    #fresh client scoped to this job's event loop - not the shared app_wide one 
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.MONGO_DB]

    try:
        async with httpx.AsyncClient() as http:
            response = await http.get(image_url, timeout=15.0)
            response.raise_for_status()
            image_bytes = response.content
            media_type = response.headers.get("content-type", "image/jpeg")

        try:
            analysis = analyze_item_image(image_bytes, media_type)

        except VisionAnalysisError as e:
            logger.warning("AI scan failed for item %s: %s", item_id, e)
            await draft_service.mark_failure(db, item_id, str(e))
            return
        
        await draft_service.mark_success(db, item_id, analysis)

    finally:
        client.close()
        
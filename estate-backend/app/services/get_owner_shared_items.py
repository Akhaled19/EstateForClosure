from sqlalchemy import select 
from sqlalchemy.ext.asyncio import AsyncSession 

from app.models.item import Item
from app.models.item_interest import ItemInterest, InterestStatus



async def get_owner_shared_items(db: AsyncSession, owner_id) -> list[dict]:
    """
    Returns sgares, finalized items for a given owner
    with computed claim status and interest count 
    used by both the visitor-facing and owner-facing endpoints
    """

    result = await db.execute(
        select(Item).where(
            Item.user_id == owner_id,
            Item.shared_with_family == True,
            Item.title.is_not(None),
        )
    )
    items = result.scalars().all()

    enriched = []
    for item in items:
        interest_result = await db.execute(
            select(ItemInterest).where(ItemInterest.item_id == item.id)
        )
        interests = interest_result.scalars().all()
        is_claimed = any(i.status == InterestStatus.claimed for i in interests)

        enriched.append({
            "item": item,
            "interest_count": len(interests),
            "status": "Claimed" if is_claimed else "Unclaimed",
        })

    return enriched
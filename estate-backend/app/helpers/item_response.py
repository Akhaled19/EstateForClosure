from app.models.item import Item
from app.schemas.item_scan_draft import ItemDetailResponse


def build_item_detail_response(item: Item, **ai_fields) -> ItemDetailResponse:
    return ItemDetailResponse(
        id = item.id,
        is_finalized = item.title is not None,
        status = item.status.value,
        created_at = item.created_at.strftime("%m/%d/%Y") if item.created_at else None,
        image_url = item.image_url,
        title = item.title,
        description = item.description, 
        category = item.category,
        condition = item.condition.value if item.condition else None,
        brand = item.brand,
        dimensions = item.dimensions,
        asking_price = item.asking_price,
        shared_with_family = item.shared_with_family, 
        **ai_fields,
    )
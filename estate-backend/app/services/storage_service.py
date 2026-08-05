import uuid 

from supabase import create_client, Client
from app.core.config import settings

BUCKET = "items"

_supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SECRET_KEY)


def upload_item_image(image_bytes: bytes, content_type: str, user_id: str) -> str:
    path = f"{user_id}/{uuid.uuid4()}.jpg"

    _supabase.storage.from_(BUCKET).upload(path, image_bytes, {"content-type": content_type})
    
    return _supabase.storage.from_(BUCKET).get_public_url(path)

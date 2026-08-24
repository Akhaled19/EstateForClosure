import pytest
import uuid
from datetime import datetime
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, MagicMock

from app.main import app
from app.db.postgres import get_db
from app.core.deps import get_current_user


class FakeProfile:
    def __init__(self, id, share_token=None):
        self.id = id
        self.share_token = share_token


class FakeUser:
    def __init__(self, id):
        self.id = id


async def fake_refresh(obj):
    if getattr(obj, "created_at", None) is None:
        obj.created_at = datetime.utcnow()
    
    if getattr(obj, "id", None) is None:
        obj.id = str(uuid.uuid4())


def make_fake_db(query_result=None):
    fake_result = MagicMock()
    fake_result.scalar_one_or_none.return_value = query_result

    fake_db = AsyncMock()
    fake_db.execute.return_value = fake_result
    fake_db.commit.return_value = None
    fake_db.refresh.side_effect = fake_refresh
    return fake_db


VALID_TOKEN = "real-token-abc"
OWNER_ID = "11111111-1111-1111-1111-111111111111"


# --- POST /family-friend-users/ ---

@pytest.mark.asyncio
async def test_create_visitor_with_valid_token():
    fake_profile = FakeProfile(id=OWNER_ID, share_token=VALID_TOKEN)
    app.dependency_overrides[get_db] = lambda: make_fake_db(fake_profile)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/family-friend-users/", json={
            "name": "Jane Smith",
            "phone": "555-123-4567",
            "share_token": VALID_TOKEN,
        })

    assert response.status_code == 200
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_create_visitor_with_invalid_token():
    app.dependency_overrides[get_db] = lambda: make_fake_db(None)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/family-friend-users/", json={
            "name": "Jane Smith",
            "phone": "555-123-4567",
            "share_token": "wrong-token",
        })

    assert response.status_code == 401
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_create_visitor_missing_token():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/family-friend-users/", json={
            "name": "Jane Smith",
            "phone": "555-123-4567",
        })

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_visitor_invalid_phone():
    fake_profile = FakeProfile(id=OWNER_ID, share_token=VALID_TOKEN)
    app.dependency_overrides[get_db] = lambda: make_fake_db(fake_profile)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/family-friend-users/", json={
            "name": "Jane Smith",
            "phone": "abc",
            "share_token": VALID_TOKEN,
        })

    assert response.status_code == 422
    app.dependency_overrides.clear()


# --- GET /family-friend-users/share-link ---

@pytest.mark.asyncio
async def test_share_link_generates_token_if_missing():
    fake_profile = FakeProfile(id=OWNER_ID, share_token=None)
    fake_db = make_fake_db(fake_profile)
    app.dependency_overrides[get_db] = lambda: fake_db
    app.dependency_overrides[get_current_user] = lambda: FakeUser(id=OWNER_ID)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/family-friend-users/share-link")

    assert response.status_code == 200
    assert response.json()["share_token"]  # non-empty string was generated
    fake_db.commit.assert_called_once()
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_share_link_returns_existing_token():
    fake_profile = FakeProfile(id=OWNER_ID, share_token=VALID_TOKEN)
    fake_db = make_fake_db(fake_profile)
    app.dependency_overrides[get_db] = lambda: fake_db
    app.dependency_overrides[get_current_user] = lambda: FakeUser(id=OWNER_ID)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/family-friend-users/share-link")

    assert response.status_code == 200
    assert response.json()["share_token"] == VALID_TOKEN
    fake_db.commit.assert_not_called()  # no new token needed, no write should happen
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_share_link_no_profile():
    fake_db = make_fake_db(None)
    app.dependency_overrides[get_db] = lambda: fake_db
    app.dependency_overrides[get_current_user] = lambda: FakeUser(id=OWNER_ID)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/family-friend-users/share-link")

    assert response.status_code == 404
    app.dependency_overrides.clear()
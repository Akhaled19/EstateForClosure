import pytest
from datetime import datetime
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, MagicMock
import uuid

from app.main import app
from app.db.postgres import get_db
from app.core.deps import get_current_user


class FakeProfile:
    def __init__(self, id, share_token=None):
        self.id = id
        self.share_token = share_token


class FakeVisitor:
    def __init__(self, id, name, phone, created_at=None):
        self.id = id
        self.name = name
        self.phone = phone
        self.created_at = created_at


class FakeUser:
    def __init__(self, id):
        self.id = id


def make_result(value):
    fake_result = MagicMock()
    fake_result.scalar_one_or_none.return_value = value
    return fake_result


async def fake_refresh(obj):
    if getattr(obj, "created_at", None) is None:
        obj.created_at = datetime.utcnow()
    if getattr(obj, "id", None) is None:
        obj.id = str(uuid.uuid4())


def make_fake_db(execute_results):
    """execute_results: list of values returned by successive db.execute() calls, in order"""
    fake_db = AsyncMock()
    fake_db.add = MagicMock()
    fake_db.execute.side_effect = [make_result(r) for r in execute_results]
    fake_db.commit.return_value = None
    fake_db.refresh.side_effect = fake_refresh
    return fake_db


VALID_TOKEN = "real-token-abc"
OWNER_ID = "11111111-1111-1111-1111-111111111111"


@pytest.mark.asyncio
async def test_create_visitor_new_person_new_owner():
    """First time this phone number has ever been seen, first time visiting this owner."""
    fake_profile = FakeProfile(id=OWNER_ID, share_token=VALID_TOKEN)
    fake_db = make_fake_db([
        fake_profile,  # Profile lookup
        None,          # FamilyFriendUsers lookup - no existing visitor
        None,          # FamilyFriendOwnerLink lookup - no existing link
    ])
    app.dependency_overrides[get_db] = lambda: fake_db

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/family-friend-users/", json={
            "name": "Jane Smith",
            "phone": "555-123-4567",
            "share_token": VALID_TOKEN,
        })

    assert response.status_code == 200
    assert fake_db.commit.call_count == 2  # one for new visitor, one for new link
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_create_visitor_existing_person_new_owner():
    """This phone number exists already, but hasn't visited this particular owner before."""
    fake_profile = FakeProfile(id=OWNER_ID, share_token=VALID_TOKEN)
    existing_visitor = FakeVisitor(id="visitor-1", name="Jane Smith", phone="555-123-4567", created_at=datetime.utcnow())
    fake_db = make_fake_db([
        fake_profile,        # Profile lookup
        existing_visitor,    # FamilyFriendUsers lookup - found existing
        None,                # FamilyFriendOwnerLink lookup - no link yet
    ])
    app.dependency_overrides[get_db] = lambda: fake_db

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/family-friend-users/", json={
            "name": "Jane Smith",
            "phone": "555-123-4567",
            "share_token": VALID_TOKEN,
        })

    assert response.status_code == 200
    assert fake_db.commit.call_count == 1  # only the new link, no new visitor
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_create_visitor_existing_person_existing_owner():
    """Repeat visit - same phone, same owner. Nothing new should be created."""
    fake_profile = FakeProfile(id=OWNER_ID, share_token=VALID_TOKEN)
    existing_visitor = FakeVisitor(id="visitor-1", name="Jane Smith", phone="555-123-4567", created_at=datetime.utcnow())
    existing_link = MagicMock()
    fake_db = make_fake_db([
        fake_profile,      # Profile lookup
        existing_visitor,  # FamilyFriendUsers lookup - found existing
        existing_link,     # FamilyFriendOwnerLink lookup - found existing
    ])
    app.dependency_overrides[get_db] = lambda: fake_db

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/family-friend-users/", json={
            "name": "Jane Smith",
            "phone": "555-123-4567",
            "share_token": VALID_TOKEN,
        })

    assert response.status_code == 200
    assert fake_db.commit.call_count == 0  # nothing new, no writes at all
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_create_visitor_with_invalid_token():
    fake_db = make_fake_db([None])  # Profile lookup fails, nothing else should even run
    app.dependency_overrides[get_db] = lambda: fake_db

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
    fake_db = make_fake_db([fake_profile])  # only Profile lookup runs before validation... 
    # actually Pydantic validation happens before the endpoint body runs at all
    app.dependency_overrides[get_db] = lambda: fake_db

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/family-friend-users/", json={
            "name": "Jane Smith",
            "phone": "abc",
            "share_token": VALID_TOKEN,
        })

    assert response.status_code == 422
    app.dependency_overrides.clear()
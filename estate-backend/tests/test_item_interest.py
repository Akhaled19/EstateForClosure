import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, MagicMock

from app.main import app 
from app.core.deps import get_current_user
from app.db.postgres import get_db


#whenever a route asks for get_current_user, give it this fake function (mocking the function call)
class FakeUser:
    def __init__(self, id):
        self.id = id 

OWNER_ID = "11111111-1111-1111-1111-111111111111"
OTHER_USER_ID = "22222222-2222-2222-2222-222222222222"


#whenever db.execute(...) is called to retrieve a SQLAlchemy Result object which then calls .scalar_one_or_none()
# instead mock the entire chain of action with MagicMock and AsyncMock 
class FakeItem:
    def __init__(self, id, user_id):
        self.id = id
        self.user_id = user_id

def make_fake_db(item_or_none):
    """
    returns a fake AsyncSession whose .execute() resolves to a result object 
    that gives back `item_or_none` from scalar_one_or_none()
    """
    fake_result = MagicMock()
    fake_result.scalar_one_or_none.return_value = item_or_none
    fake_result.all.return_value = [] #no interests needed for these auth tests

    fake_db = AsyncMock()
    fake_db.execute.return_value = fake_result
    return fake_db


"""
Three test cases.
Each one overrides get_current_user and get_db 
then hits the real endpoint with this mocked payload through an in-process HTTP client (ASGITransport)
"""
@pytest.mark.asyncio 
async def  test_owner_can_view_interests():
    fake_item = FakeItem(id="item-1", user_id=OWNER_ID)
    app.dependency_overrides[get_current_user] = lambda: FakeUser(id=OWNER_ID)
    app.dependency_overrides[get_db] = lambda: make_fake_db(fake_item)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/item-interest/item-1")
    
    assert response.status_code == 200
    app.dependency_overrides.clear()

@pytest.mark.asyncio 
async def  test_non_owner_forbidden():
    fake_item = FakeItem(id="item-1", user_id=OWNER_ID)
    app.dependency_overrides[get_current_user] = lambda: FakeUser(id=OTHER_USER_ID)
    app.dependency_overrides[get_db] = lambda: make_fake_db(fake_item)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/item-interest/item-1")
    
    assert response.status_code == 403
    app.dependency_overrides.clear()

@pytest.mark.asyncio 
async def  test_nonexistent_item():
    app.dependency_overrides[get_current_user] = lambda: FakeUser(id=OWNER_ID)
    app.dependency_overrides[get_db] = lambda: make_fake_db(None)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/item-interest/nonexistent-id")
    
    assert response.status_code == 404
    app.dependency_overrides.clear()
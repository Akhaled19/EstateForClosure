import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, MagicMock

from app.main import app 
from app.core.deps import get_current_user
from app.db.postgres import get_db
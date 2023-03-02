import asyncio
from typing import Generator, Dict
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient
from ..config.config import settings

# Override config settings before loading the app
# We set the MONGO_DB to a test database

settings.MONGO_DB = "farmdtest"

from ..main import app


# @pytest.fixture(scope="session")
# def event_loop():
#     """Force the pytest-asyncio loop to be the main one."""
#     loop = asyncio.get_event_loop()
#     yield loop


@pytest.fixture(scope="module")
def client() -> Generator:
    """
    Fixture to generate the test client. Note that we patch the
    MONGO_DB setting to work with a test database and avoid
    poluting the real database.
    """
    with patch("app.config.config.settings.MONGO_DB", "farmdtest"):
        with TestClient(app) as c:
            yield c


@pytest.fixture()
async def async_client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


@pytest.fixture(scope="module")
def superuser_token_headers(client: TestClient) -> Dict[str, str]:
    login_data = {
        "username": settings.FIRST_SUPERUSER,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
    }
    r = client.post(f"{settings.API_V1_STR}/login/access-token", data=login_data)
    tokens = r.json()
    a_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {a_token}"}
    return headers

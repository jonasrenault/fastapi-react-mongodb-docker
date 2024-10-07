from typing import AsyncGenerator
from unittest.mock import patch

import pytest
from asgi_lifespan import LifespanManager
from fastapi import FastAPI
from httpx import AsyncClient

from app.config.config import settings
from app.main import app

from .utils import get_user_auth_headers

MONGO_TEST_DB = "farmdtest"


@pytest.fixture
def anyio_backend():
    return "asyncio"


async def clear_database(server: FastAPI) -> None:
    test_db = server.state.client[MONGO_TEST_DB]
    collections = await test_db.list_collections()
    async for collection in collections:
        await test_db[collection["name"]].delete_many({})


@pytest.fixture()
async def client() -> AsyncGenerator[AsyncClient, None]:
    """Async server client that handles lifespan and teardown"""
    with patch("app.config.config.settings.MONGO_DB", MONGO_TEST_DB):
        async with LifespanManager(app):
            async with AsyncClient(app=app, base_url="http://test") as client:
                try:
                    yield client
                finally:
                    await clear_database(app)


@pytest.fixture()
async def superuser_token_headers(client: AsyncClient) -> dict[str, str]:
    return await get_user_auth_headers(
        client, settings.FIRST_SUPERUSER, settings.FIRST_SUPERUSER_PASSWORD
    )

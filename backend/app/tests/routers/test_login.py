from typing import Dict

import pytest
from app.config.config import settings
from httpx import AsyncClient


@pytest.mark.anyio
async def test_get_access_token(client: AsyncClient) -> None:
    login_data = {
        "username": settings.FIRST_SUPERUSER,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
    }
    r = await client.post(f"{settings.API_V1_STR}/login/access-token", data=login_data)
    tokens = r.json()
    assert r.status_code == 200
    assert "access_token" in tokens
    assert tokens["access_token"]


@pytest.mark.anyio
async def test_use_access_token(
    client: AsyncClient, superuser_token_headers: Dict[str, str]
) -> None:
    r = await client.get(
        f"{settings.API_V1_STR}/login/test-token",
        headers=superuser_token_headers,
    )
    result = r.json()
    assert r.status_code == 200
    assert "email" in result


@pytest.mark.anyio
async def test_not_authorized(client: AsyncClient) -> None:
    r = await client.get(f"{settings.API_V1_STR}/login/test-token")
    assert r.status_code == 401

    headers = {"AUTHORIZATION": "Bearer eyJ0eXAiOiJKV1QiLCJhbG"}
    r = await client.get(f"{settings.API_V1_STR}/login/test-token", headers=headers)
    assert r.status_code == 401

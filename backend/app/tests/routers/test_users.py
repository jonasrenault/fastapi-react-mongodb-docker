import pytest
from typing import Dict

from httpx import AsyncClient

from app.config.config import settings
from app.main import app
from app.models import User
from ..utils import create_test_user, generate_user_auth_headers


@pytest.mark.anyio
async def test_get_profile_superuser(
    client: AsyncClient, superuser_token_headers: Dict[str, str]
) -> None:
    r = await client.get(
        f"{settings.API_V1_STR}/users/me", headers=superuser_token_headers
    )
    current_user = r.json()
    assert current_user
    assert current_user["is_active"] is True
    assert current_user["is_superuser"]
    assert current_user["email"] == settings.FIRST_SUPERUSER


@pytest.mark.anyio
async def test_get_profile_normal_user(client: AsyncClient) -> None:
    user = await create_test_user()
    token_headers = await generate_user_auth_headers(client, user)
    response = await client.get(
        f"{settings.API_V1_STR}/users/me", headers=token_headers
    )

    profile = response.json()
    assert profile
    assert profile["is_active"] is True
    assert profile["is_superuser"] is False
    assert profile["email"] == user.email

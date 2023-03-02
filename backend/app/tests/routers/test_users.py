import pytest
from typing import Dict

from httpx import AsyncClient
from fastapi.testclient import TestClient

from app.config.config import settings
from app.main import app
from app.models import User
from ..utils import create_random_user, user_authentication_headers


def test_get_profile_superuser(
    client: TestClient, superuser_token_headers: Dict[str, str]
) -> None:
    r = client.get(f"{settings.API_V1_STR}/users/me", headers=superuser_token_headers)
    current_user = r.json()
    assert current_user
    assert current_user["is_active"] is True
    assert current_user["is_superuser"]
    assert current_user["email"] == settings.FIRST_SUPERUSER


# @pytest.fixture
# async def normal_user():
#     return await create_random_user()


# @pytest.mark.anyio
# async def test_get_profile_normal_user(asyncclient: AsyncClient, superuser_token_headers: Dict[str, str]) -> None:
#     # normal_user = await create_random_user()
#     # async with AsyncClient(app=app, base_url="http://test") as ac:
#     #     # token_headers = await user_authentication_headers(ac, normal_user.email, normal_user.hashed_password)
#     #     response = await ac.get(f"{settings.API_V1_STR}/users/me", headers=superuser_token_headers)
#     response = await asyncclient.get(f"{settings.API_V1_STR}/users/me", headers=superuser_token_headers)

#     # current_user = response.json()
#     # assert current_user
#     # assert current_user["is_active"] is True
#     # assert current_user["is_superuser"] is False
#     # assert current_user["email"] == normal_user.email

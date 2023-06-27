import pytest
from typing import Dict

from httpx import AsyncClient

from app.config.config import settings
from app.models import User
from ..utils import (
    create_test_user,
    generate_user_auth_headers,
    random_email,
    random_lower_string,
)


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


@pytest.mark.anyio
async def test_create_user(client: AsyncClient) -> None:
    username = random_email()
    password = random_lower_string()
    data = {"email": username, "password": password}
    r = await client.post(
        f"{settings.API_V1_STR}/users",
        json=data,
    )
    assert r.status_code == 200
    created_user = r.json()
    user = await User.find_one({"email": username})
    assert user
    assert user.email == created_user["email"]


@pytest.mark.anyio
async def test_create_user_existing_username(client: AsyncClient) -> None:
    user = await create_test_user()
    data = {"email": user.email, "password": "password"}
    r = await client.post(f"{settings.API_V1_STR}/users", json=data)
    response = r.json()
    assert r.status_code == 400
    assert response["detail"] == "User with that email already exists."


@pytest.mark.anyio
async def test_get_existing_user(
    client: AsyncClient, superuser_token_headers: dict
) -> None:
    user = await create_test_user()
    r = await client.get(
        f"{settings.API_V1_STR}/users/{user.uuid}",
        headers=superuser_token_headers,
    )
    assert r.status_code == 200
    api_user = r.json()
    assert user.email == api_user["email"]


@pytest.mark.anyio
async def test_update_profile(client: AsyncClient) -> None:
    # create user
    user = await create_test_user()
    token_headers = await generate_user_auth_headers(client, user)

    # update user email and pw
    data = {"email": random_email(), "password": random_lower_string()}
    r = await client.patch(
        f"{settings.API_V1_STR}/users/me", json=data, headers=token_headers
    )
    assert r.status_code == 200

    updated_user = await User.get(user.id)
    assert updated_user.email == data["email"]


@pytest.mark.anyio
async def test_update_profile_existing_email(client: AsyncClient) -> None:
    # create user
    user = await create_test_user()
    token_headers = await generate_user_auth_headers(client, user)

    # update user email to already existing email
    data = {"email": settings.FIRST_SUPERUSER}
    r = await client.patch(
        f"{settings.API_V1_STR}/users/me", json=data, headers=token_headers
    )
    response = r.json()
    assert r.status_code == 400
    assert response["detail"] == "User with that email already exists."


@pytest.mark.anyio
async def test_update_profile_cannot_set_superuser(client: AsyncClient) -> None:
    # create user
    user = await create_test_user()
    token_headers = await generate_user_auth_headers(client, user)

    # test user cannot set itself to superuser or inactive
    data = {"is_superuser": True, "is_active": False}
    r = await client.patch(
        f"{settings.API_V1_STR}/users/me", json=data, headers=token_headers
    )
    assert r.status_code == 200

    updated_user = await User.get(user.id)
    assert updated_user.is_superuser == False
    assert updated_user.is_active == True

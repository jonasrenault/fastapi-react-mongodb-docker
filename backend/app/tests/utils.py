import random
import string
from typing import Dict
from httpx import AsyncClient

from app.models import User
from app.config.config import settings


async def user_authentication_headers(
    *, client: AsyncClient, email: str, password: str
) -> Dict[str, str]:
    data = {"username": email, "password": password}

    r = await client.post(f"{settings.API_V1_STR}/login/access-token", data=data)
    response = r.json()
    auth_token = response["access_token"]
    headers = {"Authorization": f"Bearer {auth_token}"}
    return headers


def random_lower_string() -> str:
    return "".join(random.choices(string.ascii_lowercase, k=32))


def random_email() -> str:
    return f"{random_lower_string()}@{random_lower_string()}.com"


async def create_random_user() -> User:
    email = random_email()
    password = random_lower_string()
    user = User(email=email, hashed_password=password)
    await user.create()
    return user

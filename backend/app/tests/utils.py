import random
import string
from typing import Dict

from app.auth.auth import create_access_token, get_hashed_password
from app.config.config import settings
from app.models import User
from httpx import AsyncClient


async def get_user_auth_headers(
    client: AsyncClient, email: str, password: str
) -> Dict[str, str]:
    """
    Given a user's email and password, send a request to login the user and return the
    authorization headers.
    """
    data = {"username": email, "password": password}
    r = await client.post(f"{settings.API_V1_STR}/login/access-token", data=data)
    response = r.json()
    auth_token = response["access_token"]
    headers = {"Authorization": f"Bearer {auth_token}"}
    return headers


async def generate_user_auth_headers(client: AsyncClient, user: User) -> Dict[str, str]:
    """
    Given a user in DB, generate a token and return the authorization headers.
    """
    access_token = create_access_token(user.uuid)
    return {"Authorization": f"Bearer {access_token}"}


def random_lower_string() -> str:
    return "".join(random.choices(string.ascii_lowercase, k=32))


def random_email() -> str:
    return f"{random_lower_string()}@{random_lower_string()}.com"


async def create_test_user() -> User:
    email = random_email()
    hashed_password = get_hashed_password(random_lower_string())
    user = User(email=email, hashed_password=hashed_password)
    await user.create()
    return user

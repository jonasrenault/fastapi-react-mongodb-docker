from typing import Generator, Dict
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from ..main import app
from ..config.config import settings


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

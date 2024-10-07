from typing import List

from pydantic import AnyHttpUrl, EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env.dev",
        env_ignore_empty=True,
        extra="ignore",
    )

    API_V1_STR: str = "/api/v1"

    # SECRET_KEY for JWT token generation
    # Calling secrets.token_urlsafe will generate a new secret everytime
    # the server restarts, which can be quite annoying when developing, where
    # a stable SECRET_KEY is prefered.
    # SECRET_KEY: str = secrets.token_urlsafe(32)
    SECRET_KEY: str = "temporarysecretkey"

    # database configurations
    MONGO_HOST: str
    MONGO_PORT: int
    MONGO_USER: str | None = None
    MONGO_PASSWORD: str | None = None
    MONGO_DB: str

    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    SERVER_NAME: str
    SERVER_HOST: AnyHttpUrl
    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000", \
    # "http://localhost:8080", "http://local.dockertoolbox.tiangolo.com"]'
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    PROJECT_NAME: str

    FIRST_SUPERUSER: EmailStr
    FIRST_SUPERUSER_PASSWORD: str

    # SSO ID and Secrets
    GOOGLE_CLIENT_ID: str | None = None
    GOOGLE_CLIENT_SECRET: str | None = None
    SSO_CALLBACK_HOSTNAME: str | None = None
    SSO_LOGIN_CALLBACK_URL: str | None = None


settings = Settings()  # type: ignore

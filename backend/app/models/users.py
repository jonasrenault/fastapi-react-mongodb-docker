from typing import Optional
from uuid import UUID, uuid4

from beanie import Document, Indexed
from pydantic import EmailStr, Field
from pymongo import IndexModel


class User(Document):
    uuid: UUID = Field(default_factory=uuid4)
    email: Indexed(EmailStr, unique=True)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    hashed_password: Optional[str] = None
    provider: Optional[str] = None
    picture: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False

    class Settings:
        # Set unique index on uuid here instead of using Indexed
        # because of https://github.com/roman-right/beanie/issues/701
        indexes = [
            IndexModel("uuid", unique=True),
        ]

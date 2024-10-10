from typing import Annotated
from uuid import UUID, uuid4

from beanie import Document, Indexed
from pydantic import EmailStr, Field


class User(Document):
    uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed(unique=True)]
    email: Annotated[EmailStr, Indexed(unique=True)]
    first_name: str | None = None
    last_name: str | None = None
    hashed_password: str | None = None
    provider: str | None = None
    picture: str | None = None
    is_active: bool = True
    is_superuser: bool = False

from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from beanie import Document, Indexed
from datetime import datetime
from uuid import UUID, uuid4


class User(Document):
    uuid: Indexed(UUID, unique=True) = Field(default_factory=uuid4)
    email: Indexed(EmailStr, unique=True)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False

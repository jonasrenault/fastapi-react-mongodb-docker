from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from beanie import Document, Indexed
from datetime import datetime
from uuid import UUID, uuid4


class UserAuth(BaseModel):
    """
    User register and login auth
    """

    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserOut(UserUpdate):
    email: Indexed(EmailStr, unique=True)
    disabled: bool = False
    uuid: Indexed(UUID, unique=True) = Field(default_factory=uuid4)


class User(UserOut, Document):
    password: str

    def __repr__(self) -> str:
        return f"<User {self.email}>"

    def __str__(self) -> str:
        return self.email

    def __hash__(self) -> int:
        return hash(self.email)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, User):
            return self.email == other.email
        return False

    @property
    def created(self) -> datetime:
        """Datetime user was created from ID"""
        return self.id.generation_time

    @classmethod
    async def by_email(cls, email: str) -> "User":
        """Get a user by email"""
        return await cls.find_one(cls.email == email)

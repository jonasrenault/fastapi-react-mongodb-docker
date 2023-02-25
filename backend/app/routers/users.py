from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException
from pymongo import errors

from ..auth.auth import get_hashed_password
from ..models.users import User, UserAuth, UserOut, UserUpdate

router = APIRouter()


@router.post("", response_model=UserOut)
async def add_user(user_auth: UserAuth):
    hashed = get_hashed_password(user_auth.password)
    user = User(
        email=user_auth.email,
        password=hashed,
        first_name=user_auth.first_name,
        last_name=user_auth.last_name,
    )
    try:
        await user.create()
        return user
    except errors.DuplicateKeyError:
        raise HTTPException(
            status_code=409, detail="User with that email already exists."
        )


@router.put("/{userid}", response_model=UserOut)
async def update_user(userid: UUID, update: UserUpdate):
    user = await User.find_one({"uuid": userid})
    user = user.copy(update=update.dict(exclude_unset=True))
    await user.save()
    return user


@router.get("/{userid}", response_model=UserOut)
async def get_user(userid: UUID):
    user = await User.find_one({"uuid": userid})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("", response_model=List[UserOut])
async def get_users(limit: Optional[int] = 10, offset: Optional[int] = 0):
    users = await User.find_all().skip(offset).limit(limit).to_list()
    return users


@router.delete("/{userid}", response_model=UserOut)
async def delete_user(userid: UUID):
    user = await User.find_one({"uuid": userid})
    await user.delete()
    return user

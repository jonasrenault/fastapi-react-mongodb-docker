from typing import List, Optional, Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, Body, Depends
from pymongo import errors
from pydantic.networks import EmailStr

from ..auth.auth import (
    get_hashed_password,
    get_current_active_superuser,
    get_current_active_user,
)
from .. import schemas, models

router = APIRouter()


@router.post("", response_model=schemas.User)
async def register_user(
    password: str = Body(...),
    email: EmailStr = Body(...),
    first_name: str = Body(None),
    last_name: str = Body(None),
):
    """
    Register a new user.
    """
    hashed_password = get_hashed_password(password)
    user = models.User(
        email=email,
        hashed_password=hashed_password,
        first_name=first_name,
        last_name=last_name,
    )
    try:
        await user.create()
        return user
    except errors.DuplicateKeyError:
        raise HTTPException(
            status_code=400, detail="User with that email already exists."
        )


@router.get("/me", response_model=schemas.User)
def get_profile(current_user: models.User = Depends(get_current_active_user)) -> Any:
    """
    Get current user.
    """
    return current_user


@router.put("/{userid}", response_model=schemas.User)
async def update_user(
    userid: UUID,
    update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_active_superuser),
) -> Any:
    """
    Update a user.

    ** Restricted to superuser **

    Parameters
    ----------
    userid : UUID
        the user's UUID
    update : schemas.UserUpdate
        the update data
    current_user : models.User, optional
        the current superuser, by default Depends(get_current_active_superuser)
    """
    user = await models.User.find_one({"uuid": userid})
    if update.password is not None:
        update.password = get_hashed_password(update.password)
    user = user.copy(update=update.dict(exclude_unset=True))
    await user.save()
    return user


@router.get("/{userid}", response_model=schemas.User)
async def get_user(userid: UUID):
    user = await models.User.find_one({"uuid": userid})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("", response_model=List[schemas.User])
async def get_users(limit: Optional[int] = 10, offset: Optional[int] = 0):
    users = await models.User.find_all().skip(offset).limit(limit).to_list()
    return users


@router.delete("/{userid}", response_model=schemas.User)
async def delete_user(userid: UUID):
    user = await models.User.find_one({"uuid": userid})
    await user.delete()
    return user

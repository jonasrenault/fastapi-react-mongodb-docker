from datetime import timedelta
from typing import Any

from app import models, schemas
from app.auth.auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    get_current_user_from_cookie,
)
from app.config.config import settings
from starlette.requests import Request
from starlette.responses import RedirectResponse
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_sso.sso.facebook import FacebookSSO
from fastapi_sso.sso.google import GoogleSSO

router = APIRouter()

google_sso = (
    GoogleSSO(
        settings.GOOGLE_CLIENT_ID,
        settings.GOOGLE_CLIENT_SECRET,
        f"{settings.SSO_CALLBACK_HOSTNAME}{settings.API_V1_STR}/login/google/callback",
    )
    if settings.GOOGLE_CLIENT_ID is not None
    and settings.GOOGLE_CLIENT_SECRET is not None
    else None
)

facebook_sso = (
    FacebookSSO(
        settings.FACEBOOK_CLIENT_ID,
        settings.FACEBOOK_CLIENT_SECRET,
        f"{settings.SSO_CALLBACK_HOSTNAME}{settings.API_V1_STR}/login/facebook/callback",
    )
    if settings.FACEBOOK_CLIENT_ID is not None
    and settings.FACEBOOK_CLIENT_SECRET is not None
    else None
)


@router.post("/access-token", response_model=schemas.Token)
async def login_access_token(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(user.uuid, expires_delta=access_token_expires)
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/test-token", response_model=schemas.User)
async def test_token(current_user: models.User = Depends(get_current_user)) -> Any:
    """
    Test access token
    """
    return current_user


@router.get("/refresh-token", response_model=schemas.Token)
async def test_token(
    current_user: models.User = Depends(get_current_user_from_cookie),
) -> Any:
    """
    Return a new token for current user
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        current_user.uuid, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/google")
async def google_login():
    """
    Generate login url and redirect
    """
    return await google_sso.get_login_redirect()


@router.get("/google/callback")
async def google_callback(request: Request):
    """
    Process login response from Google and return user info
    """
    # Get user details from Google
    google_user = await google_sso.verify_and_process(request)

    # Check if user is already created in DB
    user = await models.User.find_one({"email": google_user.email})
    if user is None:
        # If user does not exist, create it in DB
        user = models.User(
            email=google_user.email,
            first_name=google_user.first_name,
            last_name=google_user.last_name,
            picture=google_user.picture,
            provider=google_user.provider,
        )
        user = await user.create()

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    # Login user by creating access_token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(user.uuid, expires_delta=access_token_expires)
    response = RedirectResponse(settings.SSO_LOGIN_CALLBACK_URL)
    response.set_cookie(
        "Authorization",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=120,
        expires=120,
    )
    return response

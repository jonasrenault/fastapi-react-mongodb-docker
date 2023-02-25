from fastapi import APIRouter

from . import users

api_router = APIRouter()
# api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])


@api_router.get("/")
async def root():
    return {"message": "Backend API for FARM-docker operational !"}

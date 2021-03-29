import os
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from core.auth import auth_utils
from fastapi_crud_orm_connector.api import security
from fastapi_crud_orm_connector.utils.rdb_session import get_rdb

ACCESS_TOKEN_EXPIRE_MINUTES = 90
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"

auth_router = r = APIRouter()


@r.post("/token")
async def login(
        db=Depends(get_rdb), form_data: OAuth2PasswordRequestForm = Depends()
):
    user = auth_utils.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    if user.is_superuser:
        permissions = "admin"
    else:
        permissions = "user"
    access_token = security.create_access_token(
        data={"sub": user.email, "permissions": permissions},
        expires_delta=access_token_expires, secret_key=SECRET_KEY, algorithm=ALGORITHM
    )

    return {"access_token": access_token, "token_type": "bearer"}


@r.post("/signup")
async def signup(
        db=Depends(get_rdb), form_data: OAuth2PasswordRequestForm = Depends()
):
    user = auth_utils.sign_up_new_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Account already exists",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    if user.is_superuser:
        permissions = "admin"
    else:
        permissions = "user"
    access_token = security.create_access_token(
        data={"sub": user.email, "permissions": permissions},
        expires_delta=access_token_expires, secret_key=SECRET_KEY, algorithm=ALGORITHM,
    )

    return {"access_token": access_token, "token_type": "bearer"}

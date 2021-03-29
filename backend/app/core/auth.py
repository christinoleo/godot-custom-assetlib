import os
from fastapi_crud_orm_connector.api.auth import Authentication
from fastapi_crud_orm_connector.orm.user_crud import rdb_user_crud
from fastapi_crud_orm_connector.utils.rdb_session import get_rdb

ACCESS_TOKEN_EXPIRE_MINUTES = 90
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"

auth_utils = Authentication(get_rdb, rdb_user_crud(), SECRET_KEY, ALGORITHM)

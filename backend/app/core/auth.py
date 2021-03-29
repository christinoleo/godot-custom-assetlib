import os

from fastapi_crud_orm_connector.api.auth import Authentication
from fastapi_crud_orm_connector.api.security import get_password_hash
from fastapi_crud_orm_connector.orm.user_crud import rdb_user_crud, mdb_user_crud, dict_user_crud
from fastapi_crud_orm_connector.utils.dict_session import DictSession
from fastapi_crud_orm_connector.utils.mongodb_session import MongoDBSession
from fastapi_crud_orm_connector.utils.rdb_session import RDBSession

ACCESS_TOKEN_EXPIRE_MINUTES = 300
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"

USER_DATABASE_URL = os.getenv('USER_DATABASE_URL')
if USER_DATABASE_URL is not None:
    if 'mongodb' in USER_DATABASE_URL:
        user_session = MongoDBSession(USER_DATABASE_URL, os.getenv('USER_DATABASE'))
        user_crud = mdb_user_crud()
    else:
        user_session = RDBSession(USER_DATABASE_URL)
        user_crud = rdb_user_crud()
else:
    users = []
    if os.getenv('TEST_USERNAME', False):
        users.append({'id': 0,
                      'email': os.getenv('TEST_USERNAME'),
                      'hashed_password': get_password_hash(os.getenv('TEST_PASSWORD', 'password')),
                      'is_superuser': True,
                      'is_active': True,
                      })
    user_session = DictSession(users)
    user_crud = dict_user_crud(users)

auth_utils = Authentication(user_session, user_crud, SECRET_KEY, ALGORITHM)

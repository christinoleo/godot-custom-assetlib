from fastapi import Depends, APIRouter

from api.v1.auth import auth_router
from api.v1.nsquality_map import nsquality_map_router
from core.auth import auth_utils
from db.crud import pandas_crud_instance
from db.models import Metadata, NSQuality, nsquality_model_map, metadata_model_map

# Routers
from fastapi_crud_orm_connector.api.crud_router import configure_crud_router
from fastapi_crud_orm_connector.api.user_router import generate_user_router
from fastapi_crud_orm_connector.orm.rdb_crud import RDBCrud
from fastapi_crud_orm_connector.orm.user_crud import rdb_user_crud
from fastapi_crud_orm_connector.utils.rdb_session import get_rdb


def generate_routers(app):
    app.include_router(
        generate_user_router(APIRouter(), auth_utils, rdb_user_crud()),
        prefix="/api/v1",
        tags=["users"],
        dependencies=[Depends(auth_utils.get_current_active_user)],
    )
    app.include_router(auth_router, prefix="/api", tags=["auth"])

    app.include_router(
        configure_crud_router(APIRouter(), RDBCrud(Metadata, metadata_model_map), "/metadata", get_rdb),
        prefix="/api/v1",
        tags=["metadata"],
        dependencies=[Depends(auth_utils.get_current_active_superuser)],
    )

    app.include_router(
        configure_crud_router(APIRouter(), pandas_crud_instance, "/metadata2", get_rdb),
        prefix="/api/v1",
        tags=["metadata"],
        dependencies=[Depends(auth_utils.get_current_active_superuser)],
    )

    app.include_router(
        configure_crud_router(APIRouter(), RDBCrud(NSQuality, nsquality_model_map), "/nsquality", get_rdb),
        prefix="/api/v1",
        tags=["nsquality"],
        dependencies=[Depends(auth_utils.get_current_active_superuser)],
    )

    app.include_router(
        nsquality_map_router,
        prefix="/api/v1",
        tags=["nsquality"],
        dependencies=[Depends(auth_utils.get_current_active_superuser)],
    )

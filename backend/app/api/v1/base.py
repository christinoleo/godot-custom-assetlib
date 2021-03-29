from fastapi import Depends, APIRouter

# Routers
from api.asset_crud import asset_router, pandas_asset_crud
from api.categories_crud import configure_router, pandas_categories_crud
from api.v1.auth import auth_router
from core.auth import auth_utils, user_crud
from fastapi_crud_orm_connector.api.crud_router import configure_crud_router, DefaultAdminRouter
from fastapi_crud_orm_connector.api.user_router import generate_user_router
from fastapi_crud_orm_connector.utils.dict_session import PandasSession


def generate_routers(app):
    app.include_router(
        generate_user_router(APIRouter(), auth_utils, user_crud),
        prefix="/api/v1",
        tags=["users"],
        dependencies=[Depends(auth_utils.get_current_active_user)],
    )
    app.include_router(auth_router, prefix="/api", tags=["auth"])

    # app.include_router(
    #     asset_router,
    #     prefix="/api/v1",
    #     tags=["nsquality"],
    #     dependencies=[Depends(auth_utils.get_current_active_superuser)],
    # )

    app.include_router(
        configure_router,
        prefix="/asset-library/api",
        tags=["godot AssetLib api", "category/configuration api"],
    )

    app.include_router(
        asset_router,
        prefix="/asset-library/api",
        tags=["godot AssetLib api", "plugin assets api"],
    )

    app.include_router(
        configure_crud_router(APIRouter(),
                              "/categories",
                              get_db=PandasSession(pandas_categories_crud.db).get_db,
                              router=DefaultAdminRouter(pandas_categories_crud)
                              ),
        prefix="/api/v1",
        tags=["react-admin api", "category/configuration api"],
        dependencies=[Depends(auth_utils.get_current_active_superuser)],
    )

    app.include_router(
        configure_crud_router(APIRouter(),
                              "/assets",
                              get_db=PandasSession(pandas_asset_crud.db).get_db,
                              router=DefaultAdminRouter(pandas_asset_crud)
                              ),
        prefix="/api/v1",
        tags=["react-admin api", "plugin assets api"],
        dependencies=[Depends(auth_utils.get_current_active_superuser)],
    )

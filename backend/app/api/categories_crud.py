import os
from typing import List

import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel

from fastapi_crud_orm_connector.orm.pandas_crud import PandasCrud


class Category(BaseModel):
    id: int
    name: str
    type: int


class Configure(BaseModel):
    categories: List[Category]


pandas_categories_crud = PandasCrud(
    schema='Categories', file_path=os.getenv('CATEGORIES_PATH')
)

# pandas_assets_crud = PandasCrud(pd.read_csv(os.getenv('ASSETS_PATH'), index_col=False), 'Assets')
# pd.json_normalize(a['categories']).set_index('id').to_csv('./backend/local_storage/categories.csv')


configure_router = APIRouter()


@configure_router.get('/configure',
                      response_model=Configure,
                      response_model_exclude_none=True, )
async def get_all():
    ret = pandas_categories_crud.get_all()
    return Configure(categories=ret.list)

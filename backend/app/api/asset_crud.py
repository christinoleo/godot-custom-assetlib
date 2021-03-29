import os
from enum import Enum
from typing import List, Optional

import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel

from fastapi_crud_orm_connector.orm.crud import DataSort, DataSortType
from fastapi_crud_orm_connector.orm.pandas_crud import PandasCrud
from fastapi_crud_orm_connector.utils.pydantic_schema import pd2pydantic

asset_router = APIRouter()


class AssetListItem(BaseModel):
    asset_id: str
    title: str = ''
    type: str = ''
    author: str = ''
    author_id: str = ''
    category: str = ''
    category_id: str = ''
    godot_version: str = ''
    rating: str = ''
    cost: str = ''
    support_level: str = ''
    icon_url: str = ''
    version: str = ''
    version_string: str = ''
    modify_date: str = ''


class Asset(AssetListItem):
    description: str = ''
    download_provider: str = ''
    download_commit: str = ''
    browse_url: str = ''
    issues_url: str = ''
    searchable: str = ''
    download_url: str = ''
    previews: List = []
    download_hash: str = ''


# class Configure(BaseModel):
#     categories: List[Category]


pandas_asset_crud = PandasCrud(
    schema='Asset', file_path=os.getenv('ASSETS_PATH')
)


# pandas_assets_crud = PandasCrud(pd.read_csv(os.getenv('ASSETS_PATH'), index_col=False), 'Assets')

# pd.json_normalize(a['categories']).set_index('id').to_csv('./backend/local_storage/categories.csv')


class AssetListResponse(BaseModel):
    result: List[AssetListItem]
    page: int
    pages: int
    page_length: int
    total_items: int


class SortTypes(str, Enum):
    updated = "updated"
    name = "name"
    cost = "cost"


@asset_router.get('/asset')
async def get_all(
        godot_version: Optional[str] = None,
        support_key: Optional[str] = 'official+community+testing',
        category: Optional[int] = None,
        reverse: bool = False,
        filter: Optional[str] = None,
        sort: SortTypes = SortTypes.updated,
        page: Optional[int] = 0,
):
    page_length = 40

    _sort = None
    if sort == SortTypes.updated:
        _sort = DataSort(field='modify_date', type=DataSortType.DESC if reverse == False else DataSortType.ASC)
    elif sort == SortTypes.name:
        _sort = DataSort(field='title', type=DataSortType.DESC if reverse == False else DataSortType.ASC)
    elif sort == SortTypes.cost:
        _sort = DataSort(field='cost', type=DataSortType.DESC if reverse == False else DataSortType.ASC)

    _filter = dict()
    if godot_version is not None:
        _filter['godot_version'] = godot_version.split('.')[0]
    if category is not None:
        _filter['category_id'] = category
    if filter is not None:
        _filter['title'] = filter
    if support_key is not None:
        _filter['support_level'] = support_key.split('+')

    ret = pandas_asset_crud.get_all(
        data_sort=_sort,
        data_filter=_filter,
        offset=page * page_length,
        limit=page_length,
    )

    items = []
    for x in ret.list:
        _item_dict = x.dict()
        _item_dict['asset_id'] = x.id  # Convert to GODOT's method of asset id
        items.append(AssetListItem(**_item_dict))

    return AssetListResponse(
        result=items,
        page=page,
        pages=1 + (ret.count // page_length),
        page_length=page_length,
        total_items=ret.count
    )


@asset_router.get('/asset/{_id:int}')
async def get(_id: int):
    ret = pandas_asset_crud.get(entry_id=_id)
    if isinstance(ret.previews, str):
        ret.previews = list(ret.previews)
    ret = ret.dict()
    for k, v in ret.items():
        if v is None: ret[k] = ''
    ret['asset_id'] = _id
    return Asset(**ret)

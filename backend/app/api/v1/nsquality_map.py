from collections import defaultdict
from operator import and_
from typing import List, Optional, Dict

from fastapi import Request, Depends, Response, APIRouter
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy import String as ormString

from db.crud import pandas_crud_instance
from db.models import NSQuality
from sqlalchemy.sql import label

from fastapi_crud_orm_connector.utils.rdb_session import get_rdb

nsquality_map_router = APIRouter()
url = '/nsquality_map'


class DataFields(BaseModel):
    name: str
    label: Optional[str]
    operation: str = 'sum'
    filter: Optional[str] = None


class MapRequest(BaseModel):
    index_field: str = 'PC1'
    map_fields: List[DataFields]
    weighted: bool = True
    split: bool = False


class MapResponse(BaseModel):
    data: Dict[str, List]
    metadata: Dict


operation_map = dict(
    sum=func.sum,
    max=func.max,
    min=func.min,
    mean=func.avg,
    count=func.count,
)


@nsquality_map_router.post(url,
                           response_model=MapResponse,
                           response_model_exclude_none=True, )
async def get_all(request: Request,
                  response: Response,
                  map_request: MapRequest,
                  db=Depends(get_rdb)):
    # configure metadata name of index field
    # name_map = pandas_crud_instance.get_all(data_filter=dict(id=map_request.index_field)).list[0]
    pandas_crud_instance.get_all(data_filter=dict(id=map_request.map_fields[0].name))
    metadata = dict()
    group_by = []
    filter_by = []
    q = [getattr(NSQuality, map_request.index_field)]
    for f in map_request.map_fields:
        l = f.label if f.label is not None else f.name
        _metadata = pandas_crud_instance.get_all(data_filter=dict(id=f.name))
        metadata[f.name] = _metadata.list[0] if _metadata.count > 0 else None

        if map_request.weighted:
            q.append(label(f.label, operation_map[f.operation](getattr(NSQuality, f.name)) / func.avg(NSQuality.WGHT)))
        else:
            q.append(label(f.label, operation_map[f.operation](getattr(NSQuality, f.name))))
        # if map_request.split and len(metadata[f.name].metadata_replace) > 0:
        #     q.append(label(f.name, getattr(NSQuality, f.name)))
        #     group_by.append(getattr(NSQuality, f.name))

        if f.filter:
            filter_by.append(_generate_filter(NSQuality, f.name, f.filter))

        # else:
        #     q.append(label(f.label, getattr(NSQuality, f.name)))
        # db.query(label('count', func.count()), NSQuality.GENDER, getattr(NSQuality, map_request.index_field)).group_by(NSQuality.GENDER, getattr(NSQuality, map_request.index_field)).all()

    group_by.append(getattr(NSQuality, map_request.index_field))
    ret_list = defaultdict(list)
    query = db.query(*q)
    if len(filter_by) > 0:
        query = query.filter(and_(*filter_by) if len(filter_by) > 1 else filter_by[0])
    query = query.group_by(*group_by)

    for i, e in enumerate(query.all()):
        r = e._asdict()
        # r['name'] = name_map.dict()[str(r[map_request.index_field])]
        ret_list[r[map_request.index_field]].append(r)
    ret_list = dict(ret_list)
    return MapResponse(data=ret_list, metadata=metadata)


def _generate_filter(model, field, value):
    _inner = getattr(model, field)
    if hasattr(_inner, 'type'):
        if isinstance(_inner.type, ormString):  # text
            ret = _inner.ilike(f'%{value}%')
        elif isinstance(value, list):
            ret = _inner.in_(value)
        else: # number
            ret = _inner == value
        return ret

import json
from collections import defaultdict
from typing import List, Optional, Dict

import pandas as pd
from fastapi import Request, Depends, Response, APIRouter
from pydantic import BaseModel
from sqlalchemy import func

from db.crud import pandas_nsquality_metadata_crud, pandas_nsquality_crud
from fastapi_crud_orm_connector.orm.crud import DataGroupBy, MathOperation

nsquality_map_router = APIRouter()
url = '/nsquality_map'


class DataFields(BaseModel):
    name: str
    label: Optional[str]
    operation: MathOperation = MathOperation.sum
    filter: Optional[Dict] = None
    split: bool = False
    weighted: bool = True


class MapRequest(BaseModel):
    index_field: str = 'location_postal'
    map_fields: List[DataFields]
    weighted: bool = True
    split: bool = False


class MapResponse(BaseModel):
    data: Dict[str, Dict]
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
                  db=Depends()):
    # configure metadata name of index field
    # name_map = pandas_crud_instance.get_all(data_filter=dict(id=map_request.index_field)).list[0]
    metadata = pandas_nsquality_metadata_crud.get_all(data_filter=dict(id=[f.name for f in map_request.map_fields]),
                                                      data_parse={"path": lambda v: v.str.split('>>'),
                                                                  "metadata_replace": lambda v: v.apply(json.loads)},
                                                      to_schema=False)
    metadata['name'] = metadata['id']
    metadata['id'] = metadata['id'].map({f.name: f.label if f.label is not None else f.name for f in map_request.map_fields})
    metadata = metadata.set_index('id').T.to_dict()
    ret_list = defaultdict(dict)
    for f in map_request.map_fields:
        label = f.label if f.label is not None else f.name

        if not f.split:
            ret = pandas_nsquality_crud.get_all(limit=-1,
                                                data_filter=f.filter,
                                                data_fields=[f.name],
                                                data_group_by=DataGroupBy(data_fields=[map_request.index_field], operation=f.operation),
                                                to_schema=False).iloc[:, 0]
            if f.weighted:
                weight = pandas_nsquality_crud.get_all(limit=-1,
                                                       data_filter=f.filter,
                                                       data_fields=['WGHT'],
                                                       data_group_by=DataGroupBy(data_fields=[map_request.index_field], operation=MathOperation.mean),
                                                       to_schema=False).iloc[:, 0]
                ret = ret.divide(weight)
            ret = pd.DataFrame(ret)
            ret.columns = [label]
            for k, v in ret.fillna(0).T.to_dict().items():
                ret_list[k].update(v)
        else:
            ret = pandas_nsquality_crud.get_all(limit=-1,
                                                data_filter=f.filter,
                                                data_fields=[f.name],
                                                data_group_by=DataGroupBy(data_fields=[map_request.index_field, f.name], operation=f.operation,
                                                                          unstack=True),
                                                to_schema=False)
            if metadata[label]["metadata_replace"]:
                ret.columns = [metadata[label]["metadata_replace"][c] for c in ret.columns.astype(int).astype(str)]

            for k, v in ret.fillna(0).T.to_dict().items():
                ret_list[k][label] = v

    ret_list = dict(ret_list)
    return MapResponse(data=ret_list, metadata=metadata)

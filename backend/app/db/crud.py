import os
import pandas as pd

from fastapi_crud_orm_connector.orm.pandas_crud import PandasCrud
from fastapi_crud_orm_connector.utils.pydantic_schema import pd2pydantic

df_metadata = pd.read_csv(os.getenv('METADATA_PATH'))
pandas_crud_instance = PandasCrud(df_metadata, pd2pydantic('Metadata2', df_metadata))

# %%
from typing import Optional

import pandas as pd
from pandas.core.dtypes.cast import convert_dtypes
from pydantic import create_model, BaseConfig

from db.orm.pandas_crud import PandasCrud
from db.orm.schema import pd2pydantic

df = pd.read_csv('metadata.csv')


# %%

pydantic_model = pd2pydantic('Metadata', df)

pydantic_model(**df.iloc[0,:].dropna().to_dict())
[ pydantic_model(**v.dropna().to_dict()) for k,v in df.iterrows() ]

# %%
pc = PandasCrud(df, )

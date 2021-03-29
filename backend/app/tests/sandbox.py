# %%
import os
from collections import defaultdict

from db.crud import GenericCrud, PublicationCrud, models
from db.models import Metadata, NSQuality
from db.schemas import publication

# %%

os.chdir('backend')
os.chdir('app')
os.getcwd()
os.environ['DATABASE_URL'] = "sqlite:///./sql_app.db"


db = SessionLocal()

# %%
crud = GenericCrud(db, Publication)

p = publication.Create(**dict(
    title='1',
    author_ids=[1, 2, 3],
    authors=None,
    journal='1',
    link='1',
    summary='1',
    abstract='1',
    notes='1',
    bibtex='1',
))
crud.create(p)
crud.get_all()

#%%
Publication(**dict(
    title='1',
    authors=[],
    journal='1',
    link='1',
    summary='1',
    abstract='1',
    notes='1',
    bibtex='1',
))

#%% test tinydb
import os
if os.getcwd() != 'E:\\Projects\\phd\\engagens\\backend\\app':
    os.chdir('E:\\Projects\\phd\\engagens\\backend\\app')

#%%
# from tinydb import TinyDB, Query
# tinydb = TinyDB('../local_storage/example.json')
os.environ['DATABASE_URL'] = "sqlite:///../local_storage/db.sqlite"

from fastapi_crud_orm_connector.utils.rdb_session import SessionLocal
from db.models import Metadata

from db.models import Metadata, NSQuality
db = SessionLocal()
# m = list(db.query(Metadata).all())
nsq = list(db.query(NSQuality).all())


#%%
from collections import defaultdict
from pprint import pprint
table = tinydb.table('metadata')
table.truncate()
d = defaultdict(dict)
for mm in m:
    if mm.subheading.title().strip() not in d[mm.heading.title().strip()]:
        d[mm.heading.title().strip()][mm.subheading.title().strip()] = list()
    d[mm.heading.title().strip()][mm.subheading.title().strip()].append({
        'description': mm.description.strip(),
        'continuous': mm.continuous,
        'index': mm.index.strip(),
    })
d = dict(d)
pprint(d)

Query()

#%%
import pandas as pd
census = pd.read_csv('../local_storage/census2.csv')
# census['GEO_NAME'].unique()

#%%
import json
from typing import Dict

with open('../local_storage/census2.json') as json_file:
    jcensus = json.load(json_file)

cols = ['GEO_CODE (POR)', 'Dim: Sex (3): Member ID: [1]: Total - Sex', 'Dim: Sex (3): Member ID: [2]: Male', 'Dim: Sex (3): Member ID: [3]: Female']

#%%
def get_census(id):
    return census.filter(items=cols)\
        .rename(columns={'Dim: Sex (3): Member ID: [1]: Total - Sex': 'total',
                'Dim: Sex (3): Member ID: [2]: Male': 'male',
                'Dim: Sex (3): Member ID: [3]: Female': 'female',
                 })\
        .iloc[np.arange(id, census.shape[0], int(2247)), :]\
        .set_index('GEO_CODE (POR)')\
        .replace('...', '-1')\
        .replace('x', '-1')\
        .astype(dict(total=float, male=float, female=float))\
        .to_dict()

# print(get_census(661))
# 'Total - Low-income status in 2015 for the population in private households to whom low-income concepts are applicable - 100% data' in census.loc[:, 'DIM: Profile of Forward Sortation Areas (2247)'].to_list()
#%%

with open('../local_storage/census2.json') as json_file:
    jcensus = json.load(json_file)

def populate(j, id=0):
    for k in j.keys():
        v = j[k]
        # print(0, k, census.loc[id, 'DIM: Profile of Forward Sortation Areas (2247)'].encode('utf-8'))
        while k.encode("ascii","ignore") != census.loc[id, 'DIM: Profile of Forward Sortation Areas (2247)'].encode("ascii","ignore"):
            id += 1
            if id > 2250: raise Exception(id, k, j)
        # print(1, k, census.loc[id, 'DIM: Profile of Forward Sortation Areas (2247)'], id)
        tmp = get_census(id)
        if len(v.keys()) > 0:
            j[k], id = populate(v, id)
        if tmp is not None:
            j[k]['value'] = tmp
    return j, id

jcensusc = populate(jcensus)[0]
#%%
import uuid
lcensusc = dict()
def get_census_list(j):
    if len(j.keys()) == 0: return []
    _inner = []
    for k, v in j.items():
        print(k, v)
        if 'value' in v:
            ii = uuid.uuid4()
            lcensusc[str(ii)] = v['value']
            del v['value']
            _inner.append(k + '>>' + str(ii))
        for inner in get_census_list(v):
            _inner.append(k + '>>' + inner)
    return _inner

lcensus = []
for k, v in jcensusc.items():
    if 'value' in v:
        ii = uuid.uuid4()
        lcensusc[str(ii)] = v['value']
        del v['value']
        lcensus.append(k + '>>' + str(ii))
    for inner in get_census_list(v):
        lcensus.append(k + '>>' + inner)

dfcensus = pd.DataFrame.from_dict(lcensusc)
dfcensus2 = pd.DataFrame(columns=['index', 'variable'])
for label, content in dfcensus.iteritems():
    dfcensus2 = pd.merge(dfcensus2, content.apply(pd.Series).T.melt(ignore_index=False, value_name=label).reset_index(), on=['index', 'variable'], how='outer')
# dfcensus2 = dfcensus2[dfcensus2.drop(['index', 'variable'], axis=1).sum(axis=0) > -1]
dfcensus2.rename(columns=dict(index='postal')).to_csv('../local_storage/thecensus.csv',index=False)

dfcesusm = pd.DataFrame(lcensus, columns=['aaa']).aaa.str.rpartition('>>').rename(columns={0:'path', 2:'id'})[['id', 'path']]
dfcesusm.to_csv('../local_storage/thecensus_metadata.csv',index=False)

#%%


#%%
with open('../local_storage/census3.json', 'wt') as json_file:
    json.dump(dict(census_2016=jcensusc[0]), json_file, indent=4)

#%%
df = pd.read_csv('../local_storage/nsquality_hierarchy_old.csv')

df = df.drop([0, 1, 276])
df = df.rename(columns=dict(continuous='metadata_continuous', index='id'))
df = df.assign(metadata_replace=pd.Series(json.loads))
df = df.assign(path=pd.Series(json.loads))
# df['metadata_replace'] = 'asd'
for index, row in df.iterrows():
    d = dict()
    for i in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,99]:
        if not pd.isnull(row[str(i)]): d[i]=row[str(i)]
    df.loc[index, 'metadata_replace'] = json.dumps(d)
    df.loc[index, 'path'] = f'{row.heading}>>{row.subheading}>>{row.description}'

df = df[['id', 'metadata_replace', 'path']]
df.to_csv('../local_storage/nsquality_hierarchy.csv', index=False)
df2 = pd.read_csv('../local_storage/nsquality_hierarchy.csv')

#df.loc[df.path.str.extract(r'COMMUNITY VITALITY>>(.*)').dropna().index]
#df[df.path.str.contains('>>Social support>>', regex=True, na=False)]
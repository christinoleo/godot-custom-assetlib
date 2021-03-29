#%%
import os

os.chdir('backend')
os.chdir('app')

# if os.getenv('DATABASE_URL') is None:
os.environ['DATABASE_URL'] = "sqlite:///./sql_app.db"

#%% restart database
from db.models import Base
from db.session import engine
Base.metadata.create_all(engine)

from alembic.config import Config
from alembic import command
alembic_cfg = Config("alembic.ini")
command.stamp(alembic_cfg, "head")

#%% generate migration
from alembic import config
text = 'change association'
alembicArgs = [
    'revision', '--autogenerate', '-m', f'"{text}"',
]
config.main(argv=alembicArgs)

#%% upgrade
from alembic import config
alembicArgs = [
    '--raiseerr',
    'upgrade', 'head',
]
config.main(argv=alembicArgs)

#%%
from alembic import config
alembicArgs = [
    '--raiseerr',
    'upgrade', '+1',
]
config.main(argv=alembicArgs)

#%%
from alembic import config
alembicArgs = [
    'downgrade', 'head'
]
config.main(argv=alembicArgs)
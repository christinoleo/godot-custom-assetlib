#%%
import os, sys
from pathlib import Path

from alembic import config
from alembic.config import Config
from alembic import command


text = os.getenv('text', 'noname')

p = Path(os.getcwd()) / 'app_alembic'
alembic_cfg = Config("alembic.ini")
alembic_cfg.set_main_option('script_location', str(p.absolute()))
alembic_cfg.set_main_option('sqlalchemy.url', os.getenv('DATABASE_URL'))
command.revision(alembic_cfg, autogenerate=True, message=text)

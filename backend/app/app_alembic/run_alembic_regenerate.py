#%%
import os
from db.models import Base
from db.session import engine
Base.metadata.create_all(engine)

from alembic.config import Config
from alembic import command
alembic_cfg = Config("alembic.ini")
command.stamp(alembic_cfg, "head")

from app.app_alembic.initial_data import init
init()
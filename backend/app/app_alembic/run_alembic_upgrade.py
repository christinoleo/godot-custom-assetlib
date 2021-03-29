# %%
import os
from alembic import config

alembicArgs = [
    '--raiseerr',
    'upgrade', 'head',
]
if os.getenv('down', 0) == 1:
    alembicArgs = [
        '--raiseerr',
        'downgrade', 'head',
    ]
config.main(argv=alembicArgs)

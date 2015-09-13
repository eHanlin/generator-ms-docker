
from ..settings import *
import json

with open( CONFIG_FILE_PATH, encoding = 'utf-8' ) as f:
    data = json.loads(f.read())
    f.close()

with open( SHARE_CONFIG_FILE_PATH, encoding = 'utf-8' ) as f:
    share_data = json.loads(f.read())
    f.close()

def get( name ): return data.get( name ) or share_data.get( name )


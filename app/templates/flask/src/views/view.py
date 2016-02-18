from ..settings import *
from ..application import app
from ..decorators.template import Template
from ..services import config_service

@app.route( ROOT_PATH + "/" )
@Template("index.html")
def index_page():
    return dict(
        content = 'Hello world!',
        environment = config_service.get("environment"),
        version = config_service.get('version')
    )


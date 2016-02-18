
from ..application import app
from ..services import config_service

static_url_path = config_service.get("staticUrlPath")
static_s3_host = config_service.get("staticS3Host") or ""

@app.template_filter()
def static_root_path(path):
    return "{0}{1}/{2}".format(static_s3_host, static_url_path, path)



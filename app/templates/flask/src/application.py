
from flask import Flask
from .services import config_service

static_folder = config_service.get("staticFolder")
static_url_path = config_service.get("staticUrlPath")

app = Flask(__name__, static_folder = static_folder, static_url_path = static_url_path)


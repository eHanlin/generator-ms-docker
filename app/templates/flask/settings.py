import re

SETTING_FILE_PATH = re.sub( r"/settings.pyc?", "", __file__)
I18N_PATH = "{0}/{1}".format( SETTING_FILE_PATH, "config/i18n" )
CONFIG_PATH = "{0}/{1}".format(SETTING_FILE_PATH, "config")
CONFIG_FILE_PATH = "{0}/config.json".format(CONFIG_PATH)
SHARE_CONFIG_FILE_PATH = "{0}/shareConfig.json".format(CONFIG_PATH)
ROOT_PATH = ""


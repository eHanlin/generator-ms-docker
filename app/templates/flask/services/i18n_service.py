
import re
import json
from os import listdir
from ..settings import *

I18N_DICT = dict()

def __get( name, default = True ):

    i18n = I18N_DICT.get( name )

    if not i18n:
        files = listdir( I18N_PATH )
        i18n_file = "{0}.json".format( name )

        if i18n_file in files:
            with open("{0}/{1}".format( I18N_PATH, i18n_file ),  encoding='utf-8') as f:
                i18n = json.loads(f.read())
                f.close()

    if not i18n and default:
        i18n = __get( "default", False )

    if not i18n: return dict()

    I18N_DICT[name] = i18n
    return i18n

def get_by_request( request ):

    for accept_language in request.accept_languages:
        i18n = __get( accept_language[0] )
        if i18n: return i18n

    return __get( "default" )

def get_page_by_request( request ):

    r_root = re.compile( "^{0}".format( ROOT_PATH ) )
    i18n = get_by_request( request )
    path = re.sub(r_root, "", request.path)
    return  i18n.get( re.sub(r"\.[^\\]*$", "", path )) or dict()

def get( name ): return __get( name )
        

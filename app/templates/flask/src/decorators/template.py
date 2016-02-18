
from .wrapper import Wrapper
from flask import render_template, request
from ..services import i18n_service

class Template( Wrapper ):

    def wrap( self, fn, input_params ):
        default_params = self.get_default_params()
        template_name = default_params.get("args")[0]
        result = fn()
        if not result: result = dict()

        result["I18N"] = i18n_service.get_by_request( request )
        result["PAGE_I18N"] = i18n_service.get_page_by_request( request )

        return render_template( template_name, **result )


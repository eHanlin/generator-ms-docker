
from functools import wraps

class Wrapper( object ):
 
    def __init__( self, *args, **kwargs ):
        self.__inject_params = {"args":args, "kwargs": kwargs}

    def get_default_params( self ): return self.__inject_params
 
    def __call__( self, fn ):    
     
        @wraps(fn)
        def newFn( *args, **kwargs ): return fn( *args, **kwargs )
     
        @wraps(fn)
        def wrap( *args, **kwargs ):
          def closureFn(): return newFn( *args, **kwargs )
          input_params = {"args":args,"kwargs":kwargs}
          return self.wrap( closureFn, input_params )
 
        return wrap
 
    def wrap( self, fn ): return fn()


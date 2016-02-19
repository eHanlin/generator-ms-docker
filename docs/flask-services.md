Support Flask default services
======================================

This generator support services：

* config_service

  It's able to get `config.jsonnet` values.

  ```py
  config_service.get("environment")
  ```

* i18n_service

  Get i18n texts by request in `i18n default.jsonnet` file.
  ```py
  i18n_service.get_page_by_request( request )
  ```

The configs follow the current **environment** which is able to switch by the `gulp env` 、 `gulp env:test` or `gulp env:production`.


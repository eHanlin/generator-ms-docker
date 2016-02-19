Support Flask template usages
======================================

In `decorators` package has a template file, it's able to help you for template i18n texts.

This a **view** code：

```py
from ..decorators.template import Template

@app.route( ROOT_PATH + "/" )
@Template("index.html")

def index_page():
    return dict(
        content = 'Hello world!'
    )
```

The template sample codes：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{I18N["appName"]}} - {{PAGE_I18N["title"]}}</title>
</head>
<body>
  {{content}}
</body>
</html>
```

The `@Template` support `PAGE_I18N` and `I18N` variables in templates. They will help you to get global or page i18n texts to display template.

According to `i18n/default.jsonnet` file that config contents had mapping paths, they will be able to get value by `PAGE_I18N`.

Here is the i18n example：

```js
{
  "/":{
    "title":"Home Page"
  }
}
```

Use `static_root_path` filter if you want to set a relative path by **ROOT_PATH**.

Follow here：

```html
{{"resource/personPhoto.jpg"| static_root_path}}
```


Generate a flask project
=========================

This generator can generate default flask files, and it is be able to run to docker container.

In the docker container is running flask project which will expose **4000** port of uwsgi protocol.

And you need to set dispatcher(nginx or apache...) to dispatch uwsgi protocol.

## Generate the tree of project

You will see the tree if you use `yo ms-docker` to generate flask project.

```
.
├── README.md
├── gulpfile.js
├── install.sh
├── package.json
├── node_modules
└── src
    ├── app.py
    ├── flask_project
    │   ├── __init__.py
    │   ├── application.py
    │   ├── controllers
    │   │   └── __init__.py
    │   ├── decorators
    │   │   ├── __init__.py
    │   │   ├── template.py
    │   │   └── wrapper.py
    │   ├── filters
    │   │   └── __init__.py
    │   ├── services
    │   │   ├── __init__.py
    │   │   ├── config_service.py
    │   │   └── i18n_service.py
    │   ├── settings.py
    │   ├── templates
    │   │   ├── base.html
    │   │   └── index.html
    │   └── views
    │       ├── __init__.py
    │       └── view.py
    ├── resource
    │   ├── default
    │   │   ├── config.jsonnet
    │   │   └── i18n
    │   │       └── default.jsonnet
    │   ├── production
    │   │   ├── config.jsonnet
    │   │   └── i18n
    │   │       └── default.jsonnet
    │   ├── shareConfig.jsonnet
    │   └── test
    │       ├── config.jsonnet
    │       └── i18n
    │           └── default.jsonnet
    ├── run.sh
    └── webapp
        ├── js
        │   └── index.js
        ├── less
        │   └── index.less
        └── resource
            └── personPhoto.jpg
```

## Gulp commands

Be able to use `gulp` commands：

* env

  Change environment to **default** 、 **tes**t or **production**.
  ```
  gulp env:test
  ```

* watch

  Watch static and config files for building.

* build

  To build static files and compress backend files to zip.

* publish:zip

  Publish a backend zip which your project is compressed. And the file will be pushed to aws s3.

* publish:staitc

  Publish static files to aws s3.

## Run project to docker

Pull the `peter1209/pyenv-uwsgi-run` source.
```bash
docker pull peter1209/pyenv-uwsgi-run
```

Run your project to be opened uwsgi protocol.
```bash
docker run -p 4000:4000 -it peter1209/pyenv-uwsgi-run http://your.source.com/flask_project.zip
```

## Docker source

* [peter1209/pyenv-uwsgi-run](https://hub.docker.com/r/peter1209/pyenv-uwsgi-run/)


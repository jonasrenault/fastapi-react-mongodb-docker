# FARM-docker backend API

This directory contains the backend API app. It is built with [FastAPI](https://fastapi.tiangolo.com/).

## Requirements

* [Poetry](https://python-poetry.org/) for Python package and environment management.
* A [MongoDB](https://www.mongodb.com/) database for persistence.

## Install

The project uses poetry to manage dependencies. You can use your own environment, or use poetry to manage the virtuel env and the project depencencies.

If using poetry, for convenience, run `poetry config virtualenvs.in-project true` before installing depencies. This will install the dependencies in the project directory and make it easier to manage in vscode.

You can then install the dependencies with `poetry install --with dev`.

To activate the virtual env, use `poetry shell`.

## Running the server

Run this command to start a development server :

```console
uvicorn app.main:app --reload
```

This will start a server running on `http://127.0.0.1:8000`. The API will be available on the API's base prefix, which by default is `/api/v1`.

Navigate to `http://localhost:8000/api/v1/` to access the root API path.
Navigate to `http://localhost:8000/docs` to access the API's documentation.
Navigate to `http://localhost:8000/redoc` to access the API's alternative doc built with ReDoc.

## Running the tests

Run

```console
pytest
```

to run the unit test for the backend app.

## Configuration

The project uses Pydantic's settings management through FastAPI. Documentation on how the settings work is availabe [here](https://fastapi.tiangolo.com/advanced/settings/).

The configuration file is located in [config/config.py](app/config/config.py). This file defines the setting properties, there types, and default values. The `Config` class specifies where these properties are from, i.e. the [.env.dev](.env.dev) file. Modify the values in the [.env.dev](.env.dev) file to change the configuration.

Note that when the backend application is run with Docker, the values in the [.env.dev](.env.dev) are overriden with environment variables set in the Docker configuration.

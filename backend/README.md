# FARM-docker backend API

This directory contains the backend API app. It is built with [FastAPI](https://fastapi.tiangolo.com/).

## Requirements

* [uv](https://docs.astral.sh/uv/) for Python package and environment management.
* A [MongoDB](https://www.mongodb.com/) database for persistence.

## Install

The project uses [uv](https://docs.astral.sh/uv/) to manage dependencies and run the backend application. You can install the project and its dependencies with `uv sync`.

## Running the server

To start a development server, run

```console
uv run fastapi dev app/main.py
```

from the `backend` directory (remove the `uv run` prefix if using another dependency management tool).

This will start a server running on `http://127.0.0.1:8000`. The API will be available on the API's base prefix, which by default is `/api/v1`.

Navigate to `http://localhost:8000/api/v1/` to access the root API path.
Navigate to `http://localhost:8000/docs` to access the API's documentation.
Navigate to `http://localhost:8000/redoc` to access the API's alternative doc built with ReDoc.

## Running the tests

Run

```console
uv run pytest
```

to run the unit tests for the backend app.

## Configuration

The project uses Pydantic's settings management through FastAPI. Documentation on how the settings work is availabe [here](https://fastapi.tiangolo.com/advanced/settings/).

The configuration file is located in [config/config.py](app/config/config.py). This file defines the setting properties, their types, and default values. The `model_config` attribute specifies where these properties are from, i.e. the [.env](../.env) file at the root of the project. Modify the values in the [.env](../.env) file to change the configuration.

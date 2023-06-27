# Fastapi-React-Mongodb-Docker

[![Tests](https://github.com/jonasrenault/fastapi-react-mongodb-docker/actions/workflows/test.yml/badge.svg)](https://github.com/jonasrenault/fastapi-react-mongodb-docker/actions/workflows/test.yml)

This is a template application for a FARM stack. FARM stands for FastAPI, React, MongoDB.

## Project structure

The project is composed of :

* a backend API server built with FastAPI located in the [backend](backend) dir.
* a frontend web app build with React and located in the [frontend](frontend) dir.

## Running the application locally for development

To run the application manually in a terminal, see both the [backend](backend/README.md) and [frontend](frontend/README.md)'s READMEs for instructions.

## Running the application with Docker

The project contains Docker configuration files to run the application with Docker compose. Two docker-compose files are provided with configuration for `dev` and for `production` environments. The Docker configuration is largely adapted from Tiangolo's [Full stack FastAPI cookiecutter](https://github.com/tiangolo/full-stack-fastapi-postgresql) project.

### Local development with Docker

The local development file for docker is [docker-compose.yml](./docker-compose.yml).

Start the stack with Docker Compose:

```bash
docker compose up -d --build
```

The `--build` arg can be omitted after the images have been built at least once.

Now you can open your browser and interact with these URLs:

* Frontend, served with vite with hot reload of code: http://localhost

* Backend, JSON based web API based on OpenAPI, with hot code reloading: http://localhost/api/

* Automatic interactive documentation with Swagger UI (from the OpenAPI backend): http://localhost/docs

* Alternative automatic documentation with ReDoc (from the OpenAPI backend): http://localhost/redoc

* Traefik UI, to see how the routes are being handled by the proxy: http://localhost:8090

Once the stack is up, to check the logs, run:

```bash
docker compose logs
```

To check the logs of a specific service, add the name of the service, e.g.:

```bash
docker compose logs backend
```

### Docker Compose settings for development

When running the application with docker in development, both the frontend and backend directories are mounted as volumes to their corresponding docker containers to enable hot reload of code changes. This allows you to test your changes right away, without having to build the Docker image again. It should only be done during development, for production you should build the Docker image with a recent and stable version of the code.

For the backend, there is a command override that runs `/start-reload.sh` (included in the base image) instead of the default `/start.sh` (also included in the base image). It starts a single server process (instead of multiple, as would be for production) and reloads the process whenever the code changes. Have in mind that if you have a syntax error and save the Python file, it will break and exit, and the container will stop. After that, you can restart the container by fixing the error and running the `docker-compose up -d` command again. The backend [Dockerfile](backend/Dockerfile) is in the backend directory.

For the frontend, when in development, the frontend docker container starts with the `npm run dev -- --host` command, while in production the frontend app is built into static files and the app is served by an nginx server. The [nginx configuration file](frontend/nginx.conf) is in the frontend dir.

### Accessing the containers

To get inside a container with a `bash` session you can start the stack with:

```console
$ docker compose up -d
```

and then `exec` inside the running container:

```console
$ docker compose exec backend bash
```

This will give you access to a bash session in the `backend` container. Change the name of the container to the one you want to access.


### Docker Compose settings for production

The [docker-compose-prod.yml](./docker-compose.prod.yml) file contains the configuration to run the application with docker in a production environment, on a host server. To run the application with this file, run

```console
docker compose -f docker-compose.prod.yml up -d
```

**Note:** This will not work out of the box, mainly because the `docker-compose-prod.yml` configures a traefik proxy with ssl enabled that will try to fetch ssl certificates from Let's Encrypt, which will not work unless you specify a valid hostname accessible on the internet. However, to deploy the application in production on a server, you only need to set the required env variables in the [.env](./.env) file.

### Docker Compose files and env vars

Both the [docker-compose.yml](./docker-compose.yml) and [docker-compose-prod.yml](./docker-compose.prod.yml) files use the [.env](./.env) file containing configurations to be injected as environment variables in the containers.

The docker-compose files are designed to support several environments (i.e. development, building, testing, production) simply by setting the appropriate variable values in the `.env` file.

The [.env](./.env) file contains all the configuration variables. The values set in the `.env` file will override those that are set in the frontend and backend `.env` files for local development. For exemple, the backend app also has a [.env.dev](backend/.env.dev) file which is read to populate the backend's [config](backend/app/config/config.py) module. When the application is run with docker though, the env variables in the projet root's [.env](./.env) file will override the env variables set in the backend and frontend's respective .env files. In order to be able to keep working both with docker and manually, you only have to make sure that the required variables are set both in the root `.env` file, and in the backend and frontend `.env` files.

The `.env` file that is commited to the github repository contains example values which are ok to use for testing and development, but which should be changed when running the application in production (admin passwords, secret keys, client ids, etc.). During deployment in production, the .env file is replaced with one containing the appropriate values.

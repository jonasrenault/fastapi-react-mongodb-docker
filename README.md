# Fastapi-React-Mongodb-Docker

This is a template application for a FARM stack. FARM stands for FastAPI, React, MongoDB.

## Project structure

The project is composed of :

* a backend API server built with FastAPI located in the [backend](backend) dir.
* a frontend web app build with React and located in the [frontend](frontend) dir.

## Running the application locally for development

To run the application manually in a terminal, see both the [backend](backend/README.md) and [frontend](frontend/README.md)'s READMEs.

## Running the application with Docker

The project contains Docker configuration files to run the application through Docker. The Docker configuration is largely adapted from Tiangolo's [Full stack FastAPI cookiecutter](https://github.com/tiangolo/full-stack-fastapi-postgresql) project.

### Local development with Docker

Start the stack with Docker Compose:

```bash
docker-compose up -d
```

Now you can open your browser and interact with these URLs:

* Frontend, served with vite with hot reload of code: http://localhost

* Backend, JSON based web API based on OpenAPI, with hot code reloading: http://localhost/api/

* Automatic interactive documentation with Swagger UI (from the OpenAPI backend): http://localhost/docs

* Alternative automatic documentation with ReDoc (from the OpenAPI backend): http://localhost/redoc

* Traefik UI, to see how the routes are being handled by the proxy: http://localhost:8090

Once the stack is up, to check the logs, run:

```bash
docker-compose logs
```

To check the logs of a specific service, add the name of the service, e.g.:

```bash
docker-compose logs backend
```

### Docker Compose Override

During development, you can change Docker Compose settings that will only affect the local development environment, in the file `docker-compose.override.yml`.

The changes to that file only affect the local development environment, not the production environment. So, you can add *temporary* changes that help the development workflow.

For example, the directory with the backend code is mounted as a Docker "host volume", mapping the code you change live to the directory inside the container. Same for the frontend code. That allows you to test your changes right away, without having to build the Docker image again. It should only be done during development, for production, you should build the Docker image with a recent version and stable version of the code.

For the backend, there is a command override that runs `/start-reload.sh` (included in the base image) instead of the default `/start.sh` (also included in the base image). It starts a single server process (instead of multiple, as would be for production) and reloads the process whenever the code changes. Have in mind that if you have a syntax error and save the Python file, it will break and exit, and the container will stop. After that, you can restart the container by fixing the error and running the `docker-compose up -d` command again. The backend [Dockerfile](backend/Dockerfile) is in the backend directory.

For the frontend, a different Dockerfile is used in the `docker-compose.override.yml`. In development, the frontend docker container starts with the `npm run dev -- --host` command, while in production the frontend app is built and the app is served by an nginx server. The [nginx configuration file](frontend/nginx.conf) is in the frontend dir.

### Accessing the containers

To get inside a container with a `bash` session you can start the stack with:

```console
$ docker-compose up -d
```

and then `exec` inside the running container:

```console
$ docker-compose exec backend bash
```

This will give you access to a bash session in the `backend` container. Change the name of the container to the one you want to access.

## Deployment

Deployment to a Docker Swarm mode cluster should be possible, but it has not been tested. Refer to Tiangolo's [Full stack FastAPI cookiecutter](https://github.com/tiangolo/full-stack-fastapi-postgresql) project documentation for information on how to manage deployment and how to configure the Traefik proxy with constraints and such. The <a href="https://dockerswarm.rocks" target="_blank">[DockerSwarm.rocks</a> tutorials are also a good place to look for info.

## Docker Compose files and env vars

There is a main `docker-compose.yml` file with all the configurations that apply to the whole stack, it is used automatically by `docker-compose`.

And there's also a `docker-compose.override.yml` with overrides for development, for example to mount the source code as a volume. It is used automatically by `docker-compose` to apply overrides on top of `docker-compose.yml`.

These Docker Compose files use the [.env](./.env) file containing configurations to be injected as environment variables in the containers.

They also use some additional configurations taken from environment variables set in the scripts before calling the `docker-compose` command.

It is all designed to support several "stages", like development, building, testing, and deployment. Also, allowing the deployment to different environments like staging and production.

They are designed to have the minimum repetition of code and configurations, so that if you need to change something, you have to change it in the minimum amount of places. That's why files use environment variables that get auto-expanded. That way, if for example, you want to use a different domain, you can call the `docker-compose` command with a different `DOMAIN` environment variable instead of having to change the domain in several places inside the Docker Compose files.

Also, if you want to have another deployment environment, say `preprod`, you just have to change environment variables, but you can keep using the same Docker Compose files.

### The .env file

The [.env](./.env) file is the one that contains all your configurations, generated keys and passwords, etc.

Depending on your workflow, you could want to exclude it from Git, for example if your project is public. In that case, you would have to make sure to set up a way for your CI tools to obtain it while building or deploying your project.

One way to do it could be to add each environment variable to your CI/CD system, and updating the `docker-compose.yml` file to read that specific env var instead of reading the `.env` file.

**Note** that in order to have both the backend and frontend app be able to run locally without docker, those apps also expect to find env variables in their respective directory. For exemple, the backend app also has a [.env.dev](backend/.env.dev) file which is read to populate the backend's [config](backend/app/config/config.py) module. When the application is run with docker though, the env variables in the projet root's [.env](./.env) file will override the env variables set in the backend and frontend's respective .env files.
In order to be able to keep working both with docker and manually, you only have to make sure that the required variables are set both in the root `.env` file, and in the backend and frontend `.env` files.

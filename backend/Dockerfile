FROM python:3.12-slim

ENV PYTHONUNBUFFERED=true

WORKDIR /app

### install poetry
RUN pip install poetry && poetry config virtualenvs.in-project true

### install dependencies and project
ADD pyproject.toml README.md ./
ADD app /app/app
RUN poetry install --no-interaction --no-ansi

### add executables to path
ENV PATH="/app/.venv/bin:$PATH"

### default cmd: run fastapi with 4 workers
CMD ["fastapi", "run", "--workers", "4", "app/main.py"]

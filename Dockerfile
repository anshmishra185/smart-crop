# ==============================================================================
# KRISHI SAARTHI MULTI-STAGE ENTERPRISE PRODUCTION CONTAINER
# Stage 1: Build React 19 + TypeScript Static Assets
# Stage 2: Production Python 3.13 Slim Microservice Runtime
# ==============================================================================

# STAGE 1: Frontend SPA Compilation
FROM node:22-alpine AS frontend-builder
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# STAGE 2: Backend & Microservice Engine
FROM python:3.13-slim AS production

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000 \
    APP_HOME=/app

WORKDIR $APP_HOME

# Install OS runtime utilities & curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code, models, and migrations
COPY backend ./backend
COPY alembic.ini ./alembic.ini
COPY alembic ./alembic
COPY run_backend.py ./run_backend.py

# Copy compiled frontend assets from Stage 1 into static mount
COPY --from=frontend-builder /build/dist ./static

# Create non-root production execution user
RUN groupadd -g 1001 agrigroup && \
    useradd -u 1001 -g agrigroup -s /bin/bash -m appuser && \
    chown -R appuser:agrigroup $APP_HOME

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:8000/api/v1/health || exit 1

CMD ["python", "-u", "run_backend.py"]


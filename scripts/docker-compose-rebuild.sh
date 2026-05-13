#!/usr/bin/env sh
set -eu

if ! docker info >/dev/null 2>&1; then
  echo "Docker is not reachable by this user."
  echo "Run: sudo ./scripts/docker-compose-rebuild.sh"
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  docker compose up --build
  exit 0
fi

docker-compose down --remove-orphans
docker-compose rm --stop --force
docker rm --force react bunte-app_backend_1 bunte-app_frontend_1 bunte-app_keycloak_1 bunte-app_postgres_1 bunteapp_backend_1 bunteapp_frontend_1 bunteapp_keycloak_1 bunteapp_postgres_1 2>/dev/null || true
docker-compose up --build

#  This project uses TWO separate Dockerfiles.
#
#  DO NOT build this root Dockerfile directly.
#  Use docker compose instead:
#
#    docker compose up --build
#
#  Individual Dockerfiles:
#    client/myapp/Dockerfile   → Nginx + React SPA
#    server/Dockerfile         → Node/Express API

# This file exists only as a placeholder so Docker Hub / cloud
# platforms that require a root Dockerfile can detect the project.
# CI and local dev both use docker-compose.yml.

FROM scratch
LABEL maintainer="tripfy"
LABEL description="See client/myapp/Dockerfile and server/Dockerfile"

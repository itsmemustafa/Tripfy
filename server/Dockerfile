# Tripfy Backend Dockerfile
#
# Railway uses the repo root as the Docker build context.
# docker compose uses ./server as the context (see docker-compose.yml).

FROM node:22-alpine

ARG APP_DIR=server

RUN apk add --no-cache dumb-init
RUN addgroup -S tripfy && adduser -S tripfy -G tripfy

WORKDIR /app

# Install production dependencies from the server package (not the workspace root).
COPY ${APP_DIR}/package.json ${APP_DIR}/package-lock.json* ./
RUN npm ci --omit=dev --legacy-peer-deps

COPY ${APP_DIR}/ .

RUN rm -f .env

USER tripfy

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "app.js"]

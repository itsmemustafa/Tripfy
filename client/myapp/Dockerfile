# Tripfy Frontend Dockerfile

# Build stage
FROM node:22-alpine AS build
WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Set env vars for build
ARG VITE_API_BASE_URL=/api/v1
ARG VITE_APP_NAME=Tripfy
ARG VITE_APP_ENV=production

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_ENV=$VITE_APP_ENV

RUN npm run build

# Serve stage
FROM nginx:alpine AS serve

# Clear default html
RUN rm -rf /usr/share/nginx/html/*

# Copy build and nginx config
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Tripfy Backend Dockerfile

FROM node:22-alpine

# Add dumb-init for graceful shutdowns
RUN apk add --no-cache dumb-init

# Setup non-root user
RUN addgroup -S tripfy && adduser -S tripfy -G tripfy
WORKDIR /app

# Install production dependencies
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY . .

# Prevent accidental secret leakage
RUN rm -f .env

# Run as non-root
USER tripfy

EXPOSE 3000

# Start server using dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "app.js"]

#
# Multi-stage Dockerfile for Humaan (SvelteKit + adapter-static)
# Produces a lightweight nginx image that serves the pre-rendered build.
#

# ── Build stage ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies using lockfile (faster & reproducible)
COPY package*.json ./
COPY .npmrc ./
RUN npm ci

# Copy source and build static site
COPY . .
RUN npm run build

# ── Runtime stage ──────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Copy the static build output into nginx
COPY --from=build /app/build ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

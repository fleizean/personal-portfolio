# syntax=docker/dockerfile:1

# --- deps: yalnızca kilit dosyasındaki sürümler kurulur ---
FROM node:26-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# --- build: Angular SSR derlemesi (tip ve şablon kontrolleri dahil) ---
FROM node:26-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- run: sunucu paketi bağımlılıkları içinde taşır, node_modules gerekmez ---
FROM node:26-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000
COPY --from=build --chown=node:node /app/dist/portfolio ./dist/portfolio
USER node
EXPOSE 3000
# SSR yalnızca izinli host adlarına yanıt verir; sağlık kontrolü de gerçek alan adıyla gelir
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q -O /dev/null --header='Host: fleizean.dev' http://127.0.0.1:3000/ || exit 1
CMD ["node", "dist/portfolio/server/server.mjs"]

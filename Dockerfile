# --- deps ---
FROM node:24-alpine AS deps

WORKDIR /app

# .npmrc: legacy-peer-deps ayarı olmadan npm ci peer bağımlılıklarında takılıyor
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# --- build ---
FROM node:24-alpine AS build

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- run ---
FROM node:24-alpine

WORKDIR /app

# HOSTNAME: standalone sunucu varsayılan olarak container adına bağlanır;
# 0.0.0.0 olmazsa port dışarıdan (host nginx) erişilemez.
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# standalone çıktısı public/ ve .next/static'i içermez, ayrıca kopyalanmalı
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

USER node

EXPOSE 3000

CMD ["node", "server.js"]

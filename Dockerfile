FROM node:22.17.0-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22.17.0-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22.17.0-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist

RUN adduser -D -H -h /app pokeuser
RUN chown -R pokeuser:pokeuser /app
USER pokeuser

EXPOSE 3000
CMD ["node","dist/main"]
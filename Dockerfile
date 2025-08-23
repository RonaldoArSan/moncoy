# syntax=docker/dockerfile:1

# Etapa 1: deps
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk update && apk upgrade && rm -rf /var/cache/apk/*
COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* ./
RUN --mount=type=cache,target=/root/.npm \
    if [ -f pnpm-lock.yaml ]; then \
      corepack enable && corepack prepare pnpm@latest --activate && pnpm i --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
      npm ci; \
    elif [ -f yarn.lock ]; then \
      corepack enable && corepack prepare yarn@stable --activate && yarn --frozen-lockfile; \
    else \
      npm i; \
    fi

# Etapa 2: builder
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk update && apk upgrade && rm -rf /var/cache/apk/*
ENV NODE_ENV=production
ENV STANDALONE=true
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=cache,target=/root/.npm \
    if [ -f pnpm-lock.yaml ]; then \
      corepack enable && corepack prepare pnpm@latest --activate && pnpm run build; \
    else \
      npm run build; \
    fi

# Etapa 3: runner - using distroless for security
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV STANDALONE=true

# Next standalone output
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
# Distroless images use "node" as entrypoint; just pass the script
CMD ["server.js"]

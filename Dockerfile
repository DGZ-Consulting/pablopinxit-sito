# Pablo Pinxit — Astro SSR (Node standalone) for Dokploy / Docker

FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

RUN addgroup --system astro && adduser --system astro --ingroup astro

COPY --from=build --chown=astro:astro /app/dist ./dist
COPY --from=deps --chown=astro:astro /app/node_modules ./node_modules
COPY --chown=astro:astro package.json ./

USER astro
EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]

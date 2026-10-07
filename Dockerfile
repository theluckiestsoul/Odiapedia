# Odiapedia container image.
#
# Three stages keep the final image small:
#   deps  -> installs node_modules from package-lock.json (cached until the lockfile changes)
#   build -> runs `next build` in standalone mode
#   run   -> copies only the standalone server, static assets, public/ and content/
#
# Build locally:   docker build -t odiapedia .
# Run locally:     docker run --rm -p 3000:3000 odiapedia   ->  http://localhost:3000

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_OUTPUT=standalone
# NEXT_PUBLIC_* values are baked into the pages at build time, so they are build arguments.
ARG NEXT_PUBLIC_GA_ID=""
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=""
ARG NEXT_PUBLIC_BING_SITE_VERIFICATION=""
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID \
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=$NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION \
    NEXT_PUBLIC_BING_SITE_VERIFICATION=$NEXT_PUBLIC_BING_SITE_VERIFICATION
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
# The site reads Markdown/MDX from content/ and map data from public/ at request time.
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/content ./content
# "node" is an unprivileged user that ships with the official Node image.
USER node
EXPOSE 3000
CMD ["node", "server.js"]

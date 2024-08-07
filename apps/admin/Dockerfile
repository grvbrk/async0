# Use a Node.js base image
FROM node:18-alpine AS base

# Install dependencies
FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm i -g turbo
COPY . .
RUN turbo prune admin --docker

FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN npm ci

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
COPY ./packages/db/.env /app/packages/db/.env

RUN npm run build --filter=admin

FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

COPY --from=installer /app/apps/admin/next.config.js .
COPY --from=installer /app/apps/admin/package.json .

COPY --from=installer --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static

CMD node apps/admin/server.js




# # Copy root package.json, lock file, and turbo.json
# COPY package.json package-lock.json turbo.json ./

# # Copy the necessary files
# COPY apps/admin ./apps/admin
# COPY packages ./packages

# # Install dependencies
# RUN npm install

# # Build the project
# RUN npm run build -- --filter=admin

# # Production stage
# FROM base AS runner
# WORKDIR /app

# # Create a non-root user
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# USER nextjs

# # Copy the necessary files for the production run
# COPY --from=builder /app/apps/admin/package.json .
# COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static

# # Start the application
# CMD ["node", "apps/admin/server.js"]

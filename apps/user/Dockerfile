# Use a Node.js base image
FROM node:18-alpine AS base

# Install dependencies
FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm i -g turbo
COPY . .
RUN turbo prune user --docker

FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN npm ci

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
COPY ./packages/db/.env /app/packages/db/.env

RUN npm run build --filter=user

FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=installer /app/apps/user/next.config.js .
COPY --from=installer /app/apps/user/package.json .

COPY --from=installer --chown=nextjs:nodejs /app/apps/user/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/user/.next/static ./apps/user/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/user/public ./apps/user/public

CMD node apps/user/server.js















# Use a Node.js base image
# FROM node:18-alpine AS base

# # Install dependencies
# FROM base AS builder
# RUN apk update && apk add --no-cache libc6-compat
# WORKDIR /app

# # Copy root package.json, lock file, and turbo.json
# COPY package.json package-lock.json turbo.json ./

# # Copy the necessary files
# COPY apps/user ./apps/user
# COPY packages ./packages

# # Install dependencies
# RUN npm install

# # Build the project
# RUN npm run build -- --filter=user

# # Production stage
# FROM base AS runner
# WORKDIR /app

# # Create a non-root user
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# USER nextjs

# # Copy the necessary files for the production run
# COPY --from=builder /app/apps/user/package.json .
# COPY --from=builder --chown=nextjs:nodejs /app/apps/user/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/apps/user/.next/static ./apps/user/.next/static
# COPY --from=builder --chown=nextjs:nodejs /app/apps/user/public ./apps/user/public

# # Start the application
# CMD ["node", "apps/user/server.js"]

# Use a Node.js base image
FROM node:18-alpine AS base

# Install dependencies
FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Copy the necessary files
COPY . .

# Install dependencies
RUN npm install

# Build the project
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy the necessary files for the production run
COPY --from=builder /app/apps/admin/next.config.js .
COPY --from=builder /app/apps/admin/package.json .
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/public ./apps/admin/public

# Start the application
CMD ["node", "apps/admin/server.js"]

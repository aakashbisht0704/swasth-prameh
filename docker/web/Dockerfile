FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments for NEXT_PUBLIC_* variables (baked in at build time)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL

# Set as environment variables for Next.js build
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the application (NEXT_PUBLIC_* vars are baked in at build time)
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install production dependencies
RUN npm ci --production --legacy-peer-deps && npm cache clean --force

# Change ownership to nextjs user
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD ["node_modules/.bin/next", "start", "-p", "3000"]

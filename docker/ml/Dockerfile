FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy LLM service source
COPY src/llm ./src/llm
COPY src/lib ./src/lib

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8002

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 llmuser

# Copy package files and install production dependencies + type definitions and ts-node needed for runtime
COPY package*.json ./
RUN npm ci --production --legacy-peer-deps && \
    npm install --save-dev @types/express @types/cors ts-node typescript --legacy-peer-deps && \
    npm cache clean --force

# Copy LLM service files
COPY --from=builder /app/src/llm ./src/llm
COPY --from=builder /app/src/lib ./src/lib

# Change ownership to llmuser
RUN chown -R llmuser:nodejs /app
USER llmuser

EXPOSE 8002

CMD ["node", "node_modules/ts-node/dist/bin.js", "src/llm/server.ts"]

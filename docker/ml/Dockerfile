FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for TypeScript compilation)
RUN npm ci --legacy-peer-deps

# Copy only LLM service source and the specific lib files it needs
COPY src/llm ./src/llm
COPY src/lib/ai ./src/lib/ai

# Compile TypeScript to JavaScript (ES modules)
# Create a temporary tsconfig for compilation with lenient settings
RUN echo '{ \
  "compilerOptions": { \
    "target": "ES2020", \
    "module": "ES2020", \
    "lib": ["ES2020"], \
    "outDir": "./dist", \
    "rootDir": "./", \
    "strict": false, \
    "esModuleInterop": true, \
    "skipLibCheck": true, \
    "forceConsistentCasingInFileNames": false, \
    "resolveJsonModule": true, \
    "moduleResolution": "node", \
    "noEmitOnError": false \
  }, \
  "include": ["src/llm/**/*", "src/lib/ai/**/*"], \
  "exclude": ["node_modules"] \
}' > tsconfig.ml.json

RUN npx tsc -p tsconfig.ml.json

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8002

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 llmuser

# Copy package files and install ONLY production dependencies
COPY package*.json ./
RUN npm ci --production --legacy-peer-deps && \
    npm cache clean --force

# Copy compiled JavaScript files from builder
COPY --from=builder /app/dist/src/llm ./src/llm
COPY --from=builder /app/dist/src/lib ./src/lib

# Add "type": "module" to package.json for ES module support (using jq or sed)
# If jq is not available, use node to modify package.json
RUN node -e "const fs=require('fs'); const pkg=JSON.parse(fs.readFileSync('package.json')); pkg.type='module'; fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2))"

# Change ownership to llmuser
RUN chown -R llmuser:nodejs /app
USER llmuser

EXPOSE 8002

# Run the compiled JavaScript file (ES module)
CMD ["node", "src/llm/server.js"]

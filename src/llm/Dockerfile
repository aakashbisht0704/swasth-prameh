FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY src/llm/server.ts ./

# Install dependencies
RUN npm install express cors groq-sdk dotenv && \
    npm install -g typescript ts-node @types/node @types/express

ENV PORT=8002
EXPOSE 8002

CMD ["npx", "ts-node", "server.ts"]



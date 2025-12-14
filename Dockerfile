# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Install only production deps
RUN npm ci --omit=dev

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/server.js"]
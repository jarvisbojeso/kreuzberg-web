# Stage 1: Build Next.js app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .
RUN npm run build

# Stage 2: Production runtime (frontend only)
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV KREUZBERG_URL="http://kreuzberg:8000"

EXPOSE 3000

CMD ["node", "server.js"]

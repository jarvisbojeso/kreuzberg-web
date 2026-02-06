# Stage 1: Build Next.js app
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production runtime with Kreuzberg
FROM python:3.12-slim

# Install Node.js for Next.js runtime
RUN apt-get update && apt-get install -y \
    curl \
    tesseract-ocr \
    tesseract-ocr-dan \
    tesseract-ocr-eng \
    poppler-utils \
    libmagic1 \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Kreuzberg
RUN pip install --no-cache-dir kreuzberg

# Copy Next.js standalone build
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Create startup script
RUN echo '#!/bin/bash\n\
set -e\n\
echo "Starting Kreuzberg API server..."\n\
kreuzberg serve -H 0.0.0.0 -p 8000 &\n\
KREUZBERG_PID=$!\n\
\n\
# Wait for Kreuzberg to be ready\n\
echo "Waiting for Kreuzberg..."\n\
for i in $(seq 1 30); do\n\
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then\n\
        echo "Kreuzberg ready!"\n\
        break\n\
    fi\n\
    sleep 1\n\
done\n\
\n\
echo "Starting Next.js server..."\n\
KREUZBERG_URL=http://localhost:8000 node server.js &\n\
NEXT_PID=$!\n\
\n\
# Handle shutdown\n\
trap "kill $KREUZBERG_PID $NEXT_PID 2>/dev/null" EXIT\n\
wait\n' > /start.sh && chmod +x /start.sh

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV KREUZBERG_URL="http://localhost:8000"

EXPOSE 3000

CMD ["/start.sh"]

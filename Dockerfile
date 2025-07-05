FROM node:20-slim

# Install dependencies for voice and sqlite
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Create data directory for database
RUN mkdir -p /app/data

# Set environment variable for database location
ENV DATABASE_PATH=/app/data/music_history.db

# Start the bot
CMD ["node", "src/index.js"]
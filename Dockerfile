# Use Node.js 16.x LTS
FROM node:16.3.0-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy source code
COPY src/ ./src/

# Set environment variables
ARG KAFKA_CLIENT_ID
ENV KAFKA_CLIENT_ID=${KAFKA_CLIENT_ID}
ARG KAFKA_BROKERS
ENV KAFKA_BROKERS=${KAFKA_BROKERS}
ARG KAFKA_TOPIC
ENV KAFKA_TOPIC=${KAFKA_TOPIC}
ARG KAFKA_CONSUMER_GROUP
ENV KAFKA_CONSUMER_GROUP=${KAFKA_CONSUMER_GROUP}
ARG TELEGRAM_TOKEN
ENV TELEGRAM_TOKEN=${TELEGRAM_TOKEN}
ARG TELEGRAM_CHAT_ID
ENV TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}

# Run the application
CMD ["node", "src/index.js"]

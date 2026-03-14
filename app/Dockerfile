FROM node:22-alpine AS base

WORKDIR /app

# Install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy application source
COPY public ./public
COPY server.js ./server.js

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]


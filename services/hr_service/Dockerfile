FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY services/hr_service/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY services/hr_service/ .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port (will be set by Render via $PORT)
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["npm", "start"]

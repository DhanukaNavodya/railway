FROM redis:7-alpine

# Copy custom redis configuration if needed
# COPY redis.conf /usr/local/etc/redis/redis.conf

# Expose Redis port
EXPOSE 6379

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD redis-cli ping || exit 1

# Start Redis with password if provided
CMD ["sh", "-c", "redis-server --requirepass ${REDIS_PASSWORD:-}"]

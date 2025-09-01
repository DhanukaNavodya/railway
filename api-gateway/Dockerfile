FROM nginx:alpine

# Install envsubst for environment variable substitution
RUN apk add --no-cache bash

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the template configuration
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Create log directories and set permissions
RUN mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Expose port (will be set by Render via $PORT)
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-10000}/health || exit 1

# Render-compatible: envsubst at container start to inject env vars into Nginx
CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

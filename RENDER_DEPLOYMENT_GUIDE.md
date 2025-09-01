# Sparkle Backend - Render Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Sparkle HR System backend to Render. The deployment includes the API Gateway (Nginx), HR Service, Admin Service, and MySQL database.

## Prerequisites

- Render account (free tier available)
- GitHub repository with your Sparkle backend code
- Docker and Docker Compose knowledge

## Architecture

### Services to Deploy
1. **API Gateway** (Nginx) - Web Service
2. **HR Service** (Node.js) - Web Service  
3. **Admin Service** (Node.js) - Web Service
4. **MySQL Database** - PostgreSQL (Render's managed database)

## Step 1: Prepare Your Repository

### 1.1 Create Render-specific Configuration Files

#### Create `render.yaml` (Service Definition)
```yaml
services:
  # API Gateway (Nginx)
  - type: web
    name: sparkle-api-gateway
    env: docker
    region: oregon
    plan: free
    dockerfilePath: ./api-gateway/Dockerfile
    dockerContext: .
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: GATEWAY_PORT
        value: 80

  # HR Service
  - type: web
    name: sparkle-hr-service
    env: docker
    region: oregon
    plan: free
    dockerfilePath: ./services/hr_service/Dockerfile
    dockerContext: .
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: DB_HOST
        fromDatabase:
          name: sparkle-database
          property: host
      - key: DB_PORT
        fromDatabase:
          name: sparkle-database
          property: port
      - key: DB_NAME
        fromDatabase:
          name: sparkle-database
          property: database
      - key: DB_USER
        fromDatabase:
          name: sparkle-database
          property: username
      - key: DB_PASSWORD
        fromDatabase:
          name: sparkle-database
          property: password

  # Admin Service
  - type: web
    name: sparkle-admin-service
    env: docker
    region: oregon
    plan: free
    dockerfilePath: ./services/admin_service/Dockerfile
    dockerContext: .
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5001
      - key: DB_HOST
        fromDatabase:
          name: sparkle-database
          property: host
      - key: DB_PORT
        fromDatabase:
          name: sparkle-database
          property: port
      - key: DB_NAME
        fromDatabase:
          name: sparkle-database
          property: database
      - key: DB_USER
        fromDatabase:
          name: sparkle-database
          property: username
      - key: DB_PASSWORD
        fromDatabase:
          name: sparkle-database
          property: password

databases:
  - name: sparkle-database
    databaseName: sparkle_hr
    user: sparkle_user
    plan: free
```

### 1.2 Create Service-specific Dockerfiles

#### Create `services/hr_service/Dockerfile`
```dockerfile
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

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["npm", "start"]
```

#### Create `services/admin_service/Dockerfile`
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY services/admin_service/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY services/admin_service/ .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["npm", "start"]
```

### 1.3 Update API Gateway Configuration

#### Update `api-gateway/default.conf` for Render
```nginx
server {
    listen 80;
    server_name localhost;

    # Request size limit
    client_max_body_size 10M;

    # Root path handling
    location / {
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH' always;
        add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept, Authorization' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;

        # Handle OPTIONS method
        if ($request_method = 'OPTIONS') {
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        return 404 '{"status":404,"message":"Not Found"}';
        default_type application/json;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 '{"status":"OK","timestamp":"$time_iso8601","service":"api-gateway"}';
        add_header Content-Type application/json;
    }

    # HR Service - support both /hr-service and /api/hr routes
    location ~ ^/(api/)?hr/ {
        # Handle OPTIONS preflight first
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH' always;
            add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept, Authorization' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        # Enhanced debug logging
        access_log /var/log/nginx/hr-service-access.log;
        error_log /var/log/nginx/hr-service-error.log debug;

        # Rewrite to remove /api/hr prefix and add /api prefix for HR service
        rewrite ^/(api/)?hr/(.*)$ /api/$2 break;

        # Hide any CORS headers from upstream
        proxy_hide_header 'Access-Control-Allow-Origin';
        proxy_hide_header 'Access-Control-Allow-Methods';
        proxy_hide_header 'Access-Control-Allow-Headers';
        proxy_hide_header 'Access-Control-Allow-Credentials';

        # Proxy to HR service (Render URL)
        proxy_pass https://sparkle-hr-service.onrender.com;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Cookie $http_cookie;
        proxy_set_header Authorization $http_authorization;

        # Increase timeouts for database operations
        proxy_connect_timeout 60;
        proxy_send_timeout 60;
        proxy_read_timeout 60;

        # Add CORS headers after proxying
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH' always;
        add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept, Authorization' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
    }

    # Admin Service
    location ~ ^/(api/)?admin/ {
        # Handle OPTIONS preflight first
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH' always;
            add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept, Authorization' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        # Enhanced debug logging
        access_log /var/log/nginx/admin-service-access.log;
        error_log /var/log/nginx/admin-service-error.log debug;

        # Rewrite to remove /api/admin prefix and add /api prefix for Admin service
        rewrite ^/(api/)?admin/(.*)$ /api/$2 break;

        # Hide any CORS headers from upstream
        proxy_hide_header 'Access-Control-Allow-Origin';
        proxy_hide_header 'Access-Control-Allow-Methods';
        proxy_hide_header 'Access-Control-Allow-Headers';
        proxy_hide_header 'Access-Control-Allow-Credentials';

        # Proxy to Admin service (Render URL)
        proxy_pass https://sparkle-admin-service.onrender.com;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Cookie $http_cookie;
        proxy_set_header Authorization $http_authorization;

        # Increase timeouts for database operations
        proxy_connect_timeout 60;
        proxy_send_timeout 60;
        proxy_read_timeout 60;

        # Add CORS headers after proxying
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH' always;
        add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept, Authorization' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
    }
}
```

### 1.4 Create Health Check Scripts

#### Create `services/hr_service/healthcheck.js`
```javascript
const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 5000,
  path: '/health',
  method: 'GET',
  timeout: 2000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('error', () => {
  process.exit(1);
});

req.on('timeout', () => {
  req.destroy();
  process.exit(1);
});

req.end();
```

#### Create `services/admin_service/healthcheck.js`
```javascript
const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 5001,
  path: '/health',
  method: 'GET',
  timeout: 2000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('error', () => {
  process.exit(1);
});

req.on('timeout', () => {
  req.destroy();
  process.exit(1);
});

req.end();
```

## Step 2: Database Migration

### 2.1 Create Database Migration Script

#### Create `database/migrate.js`
```javascript
const mysql = require('mysql2/promise');

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // Create employees table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        department VARCHAR(100),
        position VARCHAR(100),
        hireDate DATE,
        salary DECIMAL(10,2),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create departments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        managerId INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create leave_requests table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS leave_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employeeId INT NOT NULL,
        leaveTypeId INT NOT NULL,
        startDate DATE NOT NULL,
        endDate DATE NOT NULL,
        reason TEXT,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create attendance table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employeeId INT NOT NULL,
        date DATE NOT NULL,
        checkIn TIME,
        checkOut TIME,
        status ENUM('present', 'absent', 'late') DEFAULT 'present',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database migration completed successfully');
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate().catch(process.exit);
}

module.exports = { migrate };
```

### 2.2 Update Package.json Files

#### Update `services/hr_service/package.json`
```json
{
  "name": "sparkle-hr-service",
  "version": "1.0.0",
  "description": "HR Service for Sparkle HR System",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "migrate": "node migrate.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### Update `services/admin_service/package.json`
```json
{
  "name": "sparkle-admin-service",
  "version": "1.0.0",
  "description": "Admin Service for Sparkle HR System",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Step 3: Deploy to Render

### 3.1 Connect Repository

1. **Sign in to Render**
   - Go to [render.com](https://render.com)
   - Sign in with your GitHub account

2. **Create New Blueprint**
   - Click "New +"
   - Select "Blueprint"
   - Connect your GitHub repository

3. **Configure Blueprint**
   - Render will automatically detect the `render.yaml` file
   - Review the services and database configuration
   - Click "Apply"

### 3.2 Manual Service Creation (Alternative)

If you prefer to create services manually:

#### Create Database First
1. Go to "New +" → "PostgreSQL"
2. Name: `sparkle-database`
3. Database: `sparkle_hr`
4. User: `sparkle_user`
5. Plan: Free
6. Click "Create Database"

#### Create HR Service
1. Go to "New +" → "Web Service"
2. Connect your GitHub repository
3. Name: `sparkle-hr-service`
4. Environment: Docker
5. Region: Oregon (or closest to you)
6. Branch: `main`
7. Root Directory: `services/hr_service`
8. Build Command: `npm install`
9. Start Command: `npm start`
10. Add environment variables from database
11. Click "Create Web Service"

#### Create Admin Service
1. Go to "New +" → "Web Service"
2. Connect your GitHub repository
3. Name: `sparkle-admin-service`
4. Environment: Docker
5. Region: Oregon (or closest to you)
6. Branch: `main`
7. Root Directory: `services/admin_service`
8. Build Command: `npm install`
9. Start Command: `npm start`
10. Add environment variables from database
11. Click "Create Web Service"

#### Create API Gateway
1. Go to "New +" → "Web Service"
2. Connect your GitHub repository
3. Name: `sparkle-api-gateway`
4. Environment: Docker
5. Region: Oregon (or closest to you)
6. Branch: `main`
7. Root Directory: `api-gateway`
8. Build Command: (leave empty - handled by Dockerfile)
9. Start Command: (leave empty - handled by Dockerfile)
10. Click "Create Web Service"

## Step 4: Environment Variables

### 4.1 Database Environment Variables
For each service, add these environment variables:

```
NODE_ENV=production
DB_HOST=<database-host-from-render>
DB_PORT=<database-port-from-render>
DB_NAME=sparkle_hr
DB_USER=sparkle_user
DB_PASSWORD=<database-password-from-render>
```

### 4.2 Service-specific Variables

#### HR Service
```
PORT=5000
```

#### Admin Service
```
PORT=5001
```

#### API Gateway
```
GATEWAY_PORT=80
```

## Step 5: Database Migration

### 5.1 Run Migration Script
After deployment, run the database migration:

```bash
# Connect to your HR service container
# Or add migration to the startup script
npm run migrate
```

### 5.2 Alternative: Add Migration to Startup

Update `services/hr_service/index.js`:
```javascript
const { migrate } = require('./migrate');

// ... existing code ...

async function startServer() {
  try {
    // Run database migration
    await migrate();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 HR Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

## Step 6: Testing Deployment

### 6.1 Test Health Endpoints

```bash
# Test API Gateway
curl https://sparkle-api-gateway.onrender.com/health

# Test HR Service directly
curl https://sparkle-hr-service.onrender.com/health

# Test Admin Service directly
curl https://sparkle-admin-service.onrender.com/health
```

### 6.2 Test API Endpoints

```bash
# Test HR endpoints through gateway
curl https://sparkle-api-gateway.onrender.com/api/hr/employees

# Test Admin endpoints through gateway
curl https://sparkle-api-gateway.onrender.com/api/admin/dashboard
```

## Step 7: Update Frontend Configuration

### 7.1 Update API Base URL
Update your frontend application to use the new Render URLs:

```javascript
// Development
const API_BASE_URL = 'http://localhost:3000';

// Production
const API_BASE_URL = 'https://sparkle-api-gateway.onrender.com';
```

### 7.2 Update CORS Configuration
Ensure your frontend domain is allowed in the CORS configuration.

## Troubleshooting

### Common Issues

#### 1. Build Failures
- Check Dockerfile syntax
- Verify all required files are present
- Check package.json dependencies

#### 2. Database Connection Issues
- Verify environment variables are set correctly
- Check database credentials
- Ensure database is accessible from services

#### 3. Service Communication Issues
- Verify service URLs in nginx configuration
- Check health endpoints
- Review service logs

#### 4. CORS Issues
- Update CORS configuration for production domains
- Check preflight request handling

### Debug Commands

```bash
# Check service logs
# Go to Render dashboard → Your Service → Logs

# Check database connection
# Go to Render dashboard → Database → Connect

# Test service health
curl https://your-service.onrender.com/health
```

## Monitoring and Maintenance

### 1. Health Monitoring
- Set up health checks for all services
- Monitor response times and error rates
- Set up alerts for service failures

### 2. Database Management
- Regular backups (automatic with Render)
- Monitor database performance
- Scale database as needed

### 3. Service Scaling
- Monitor resource usage
- Scale services based on traffic
- Consider upgrading from free tier for production

## Cost Optimization

### Free Tier Limits
- **Web Services**: 750 hours/month
- **Database**: 90 days free trial
- **Bandwidth**: 100GB/month

### Production Considerations
- Upgrade to paid plans for 24/7 uptime
- Use custom domains
- Enable SSL certificates
- Set up monitoring and alerts

## Security Best Practices

### 1. Environment Variables
- Never commit sensitive data to repository
- Use Render's environment variable management
- Rotate database passwords regularly

### 2. Network Security
- Use HTTPS for all communications
- Implement proper CORS policies
- Consider API rate limiting

### 3. Database Security
- Use strong passwords
- Limit database access
- Regular security updates

## Support and Resources

### Render Documentation
- [Render Docs](https://render.com/docs)
- [Docker on Render](https://render.com/docs/deploy-an-image)
- [Environment Variables](https://render.com/docs/environment-variables)

### Community Support
- [Render Community](https://community.render.com)
- [GitHub Issues](https://github.com/render-oss/roadmap/issues)

---

**Last Updated**: August 2024
**Version**: 1.0
**Compatible with**: Sparkle HR System v2.0

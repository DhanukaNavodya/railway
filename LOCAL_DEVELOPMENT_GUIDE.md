# Local Development Guide for Sparkle Microservices

This guide will help you run your Sparkle microservices locally using Docker Compose.

## Prerequisites

1. **Docker Desktop**: Install from [docker.com](https://docker.com)
2. **Git**: For cloning the repository
3. **Node.js** (optional): For development without Docker

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Clone and navigate to the project**:
   ```bash
   cd /path/to/your/sparkle-project
   ```

2. **Start all services**:
   ```bash
   docker-compose -f docker-compose.local.yml up --build
   ```

3. **Access your services**:
   - **API Gateway**: http://localhost:3000
   - **HR Service**: http://localhost:5000
   - **Admin Service**: http://localhost:5001
   - **MySQL**: localhost:3309
   - **Redis**: localhost:6379

### Option 2: Using Original Docker Compose

If you prefer to use the original setup:

```bash
# Fix the original docker-compose.yml first
docker-compose up --build
```

## Service Details

### 🔗 API Gateway (Nginx)
- **URL**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Routes**:
  - HR Service: `/api/hr/*` or `/hr/*`
  - Admin Service: `/api/admin/*` or `/admin/*`

### 👥 HR Service
- **URL**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/employees
- **Database**: MySQL (sparkle_hr)

### ⚙️ Admin Service
- **URL**: http://localhost:5001
- **Health Check**: http://localhost:5001/health
- **Database**: MySQL (sparkle_hr)

### 🗄️ MySQL Database
- **Host**: localhost
- **Port**: 3309
- **Database**: sparkle_hr
- **Username**: root
- **Password**: password
- **User**: sparkle_user
- **User Password**: sparkle_pass

### 🚀 Redis Cache
- **Host**: localhost
- **Port**: 6379
- **Password**: None (local development)

## Development Commands

### Start Services
```bash
# Start all services
docker-compose -f docker-compose.local.yml up

# Start in background
docker-compose -f docker-compose.local.yml up -d

# Start with rebuild
docker-compose -f docker-compose.local.yml up --build
```

### Stop Services
```bash
# Stop all services
docker-compose -f docker-compose.local.yml down

# Stop and remove volumes
docker-compose -f docker-compose.local.yml down -v
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.local.yml logs

# Specific service
docker-compose -f docker-compose.local.yml logs hr-service
docker-compose -f docker-compose.local.yml logs admin-service
docker-compose -f docker-compose.local.yml logs api-gateway
docker-compose -f docker-compose.local.yml logs mysql
```

### Access Services
```bash
# Access HR Service container
docker-compose -f docker-compose.local.yml exec hr-service sh

# Access Admin Service container
docker-compose -f docker-compose.local.yml exec admin-service sh

# Access MySQL
docker-compose -f docker-compose.local.yml exec mysql mysql -u root -ppassword sparkle_hr

# Access Redis
docker-compose -f docker-compose.local.yml exec redis redis-cli
```

## Testing Your Setup

### 1. Health Checks
```bash
# API Gateway
curl http://localhost:3000/health

# HR Service
curl http://localhost:5000/api/employees

# Admin Service
curl http://localhost:5001/health
```

### 2. API Endpoints
```bash
# HR Service via Gateway
curl http://localhost:3000/api/hr/employees

# Admin Service via Gateway
curl http://localhost:3000/api/admin/

# Direct HR Service
curl http://localhost:5000/api/employees

# Direct Admin Service
curl http://localhost:5001/api/admin/
```

### 3. Database Connection
```bash
# Connect to MySQL
mysql -h localhost -P 3309 -u root -ppassword sparkle_hr

# Test Redis
redis-cli -h localhost -p 6379 ping
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Check what's using the port
   lsof -i :3000
   lsof -i :5000
   lsof -i :5001
   lsof -i :3309
   lsof -i :6379
   
   # Kill the process
   kill -9 <PID>
   ```

2. **Docker Build Fails**:
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose -f docker-compose.local.yml build --no-cache
   ```

3. **Database Connection Issues**:
   ```bash
   # Check if MySQL is running
   docker-compose -f docker-compose.local.yml ps mysql
   
   # Check MySQL logs
   docker-compose -f docker-compose.local.yml logs mysql
   ```

4. **Service Won't Start**:
   ```bash
   # Check service logs
   docker-compose -f docker-compose.local.yml logs <service-name>
   
   # Check service status
   docker-compose -f docker-compose.local.yml ps
   ```

### Reset Everything
```bash
# Stop and remove everything
docker-compose -f docker-compose.local.yml down -v

# Remove all containers and images
docker system prune -a

# Start fresh
docker-compose -f docker-compose.local.yml up --build
```

## Development Workflow

### 1. Code Changes
- Edit your code in the `services/` directory
- Changes will require rebuilding the containers:
  ```bash
  docker-compose -f docker-compose.local.yml up --build
  ```

### 2. Database Changes
- Edit files in `database/init.sql/`
- Reset the database:
  ```bash
  docker-compose -f docker-compose.local.yml down -v
  docker-compose -f docker-compose.local.yml up --build
  ```

### 3. Nginx Configuration
- Edit `api-gateway/default.conf` or `api-gateway/nginx.conf`
- Rebuild the gateway:
  ```bash
  docker-compose -f docker-compose.local.yml up --build api-gateway
  ```

## Environment Variables

### Local Development
All environment variables are set in `docker-compose.local.yml`:

- **NODE_ENV**: development
- **DB_HOST**: mysql
- **DB_PORT**: 3306
- **DB_NAME**: sparkle_hr
- **DB_USER**: root
- **DB_PASSWORD**: password

### Custom Environment
Create a `.env` file in the root directory:
```env
NODE_ENV=development
DB_PASSWORD=your_custom_password
MYSQL_ROOT_PASSWORD=your_custom_root_password
```

## Performance Tips

1. **Use Volume Mounts for Development**:
   ```yaml
   volumes:
     - ./services/hr_service:/app
     - /app/node_modules
   ```

2. **Enable Hot Reload**:
   - Use `nodemon` for Node.js services
   - Mount source code as volumes

3. **Optimize Docker Builds**:
   - Use `.dockerignore` files
   - Layer caching
   - Multi-stage builds

## Next Steps

1. **Set up your IDE**: Configure debugging and hot reload
2. **Add tests**: Unit and integration tests
3. **Configure CI/CD**: GitHub Actions or similar
4. **Production deployment**: Use the Render configuration

## Support

- **Docker Docs**: [docs.docker.com](https://docs.docker.com)
- **Docker Compose**: [docs.docker.com/compose](https://docs.docker.com/compose)
- **Node.js**: [nodejs.org](https://nodejs.org)
- **MySQL**: [dev.mysql.com](https://dev.mysql.com)
- **Redis**: [redis.io](https://redis.io)

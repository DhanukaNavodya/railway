# Railway Deployment Guide for Sparkle Microservices

This guide will walk you through deploying your Sparkle microservices to Railway using their monorepo support.

## Prerequisites

1. **GitHub Repository**: Your code must be pushed to a GitHub repository
2. **Railway Account**: Sign up at [railway.app](https://railway.app)
3. **Database Credentials**: Prepare secure passwords for MySQL and Redis

## Step 1: Prepare Your Repository

All necessary files have been created:
- ✅ `railway.json` files for each service
- ✅ Updated Dockerfiles for Railway compatibility
- ✅ Environment variable templates
- ✅ Health check scripts

## Step 2: Push to GitHub

```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

## Step 3: Deploy on Railway

### 3.1 Create New Project

1. **Go to Railway Dashboard**: [railway.app/dashboard](https://railway.app/dashboard)
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose your repository**

### 3.2 Create Services

You'll need to create **5 services** from the same repository:

#### Service 1: API Gateway (Public Web Service)
1. **Click "Add Service"** → **"Service from Repository"**
2. **Select your repository again**
3. **Set Service Name**: `sparkle-api-gateway`
4. **Set Root Directory**: `api-gateway`
5. **Environment Variables**:
   ```
   HR_SERVICE_INTERNAL_URL=http://sparkle-hr-service:5000
   ADMIN_SERVICE_INTERNAL_URL=http://sparkle-admin-service:5001
   PORT=10000
   ```

#### Service 2: HR Service (Private Service)
1. **Click "Add Service"** → **"Service from Repository"**
2. **Select your repository again**
3. **Set Service Name**: `sparkle-hr-service`
4. **Set Root Directory**: `services/hr_service`
5. **Disable Public URL** (in Settings → Networking)
6. **Environment Variables**:
   ```
   PORT=5000
   NODE_ENV=production
   DB_HOST=sparkle-mysql
   DB_PORT=3306
   DB_NAME=sparkle_hr
   DB_USER=root
   DB_PASSWORD=[set during deployment]
   ```

#### Service 3: Admin Service (Private Service)
1. **Click "Add Service"** → **"Service from Repository"**
2. **Select your repository again**
3. **Set Service Name**: `sparkle-admin-service`
4. **Set Root Directory**: `services/admin_service`
5. **Disable Public URL** (in Settings → Networking)
6. **Environment Variables**:
   ```
   PORT=5001
   NODE_ENV=production
   ADMIN_SERVICE_PORT=5001
   DB_HOST=sparkle-mysql
   DB_NAME=sparkle_hr
   DB_USER=root
   DB_PASSWORD=[set during deployment]
   ```

#### Service 4: MySQL Database (Private Service)
1. **Click "Add Service"** → **"Service from Repository"**
2. **Select your repository again**
3. **Set Service Name**: `sparkle-mysql`
4. **Set Root Directory**: `database`
5. **Disable Public URL** (in Settings → Networking)
6. **Environment Variables**:
   ```
   MYSQL_ROOT_PASSWORD=[set during deployment]
   MYSQL_DATABASE=sparkle_hr
   MYSQL_USER=sparkle_user
   MYSQL_PASSWORD=[set during deployment]
   ```

#### Service 5: Redis Cache (Private Service)
1. **Click "Add Service"** → **"Service from Repository"**
2. **Select your repository again**
3. **Set Service Name**: `sparkle-redis`
4. **Set Root Directory**: `redis`
5. **Disable Public URL** (in Settings → Networking)
6. **Environment Variables**:
   ```
   REDIS_PASSWORD=[set during deployment]
   ```

### 3.3 Set Environment Variables

For each service, go to **Variables** tab and set the secret values:

**For HR Service:**
- `DB_PASSWORD` - MySQL password for HR service

**For Admin Service:**
- `DB_PASSWORD` - MySQL password for admin service

**For MySQL Database:**
- `MYSQL_ROOT_PASSWORD` - Root password for MySQL
- `MYSQL_PASSWORD` - Password for sparkle_user

**For Redis:**
- `REDIS_PASSWORD` - Redis authentication password

### 3.4 Update Internal URLs (After First Deploy)

Once all services are deployed, you'll need to update the internal URLs in the API Gateway:

1. **Get Internal Addresses**:
   - Go to each private service (HR, Admin, MySQL, Redis)
   - Click "Connect" → "Internal"
   - Copy the internal addresses

2. **Update API Gateway Environment Variables**:
   - Go to the `sparkle-api-gateway` service
   - Click "Variables" tab
   - Update these variables:
     ```
     HR_SERVICE_INTERNAL_URL=http://sparkle-hr-service:5000
     ADMIN_SERVICE_INTERNAL_URL=http://sparkle-admin-service:5001
     ```

3. **Redeploy Gateway**:
   - Click "Deploy" to apply the changes

## Step 4: Monitor Deployment

1. **Check Service Status**: Each service will show its deployment progress
2. **View Logs**: Click on any service to see real-time logs
3. **Health Checks**: Services will automatically restart if health checks fail

## Step 5: Test Your Deployment

1. **Health Check**: Visit `https://your-gateway-url.railway.app/health`
2. **API Endpoints**: Test your HR and Admin service endpoints
3. **Database Connection**: Verify services can connect to MySQL

## Service URLs

After deployment, you'll have:

- **Public Gateway**: `https://sparkle-api-gateway.railway.app`
- **HR Service**: Private (accessible via gateway)
- **Admin Service**: Private (accessible via gateway)
- **MySQL**: Private (internal network only)
- **Redis**: Private (internal network only)

## Environment Variables Reference

### API Gateway
- `PORT`: 10000 (Railway default)
- `HR_SERVICE_INTERNAL_URL`: Internal HR service URL
- `ADMIN_SERVICE_INTERNAL_URL`: Internal admin service URL

### HR Service
- `PORT`: 5000
- `NODE_ENV`: production
- `DB_HOST`: sparkle-mysql
- `DB_PORT`: 3306
- `DB_NAME`: sparkle_hr
- `DB_USER`: root
- `DB_PASSWORD`: [set during deployment]

### Admin Service
- `PORT`: 5001
- `NODE_ENV`: production
- `ADMIN_SERVICE_PORT`: 5001
- `DB_HOST`: sparkle-mysql
- `DB_NAME`: sparkle_hr
- `DB_USER`: root
- `DB_PASSWORD`: [set during deployment]

### MySQL Database
- `MYSQL_ROOT_PASSWORD`: [set during deployment]
- `MYSQL_DATABASE`: sparkle_hr
- `MYSQL_USER`: sparkle_user
- `MYSQL_PASSWORD`: [set during deployment]

### Redis
- `REDIS_PASSWORD`: [set during deployment]

## Railway CLI (Optional)

If you prefer using the Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Deploy specific service
railway up --service sparkle-api-gateway

# View logs
railway logs --service sparkle-api-gateway

# Set environment variables
railway variables set DB_PASSWORD=your_password --service sparkle-hr-service
```

## Troubleshooting

### Common Issues

1. **Service Won't Start**:
   - Check logs for error messages
   - Verify environment variables are set correctly
   - Ensure ports are configured properly

2. **Database Connection Issues**:
   - Verify MySQL service is running
   - Check database credentials
   - Ensure services wait for database to be ready

3. **Gateway Routing Issues**:
   - Verify internal URLs are correct
   - Check nginx configuration
   - Ensure services are healthy

4. **Build Failures**:
   - Check Dockerfile syntax
   - Verify all required files are present
   - Check railway.json configuration

### Useful Commands

```bash
# Check service logs
# Go to service dashboard → Logs

# Manual deploy
# Go to service dashboard → Deploy

# Environment variables
# Go to service dashboard → Variables
```

## Cost Optimization

- **Free Tier**: Railway offers a generous free tier
- **Auto-sleep**: Services sleep after inactivity
- **Scaling**: Can upgrade to paid plans for better performance

## Security Notes

- All sensitive data should be set as environment variables
- Database passwords are set during deployment
- Services communicate over Railway's private network
- CORS is configured for production domains

## Next Steps

1. **Custom Domain**: Add your domain to the API Gateway
2. **SSL**: Railway provides automatic SSL certificates
3. **Monitoring**: Set up alerts and monitoring
4. **Backup**: Configure database backups
5. **Scaling**: Upgrade plans as needed

## Support

- **Railway Docs**: [railway.app/docs](https://railway.app/docs)
- **Community**: [community.railway.app](https://community.railway.app)
- **Status**: [status.railway.app](https://status.railway.app)

## Quick Checklist

- [ ] Each service has a Dockerfile and binds to `0.0.0.0:$PORT`
- [ ] Each service created in Railway with correct root directory
- [ ] Gateway is **public**; microservices use **private networking**
- [ ] Gateway `proxy_pass` targets are set from env vars
- [ ] All environment variables are configured
- [ ] Health checks are working
- [ ] Services can communicate with each other

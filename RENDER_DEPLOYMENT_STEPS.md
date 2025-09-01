# Render Deployment Guide for Sparkle Microservices

This guide will walk you through deploying your Sparkle microservices to Render using the Blueprint approach.

## Prerequisites

1. **GitHub Repository**: Your code must be pushed to a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Database Credentials**: Prepare secure passwords for MySQL and Redis

## Step 1: Prepare Your Repository

All necessary files have been created:
- ✅ `render.yaml` - Blueprint configuration
- ✅ Updated Dockerfiles for all services
- ✅ Environment variable templates
- ✅ Health check scripts

## Step 2: Push to GitHub

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

## Step 3: Deploy on Render

1. **Go to Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)

2. **Create New Blueprint**:
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository containing your code

3. **Configure Environment Variables**:
   Render will prompt you to enter the following secret values:
   
   **For HR Service:**
   - `DB_PASSWORD` - MySQL password for HR service
   
   **For Admin Service:**
   - `DB_PASSWORD` - MySQL password for admin service
   
   **For MySQL Database:**
   - `MYSQL_ROOT_PASSWORD` - Root password for MySQL
   - `MYSQL_PASSWORD` - Password for sparkle_user
   
   **For Redis:**
   - `REDIS_PASSWORD` - Redis authentication password

4. **Apply the Blueprint**:
   - Click "Apply" to start the deployment
   - Render will create all services simultaneously

## Step 4: Monitor Deployment

1. **Check Service Status**: Each service will show its deployment progress
2. **View Logs**: Click on any service to see real-time logs
3. **Health Checks**: Services will automatically restart if health checks fail

## Step 5: Update Internal URLs (After First Deploy)

Once all services are deployed, you'll need to update the internal URLs in the API Gateway:

1. **Get Internal Addresses**:
   - Go to each private service (HR, Admin, MySQL, Redis)
   - Click "Connect" → "Internal"
   - Copy the internal addresses

2. **Update API Gateway Environment Variables**:
   - Go to the `sparkle-api-gateway` service
   - Click "Environment" tab
   - Update these variables:
     ```
     HR_SERVICE_INTERNAL_URL=http://sparkle-hr-service:5000
     ADMIN_SERVICE_INTERNAL_URL=http://sparkle-admin-service:5001
     ```

3. **Redeploy Gateway**:
   - Click "Manual Deploy" to apply the changes

## Step 6: Test Your Deployment

1. **Health Check**: Visit `https://your-gateway-url.onrender.com/health`
2. **API Endpoints**: Test your HR and Admin service endpoints
3. **Database Connection**: Verify services can connect to MySQL

## Service URLs

After deployment, you'll have:

- **Public Gateway**: `https://sparkle-api-gateway.onrender.com`
- **HR Service**: Private (accessible via gateway)
- **Admin Service**: Private (accessible via gateway)
- **MySQL**: Private (internal network only)
- **Redis**: Private (internal network only)

## Environment Variables Reference

### API Gateway
- `PORT`: 10000 (Render default)
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

### Useful Commands

```bash
# Check service logs
# Go to service dashboard → Logs

# Manual deploy
# Go to service dashboard → Manual Deploy

# Environment variables
# Go to service dashboard → Environment
```

## Cost Optimization

- **Starter Plans**: All services use starter plans (free tier)
- **Auto-sleep**: Services sleep after 15 minutes of inactivity
- **Scaling**: Can upgrade to paid plans for better performance

## Security Notes

- All sensitive data uses `sync: false` in render.yaml
- Database passwords are set during deployment
- Services communicate over Render's private network
- CORS is configured for production domains

## Next Steps

1. **Custom Domain**: Add your domain to the API Gateway
2. **SSL**: Render provides automatic SSL certificates
3. **Monitoring**: Set up alerts and monitoring
4. **Backup**: Configure database backups
5. **Scaling**: Upgrade plans as needed

## Support

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Community**: [community.render.com](https://community.render.com)
- **Status**: [status.render.com](https://status.render.com)

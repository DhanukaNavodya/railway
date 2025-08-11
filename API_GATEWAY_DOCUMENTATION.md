# Sparkle API Gateway Documentation

## Overview

The Sparkle API Gateway serves as a central entry point for all microservices in the Sparkle HR system. It provides routing, proxy functionality, and unified access to HR and Admin services. The gateway is built using **Nginx** for high performance, reliability, and advanced proxy capabilities.

## Quick Start

### 1. Start Docker Services

```bash
# Start all services
docker-compose up --build

# Or start in detached mode
docker-compose up --build -d
```

### 2. Verify Services are Running

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f api-gateway
```

### 3. Test API Gateway

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test API Gateway response
curl http://localhost:3000/
```

## API Gateway Endpoints

### Base URL
- **Local Development**: `http://localhost:3000`
- **Docker Environment**: `http://localhost:3000`
- **Gateway Technology**: Nginx (High-performance reverse proxy)

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "gateway": "running",
    "hr_service": "http://hr-service:5000",
    "admin_service": "http://admin-service:5001"
  }
}
```

### API Documentation
```http
GET /
```

**Response:**
```json
{
  "message": "Sparkle API Gateway",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "hr_service": "/api/hr/*",
    "admin_service": "/api/admin/*"
  },
  "documentation": {
    "hr_service": "http://localhost:5000/api",
    "admin_service": "http://localhost:5001/api"
  }
}
```

## HR Service Endpoints

All HR service endpoints are accessible through the `/api/hr` prefix.

### Employee Management

#### Get All Employees
```http
GET /api/hr/employees
```

#### Get Employee by ID
```http
GET /api/hr/employees/:id
```

#### Create Employee
```http
POST /api/hr/employees
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "phone": "+1234567890",
  "department": "Engineering",
  "position": "Software Engineer",
  "hireDate": "2024-01-15",
  "salary": 75000
}
```

#### Update Employee
```http
PUT /api/hr/employees/:id
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@company.com",
  "phone": "+1234567890",
  "department": "Engineering",
  "position": "Senior Software Engineer",
  "salary": 85000
}
```

#### Delete Employee
```http
DELETE /api/hr/employees/:id
```

### Department Management

#### Get All Departments
```http
GET /api/hr/departments
```

#### Create Department
```http
POST /api/hr/departments
Content-Type: application/json

{
  "name": "Human Resources",
  "description": "HR Department",
  "managerId": 1
}
```

### Leave Management

#### Get All Leave Requests
```http
GET /api/hr/leaves
```

#### Create Leave Request
```http
POST /api/hr/leaves
Content-Type: application/json

{
  "employeeId": 1,
  "leaveTypeId": 1,
  "startDate": "2024-02-01",
  "endDate": "2024-02-05",
  "reason": "Annual vacation",
  "status": "pending"
}
```

#### Approve/Reject Leave
```http
PUT /api/hr/leaves/:id/status
Content-Type: application/json

{
  "status": "approved",
  "comments": "Approved"
}
```

### Attendance Management

#### Get Attendance Records
```http
GET /api/hr/attendance
```

#### Mark Attendance
```http
POST /api/hr/attendance
Content-Type: application/json

{
  "employeeId": 1,
  "date": "2024-01-15",
  "checkIn": "09:00:00",
  "checkOut": "17:00:00",
  "status": "present"
}
```

## Admin Service Endpoints

All admin service endpoints are accessible through the `/api/admin` prefix.

### System Administration

#### Get Dashboard
```http
GET /api/admin/dashboard
```

#### Get System Overview
```http
GET /api/admin/overview
```

#### Get System Status
```http
GET /api/admin/system-status
```

#### Get Service Health
```http
GET /api/admin/service-health
```

### User Management

#### Get All Users
```http
GET /api/user-management/users
```

#### Create User
```http
POST /api/user-management/users
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@company.com",
  "password": "securepassword",
  "role": "admin",
  "firstName": "Admin",
  "lastName": "User"
}
```

#### Update User
```http
PUT /api/user-management/users/:id
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@company.com",
  "role": "admin",
  "firstName": "Admin",
  "lastName": "User"
}
```

### System Configuration

#### Get System Settings
```http
GET /api/system-config/settings
```

#### Update System Settings
```http
PUT /api/system-config/settings
Content-Type: application/json

{
  "companyName": "Sparkle Corp",
  "timezone": "UTC",
  "workingHours": {
    "start": "09:00",
    "end": "17:00"
  },
  "leaveSettings": {
    "annualLeaveDays": 25,
    "sickLeaveDays": 10
  }
}
```

## Authentication & Security

### CORS Configuration
The API Gateway supports the following origins:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)
- `http://localhost:8080` (Alternative dev server)
- `https://sparkle-hr.netlify.app` (Production)

### Rate Limiting
- **Limit**: 100 requests per 15 minutes per IP
- **Message**: "Too many requests from this IP, please try again later."

### Headers
All requests should include:
```
Content-Type: application/json
```

## Error Handling

### Common Error Responses

#### 404 - Route Not Found
```json
{
  "error": "Route not found",
  "message": "The requested route /api/invalid does not exist",
  "available_routes": {
    "health": "/health",
    "hr_service": "/api/hr/*",
    "admin_service": "/api/admin/*"
  }
}
```

#### 503 - Service Unavailable
```json
{
  "error": "HR Service is currently unavailable",
  "message": "Please try again later"
}
```

#### 429 - Too Many Requests
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

#### 500 - Internal Server Error
```json
{
  "error": "Internal Gateway Error",
  "message": "Something went wrong in the API Gateway"
}
```

## Testing with cURL

### Health Check
```bash
curl -X GET http://localhost:3000/health
```

### Get All Employees
```bash
curl -X GET http://localhost:3000/api/hr/employees
```

### Create Employee
```bash
curl -X POST http://localhost:3000/api/hr/employees \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@company.com",
    "phone": "+1234567890",
    "department": "Marketing",
    "position": "Marketing Manager",
    "hireDate": "2024-01-15",
    "salary": 65000
  }'
```

### Get System Dashboard
```bash
curl -X GET http://localhost:3000/api/admin/dashboard
```

## Testing with Postman

### Import Collection
1. Open Postman
2. Click "Import"
3. Create a new collection called "Sparkle API Gateway"
4. Add the base URL: `http://localhost:3000`

### Environment Variables Setup
Create a Postman environment with these variables:
- `baseUrl`: `http://localhost:3000`
- `apiVersion`: `api/hr`

### Sample Requests

#### Health Check
- **Method**: GET
- **URL**: `{{baseUrl}}/health`

#### Get All Employees
- **Method**: GET
- **URL**: `{{baseUrl}}/{{apiVersion}}/employees`
- **Headers**: 
  - `Content-Type: application/json`

#### Get Employee by ID
- **Method**: GET
- **URL**: `{{baseUrl}}/{{apiVersion}}/employees/1`
- **Headers**: 
  - `Content-Type: application/json`

#### Create Employee
- **Method**: POST
- **URL**: `{{baseUrl}}/{{apiVersion}}/employees`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "phone": "+1234567890",
  "department": "Engineering",
  "position": "Software Engineer",
  "hireDate": "2024-01-15",
  "salary": 75000
}
```

#### Update Employee
- **Method**: PUT
- **URL**: `{{baseUrl}}/{{apiVersion}}/employees/1`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@company.com",
  "phone": "+1234567890",
  "department": "Engineering",
  "position": "Senior Software Engineer",
  "salary": 85000
}
```

#### Delete Employee
- **Method**: DELETE
- **URL**: `{{baseUrl}}/{{apiVersion}}/employees/1`
- **Headers**: 
  - `Content-Type: application/json`

#### Get All Departments
- **Method**: GET
- **URL**: `{{baseUrl}}/{{apiVersion}}/departments`
- **Headers**: 
  - `Content-Type: application/json`

#### Create Department
- **Method**: POST
- **URL**: `{{baseUrl}}/{{apiVersion}}/departments`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "Human Resources",
  "description": "HR Department",
  "managerId": 1
}
```

#### Get All Leave Requests
- **Method**: GET
- **URL**: `{{baseUrl}}/{{apiVersion}}/leaves`
- **Headers**: 
  - `Content-Type: application/json`

#### Create Leave Request
- **Method**: POST
- **URL**: `{{baseUrl}}/{{apiVersion}}/leaves`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "employeeId": 1,
  "leaveTypeId": 1,
  "startDate": "2024-02-01",
  "endDate": "2024-02-05",
  "reason": "Annual vacation",
  "status": "pending"
}
```

#### Get Attendance Records
- **Method**: GET
- **URL**: `{{baseUrl}}/{{apiVersion}}/attendance`
- **Headers**: 
  - `Content-Type: application/json`

#### Mark Attendance
- **Method**: POST
- **URL**: `{{baseUrl}}/{{apiVersion}}/attendance`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "employeeId": 1,
  "date": "2024-01-15",
  "checkIn": "09:00:00",
  "checkOut": "17:00:00",
  "status": "present"
}
```

## Gateway Features

### Nginx-based Architecture
- **High Performance**: Nginx is designed for high concurrency and low memory usage
- **Advanced Proxy**: Built-in load balancing, caching, and SSL termination
- **Rate Limiting**: Configurable rate limiting to prevent abuse (100 requests per 15 minutes per IP)
- **CORS Support**: Comprehensive CORS handling for cross-origin requests
- **Health Checks**: Built-in health monitoring and failover
- **Logging**: Detailed access and error logging for debugging
- **Multiple Worker Processes**: Automatically scales based on available CPU cores

### Configuration Files
- **nginx.conf**: Main Nginx configuration with global settings, rate limiting, and worker processes
- **default.conf**: Server configuration with routing rules, proxy settings, and CORS handling

### Architecture Benefits
- **Lightweight**: Nginx Alpine image (~40MB vs Node.js ~200MB)
- **Fast Startup**: Nginx starts in seconds vs Node.js startup time
- **Resource Efficient**: Lower memory and CPU usage
- **Production Ready**: Industry-standard reverse proxy solution

## Environment Variables

### API Gateway Configuration
The Nginx-based gateway doesn't require environment variables as configuration is handled through Nginx configuration files.

### Service URLs
- **HR Service**: `http://localhost:5000` (local) / `http://hr-service:5000` (Docker)
- **Admin Service**: `http://localhost:5001` (local) / `http://admin-service:5001` (Docker)
- **MySQL Database**: `localhost:3309` (external access)

## Troubleshooting

### Common Issues

#### 1. Docker Services Not Starting
```bash
# Check Docker Desktop is running
docker info

# Restart Docker Desktop if needed
# Then try again
docker-compose up --build
```

#### 2. Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :3000

# Kill the process or change the port in docker-compose.yml
```

#### 3. Service Connection Issues
```bash
# Check service logs
docker-compose logs api-gateway
docker-compose logs hr-service
docker-compose logs admin-service

# Check if services are healthy
curl http://localhost:3000/health
```

#### 4. CORS Issues
- Ensure your frontend is running on an allowed origin
- Check the CORS configuration in the gateway
- Verify the request includes proper headers

#### 5. Nginx Permission Issues
```bash
# If you see "Permission denied" errors in nginx logs
# The Dockerfile is configured to run nginx as root to bind to port 80
# This is normal and expected behavior
```

#### 6. Database Connection Issues
```bash
# If HR service can't connect to database
# Check if MySQL container is healthy
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Verify database environment variables in docker-compose.yml
```

### Debug Mode
To run with debug logging:
```bash
# Set debug environment variable
export DEBUG=sparkle:*

# Or add to docker-compose.yml
environment:
  - DEBUG=sparkle:*
```

## Monitoring

### Health Checks
- **Gateway**: `http://localhost:3000/health`
- **HR Service**: `http://localhost:5000/health`
- **Admin Service**: `http://localhost:5001/health`

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs api-gateway
docker-compose logs hr-service
docker-compose logs admin-service

# Follow logs in real-time
docker-compose logs -f api-gateway
```

## Performance

### Rate Limiting
- 100 requests per 15 minutes per IP
- Configurable in `nginx.conf`
- Burst allowance of 20 requests

### Caching
- Consider implementing Redis caching for frequently accessed data
- Cache employee lists, department lists, etc.

### Load Balancing
- For production, consider using a load balancer
- Multiple gateway instances can be deployed behind a load balancer

### Nginx Performance Features
- **Worker Processes**: Automatically scales based on CPU cores
- **Event-driven Architecture**: Non-blocking I/O for high concurrency
- **Connection Pooling**: Efficient handling of multiple connections
- **Static File Serving**: Fast delivery of static assets
- **Gzip Compression**: Automatic compression of responses

## Security Best Practices

1. **Use HTTPS in Production**
2. **Implement JWT Authentication**
3. **Validate all input data**
4. **Use environment variables for sensitive data**
5. **Regular security updates**
6. **Monitor for suspicious activity**

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review service logs
3. Verify Docker services are running
4. Test individual service endpoints directly
5. Check network connectivity between services

## Migration from Node.js to Nginx

### What Changed
- **Technology**: Replaced Node.js Express server with Nginx reverse proxy
- **Configuration**: Moved from JavaScript configuration to Nginx configuration files
- **Performance**: Improved performance and reduced resource usage
- **Reliability**: More stable and production-ready solution

### Benefits Achieved
- **Faster Startup**: Nginx starts in seconds vs Node.js startup time
- **Lower Memory Usage**: ~40MB vs ~200MB for Node.js
- **Better Concurrency**: Nginx handles thousands of concurrent connections efficiently
- **Industry Standard**: Nginx is the de facto standard for reverse proxies

### Configuration Files
- **nginx.conf**: Global Nginx settings, rate limiting, worker processes
- **default.conf**: Server blocks, routing rules, proxy configuration
- **Dockerfile**: Container configuration for Nginx Alpine image

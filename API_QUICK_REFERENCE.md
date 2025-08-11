# Sparkle API Gateway - Quick Reference

## 🚀 Quick Start

```bash
# Start all services
docker-compose up --build

# Test API Gateway
curl http://localhost:3000/health
```

## 📍 Base URL
- **API Gateway**: `http://localhost:3000`
- **HR Service**: `http://localhost:3000/api/hr/*`
- **Admin Service**: `http://localhost:3000/api/admin/*`

## 🔧 Technology Stack
- **API Gateway**: Nginx (Alpine Linux)
- **HR Service**: Node.js + Express
- **Admin Service**: Node.js + Express
- **Database**: MySQL 8.0
- **Cache**: Redis 7

## 📋 Essential Endpoints

### Health Check
```bash
GET http://localhost:3000/health
```

### Employee Management
```bash
# Get all employees
GET http://localhost:3000/api/hr/employees

# Get employee by ID
GET http://localhost:3000/api/hr/employees/1

# Create employee
POST http://localhost:3000/api/hr/employees
Content-Type: application/json

# Update employee
PUT http://localhost:3000/api/hr/employees/1
Content-Type: application/json

# Delete employee
DELETE http://localhost:3000/api/hr/employees/1
```

### Department Management
```bash
# Get all departments
GET http://localhost:3000/api/hr/departments

# Create department
POST http://localhost:3000/api/hr/departments
Content-Type: application/json
```

### Leave Management
```bash
# Get all leave requests
GET http://localhost:3000/api/hr/leaves

# Create leave request
POST http://localhost:3000/api/hr/leaves
Content-Type: application/json

# Approve/reject leave
PUT http://localhost:3000/api/hr/leaves/1/status
Content-Type: application/json
```

### Attendance Management
```bash
# Get attendance records
GET http://localhost:3000/api/hr/attendance

# Mark attendance
POST http://localhost:3000/api/hr/attendance
Content-Type: application/json
```

## 🛠️ Postman Setup

### Environment Variables
- `baseUrl`: `http://localhost:3000`
- `apiVersion`: `api/hr`

### Import Collection
Import `Sparkle_API_Gateway_Postman_Collection.json` into Postman

## 🔒 Security Features

### CORS Support
- `http://localhost:3000`
- `http://localhost:5173`
- `https://sparkle-hr.netlify.app`

### Rate Limiting
- 100 requests per 15 minutes per IP
- Burst allowance: 20 requests

## 📊 Performance Features

### Nginx Benefits
- **Worker Processes**: Auto-scales with CPU cores
- **Event-driven**: Non-blocking I/O
- **Memory Usage**: ~40MB vs Node.js ~200MB
- **Startup Time**: Seconds vs Node.js startup time

## 🐛 Troubleshooting

### Common Issues

#### 1. Service Not Starting
```bash
# Check Docker Desktop
docker info

# Restart services
docker-compose down
docker-compose up --build
```

#### 2. Port Conflicts
```bash
# Check port usage
netstat -ano | findstr :3000

# Kill process or change port in docker-compose.yml
```

#### 3. Database Connection
```bash
# Check MySQL health
docker-compose ps mysql

# View MySQL logs
docker-compose logs mysql
```

#### 4. API Gateway Issues
```bash
# Check Nginx logs
docker-compose logs api-gateway

# Test gateway health
curl http://localhost:3000/health
```

## 📝 Sample Request Bodies

### Create Employee
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

### Create Department
```json
{
  "name": "Human Resources",
  "description": "HR Department",
  "managerId": 1
}
```

### Create Leave Request
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

### Mark Attendance
```json
{
  "employeeId": 1,
  "date": "2024-01-15",
  "checkIn": "09:00:00",
  "checkOut": "17:00:00",
  "status": "present"
}
```

## 🔄 Migration Notes

### From Node.js to Nginx
- **Technology**: Node.js Express → Nginx reverse proxy
- **Configuration**: JavaScript → Nginx config files
- **Performance**: Improved startup time and resource usage
- **Reliability**: More stable and production-ready

### Configuration Files
- `nginx.conf`: Global settings, rate limiting, worker processes
- `default.conf`: Server blocks, routing, proxy configuration
- `Dockerfile`: Nginx Alpine container setup

## 📞 Support

For issues:
1. Check troubleshooting section
2. Review service logs
3. Verify Docker services
4. Test individual endpoints
5. Check network connectivity

---

**Last Updated**: August 2024
**Version**: 2.0 (Nginx-based API Gateway)

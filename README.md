# Sparkle Microservices Backend

A microservices-based backend system with an API Gateway, HR Service, and Admin Service built with Node.js and Express.

## 🏗️ Architecture

```
project-root/
│
├── api-gateway/               # Handles all incoming requests & routes to services
│   ├── package.json
│   ├── server.js
│   └── Dockerfile
│
├── services/
│   ├── hr_service/            # HR microservice (existing)
│   │   ├── package.json
│   │   ├── index.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── Dockerfile
│   │
│   └── admin_service/         # Admin microservice (new)
│       ├── package.json
│       ├── server.js
│       ├── controllers/
│       ├── routes/
│       └── Dockerfile
│
├── docker-compose.yml         # Docker orchestration
└── package.json               # Root package.json with scripts
```

## 🚀 Services

### API Gateway (Port: 3000)
- **Purpose**: Single entry point for all client requests
- **Features**:
  - Request routing to appropriate services
  - CORS handling
  - Rate limiting
  - Security headers
  - Health monitoring
  - Error handling

### HR Service (Port: 5000)
- **Purpose**: Handles all HR-related operations
- **Features**:
  - Employee management
  - Department management
  - Leave management
  - Attendance tracking
  - Loan management
  - Shift management

### Admin Service (Port: 5001)
- **Purpose**: System administration and user management
- **Features**:
  - Admin dashboard
  - User management
  - Role and permission management
  - System configuration
  - System monitoring
  - Backup management

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker & Docker Compose (for containerized deployment)
- MySQL 8.0+ (for database)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sparkle-microservices
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   Create `.env` files in each service directory:
   
   **api-gateway/.env**
   ```env
   NODE_ENV=development
   GATEWAY_PORT=3000
   HR_SERVICE_URL=http://localhost:5000
   ADMIN_SERVICE_URL=http://localhost:5001
   ```

   **services/hr_service/.env**
   ```env
   NODE_ENV=development
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=sparkle_hr
   DB_USER=root
   DB_PASSWORD=your_password
   ```

   **services/admin_service/.env**
   ```env
   NODE_ENV=development
   ADMIN_SERVICE_PORT=5001
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=sparkle_hr
   DB_USER=root
   DB_PASSWORD=your_password
   ```

4. **Start all services**
   ```bash
   # Development mode (with hot reload)
   npm run dev
   
   # Production mode
   npm start
   ```

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Run in background**
   ```bash
   docker-compose up -d
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

## 📡 API Endpoints

### API Gateway (http://localhost:3000)

#### Health Check
- `GET /health` - Gateway health status

#### HR Service Routes
- `GET /api/hr/*` - All HR service endpoints
- `POST /api/hr/*` - All HR service endpoints
- `PUT /api/hr/*` - All HR service endpoints
- `DELETE /api/hr/*` - All HR service endpoints

#### Admin Service Routes
- `GET /api/admin/*` - All admin service endpoints
- `POST /api/admin/*` - All admin service endpoints
- `PUT /api/admin/*` - All admin service endpoints
- `DELETE /api/admin/*` - All admin service endpoints

### HR Service (http://localhost:5000)

#### Employee Management
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

#### Department Management
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create new department
- `GET /api/departments/:id` - Get department by ID
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

#### Leave Management
- `GET /api/leaves` - Get all leaves
- `POST /api/leaves` - Create new leave request
- `GET /api/leaves/:id` - Get leave by ID
- `PUT /api/leaves/:id` - Update leave
- `DELETE /api/leaves/:id` - Delete leave

### Admin Service (http://localhost:5001)

#### Admin Dashboard
- `GET /api/admin/dashboard` - Get admin dashboard data
- `GET /api/admin/overview` - Get system overview
- `GET /api/admin/system-status` - Get system status
- `GET /api/admin/service-health` - Get service health

#### User Management
- `GET /api/user-management/users` - Get all users
- `POST /api/user-management/users` - Create new user
- `GET /api/user-management/users/:id` - Get user by ID
- `PUT /api/user-management/users/:id` - Update user
- `DELETE /api/user-management/users/:id` - Delete user

#### System Configuration
- `GET /api/system-config/config` - Get system configuration
- `PUT /api/system-config/config` - Update system configuration
- `GET /api/system-config/database` - Get database configuration
- `PUT /api/system-config/database` - Update database configuration

## 🔧 Development

### Running Individual Services

```bash
# API Gateway
cd api-gateway
npm run dev

# HR Service
cd services/hr_service
npm run dev

# Admin Service
cd services/admin_service
npm run dev
```

### Adding New Services

1. Create a new service directory in `services/`
2. Add the service to `docker-compose.yml`
3. Update the API Gateway routing
4. Add service scripts to root `package.json`

### Database Setup

1. **Create MySQL database**
   ```sql
   CREATE DATABASE sparkle_hr;
   ```

2. **Run migrations** (if available)
   ```bash
   # Add migration scripts as needed
   ```

## 🧪 Testing

### Health Checks
- API Gateway: `http://localhost:3000/health`
- HR Service: `http://localhost:5000/health`
- Admin Service: `http://localhost:5001/health`

### API Testing
Use tools like Postman or curl to test the endpoints:

```bash
# Test API Gateway
curl http://localhost:3000/health

# Test HR Service through Gateway
curl http://localhost:3000/api/hr/employees

# Test Admin Service through Gateway
curl http://localhost:3000/api/admin/dashboard
```

## 📊 Monitoring

### Logs
```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs api-gateway
docker-compose logs hr-service
docker-compose logs admin-service
```

### Health Monitoring
- All services include health check endpoints
- Docker health checks are configured
- Gateway provides service status overview

## 🔒 Security

- CORS configuration for allowed origins
- Rate limiting on API Gateway
- Security headers with Helmet
- Input validation (to be implemented)
- Authentication/Authorization (to be implemented)

## 🚀 Deployment

### Production Considerations
1. Set `NODE_ENV=production`
2. Configure proper environment variables
3. Set up SSL/TLS certificates
4. Configure proper database credentials
5. Set up monitoring and logging
6. Configure backup strategies

### Environment Variables
- `NODE_ENV`: Environment (development/production)
- `PORT`: Service port
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Note**: This is a basic microservices setup. For production use, consider adding:
- Authentication & Authorization
- API documentation (Swagger/OpenAPI)
- Comprehensive error handling
- Logging and monitoring
- Database migrations
- Unit and integration tests
- CI/CD pipelines

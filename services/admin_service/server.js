import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import routes (to be created)
import adminRoutes from './routes/admin.routes.js';
import userManagementRoutes from './routes/userManagement.routes.js';
import systemConfigRoutes from './routes/systemConfig.routes.js';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'https://amazing-dasik-33dcc8.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:5000',
  'http://localhost:5001',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8080',
  'https://your-production-domain.com',
  'https://sparkle-hr.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Admin Service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    service: 'Admin Service',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      admin: '/api/admin/*',
      user_management: '/api/user-management/*',
      system_config: '/api/system-config/*'
    },
    description: 'Admin service for system administration and user management'
  });
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/user-management', userManagementRoutes);
app.use('/api/system-config', systemConfigRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist in Admin Service`,
    available_routes: {
      health: '/health',
      admin: '/api/admin/*',
      user_management: '/api/user-management/*',
      system_config: '/api/system-config/*'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Admin Service Error:', err);
  res.status(500).json({
    error: 'Internal Admin Service Error',
    message: 'Something went wrong in the Admin Service'
  });
});

const PORT = process.env.ADMIN_SERVICE_PORT || 5001;

app.listen(PORT, () => {
  console.log(`⚙️  Admin Service running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
});

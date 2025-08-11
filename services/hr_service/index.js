import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// import dotenv from 'dotenv';

import employeeRoutes from './routes/employee.routes.js';
import departmentRoutes from './routes/department.routes.js';
import designationRoutes from './routes/designation.routes.js';
import shiftRoutes from './routes/shift.routes.js';
import employeeShiftRoutes from './routes/employeeShift.routes.js';
import leaveRoutes from './routes/leave.routes.js';
import leaveTypeRoutes from './routes/leaveType.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import loanAdvanceRoutes from './routes/loanAdvance.routes.js';
import loanTypeRoutes from './routes/loanType.routes.js';
import userRoleRoutes from './routes/userRole.routes.js';
import additionTypeRoutes from './routes/additionType.routes.js';
import deductionTypeRoutes from './routes/deductionType.routes.js';

// Suppress dotenv logging completely
// process.env.DOTENV_CONFIG_DEBUG = 'false';
// dotenv.config({ debug: false, override: true });

const app = express();

// CORS configuration
const allowedOrigins = [
  'https://amazing-dasik-33dcc8.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:5000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8080',
  'https://your-production-domain.com',
  'https://sparkle-hr.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // For development, allow all localhost origins
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
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(bodyParser.json());

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/designations', designationRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/employee-shifts', employeeShiftRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/leave-types', leaveTypeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/loans-advances', loanAdvanceRoutes);
app.use('/api/loan-types', loanTypeRoutes);
app.use('/api/user-roles', userRoleRoutes);
app.use('/api/addition-types', additionTypeRoutes);
app.use('/api/deduction-types', deductionTypeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import express from 'express';
import { 
  getAllLeaves, 
  getLeaveById, 
  createLeave, 
  updateLeave, 
  deleteLeave,
  getLeavesByEmployee,
  updateLeaveStatus
} from '../controllers/leave.controller.js';

const router = express.Router();

// Basic CRUD operations
router.get('/', getAllLeaves);
router.get('/:id', getLeaveById);
router.post('/', createLeave);
router.put('/:id', updateLeave);
router.delete('/:id', deleteLeave);

// Additional endpoints
router.get('/employee/:employeeId', getLeavesByEmployee);
router.put('/status/:id', updateLeaveStatus);

export default router; 
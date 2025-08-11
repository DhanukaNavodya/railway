import express from 'express';
import { 
  getAllLeaveTypes, 
  getLeaveTypeById, 
  createLeaveType, 
  updateLeaveType, 
  deleteLeaveType,
  changeLeaveTypeStatus,
  getActiveLeaveTypes,
  getLeaveTypesByCompany,
  getLeaveTypesWithEmployeeCounts,
  getEmployeeLeaveSummary,
  getDepartmentLeaveSummary
} from '../controllers/leaveType.controller.js';

const router = express.Router();

// Leave Types routes
router.get('/', getAllLeaveTypes);
router.get('/active', getActiveLeaveTypes);
router.get('/company/:companyId', getLeaveTypesByCompany);
router.get('/summary/employee-counts', getLeaveTypesWithEmployeeCounts);
router.get('/summary/employee/:employeeId', getEmployeeLeaveSummary);
router.get('/summary/department', getDepartmentLeaveSummary);
router.get('/:id', getLeaveTypeById);
router.post('/', createLeaveType);
router.put('/:id', updateLeaveType);
router.delete('/:id', deleteLeaveType);
router.put('/status/:id', changeLeaveTypeStatus);

export default router; 
import express from 'express';
import {
  getAllEmployeeShifts,
  getEmployeeShiftById,
  getEmployeeShiftsByEmployeeId,
  createEmployeeShift,
  updateEmployeeShift,
  deleteEmployeeShift
} from '../controllers/employeeShift.controller.js';

const router = express.Router();

router.get('/', getAllEmployeeShifts);
router.get('/employee/:employeeId', getEmployeeShiftsByEmployeeId);
router.get('/:id', getEmployeeShiftById);
router.post('/', createEmployeeShift);
router.put('/:id', updateEmployeeShift);
router.delete('/:id', deleteEmployeeShift);

export default router; 
import express from 'express';
import {
  getAllShifts,
  getShiftById,
  createShift,
  updateShift,
  deleteShift,
  getShiftsByCompany,
  searchShiftsByName
} from '../controllers/shift.controller.js';

const router = express.Router();

// Basic CRUD operations
router.get('/', getAllShifts);
router.get('/search', searchShiftsByName); // Must come before /:id route
router.get('/company/:companyId', getShiftsByCompany);
router.get('/:id', getShiftById);
router.post('/', createShift);
router.put('/:id', updateShift);
router.delete('/:id', deleteShift);

export default router; 
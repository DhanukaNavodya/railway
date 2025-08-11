import express from 'express';
import {
  getAllDeductionTypes,
  getDeductionTypeById,
  getActiveDeductionTypes,
  getDeductionTypesByCompany,
  createDeductionType,
  updateDeductionType,
  deleteDeductionType,
  hardDeleteDeductionType,
  toggleDeductionTypeStatus,
  searchDeductionTypes
} from '../controllers/deductionType.controller.js';

const router = express.Router();

// GET routes
router.get('/', getAllDeductionTypes);                    // Get all deduction types
router.get('/active', getActiveDeductionTypes);           // Get only active deduction types
router.get('/search', searchDeductionTypes);              // Search deduction types
router.get('/company/:companyId', getDeductionTypesByCompany); // Get by company
router.get('/:id', getDeductionTypeById);                 // Get deduction type by ID

// POST routes
router.post('/', createDeductionType);                    // Create new deduction type

// PUT routes
router.put('/:id', updateDeductionType);                  // Update deduction type
router.put('/:id/toggle-status', toggleDeductionTypeStatus); // Toggle active/inactive status

// DELETE routes
router.delete('/:id', deleteDeductionType);               // Soft delete (deactivate)
router.delete('/:id/hard', hardDeleteDeductionType);      // Hard delete (permanent)

export default router;

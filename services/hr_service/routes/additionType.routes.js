import express from 'express';
import {
  getAllAdditionTypes,
  getAdditionTypeById,
  getActiveAdditionTypes,
  getAdditionTypesByCompany,
  createAdditionType,
  updateAdditionType,
  deleteAdditionType,
  hardDeleteAdditionType,
  toggleAdditionTypeStatus,
  searchAdditionTypes
} from '../controllers/additionType.controller.js';

const router = express.Router();

// GET routes
router.get('/', getAllAdditionTypes);                    // Get all addition types
router.get('/active', getActiveAdditionTypes);           // Get only active addition types
router.get('/search', searchAdditionTypes);              // Search addition types
router.get('/company/:companyId', getAdditionTypesByCompany); // Get by company
router.get('/:id', getAdditionTypeById);                 // Get addition type by ID

// POST routes
router.post('/', createAdditionType);                    // Create new addition type

// PUT routes
router.put('/:id', updateAdditionType);                  // Update addition type
router.put('/:id/toggle-status', toggleAdditionTypeStatus); // Toggle active/inactive status

// DELETE routes
router.delete('/:id', deleteAdditionType);               // Soft delete (deactivate)
router.delete('/:id/hard', hardDeleteAdditionType);      // Hard delete (permanent)

export default router;

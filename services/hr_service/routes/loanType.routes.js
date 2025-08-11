import express from 'express';
import { 
  getAllLoanTypes, 
  getLoanTypeById, 
  createLoanType, 
  updateLoanType, 
  deleteLoanType,
  getActiveLoanTypes,
  getLoanTypesByCompany,
  toggleLoanTypeStatus,
  getLoanTypeByName
} from '../controllers/loanType.controller.js';

const router = express.Router();

// Basic CRUD operations
router.get('/', getAllLoanTypes);
router.get('/:id', getLoanTypeById);
router.post('/', createLoanType);
router.put('/:id', updateLoanType);
router.delete('/:id', deleteLoanType);

// Specialized endpoints
router.get('/active/all', getActiveLoanTypes);
router.get('/company/:companyId', getLoanTypesByCompany);
router.put('/:id/toggle-status', toggleLoanTypeStatus);
router.get('/name/:loanTypeName', getLoanTypeByName);

export default router; 
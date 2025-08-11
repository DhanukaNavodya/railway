import express from 'express';
import { 
  getAllLoansAdvances, 
  getLoanAdvanceById, 
  createLoanAdvance, 
  updateLoanAdvance, 
  deleteLoanAdvance,
  updateDeductions,
  getLoansAdvancesByEmployee,
  getLoansAdvancesByType,
  getActiveLoansAdvances,
  getLoansAdvancesByCompany
} from '../controllers/loanAdvance.controller.js';

const router = express.Router();

// Basic CRUD operations
router.get('/', getAllLoansAdvances);
router.get('/:id', getLoanAdvanceById);
router.post('/', createLoanAdvance);
router.put('/:id', updateLoanAdvance);
router.delete('/:id', deleteLoanAdvance);

// Specialized endpoints
router.put('/:id/deductions', updateDeductions);
router.get('/employee/:employeeId', getLoansAdvancesByEmployee);
router.get('/type/:type', getLoansAdvancesByType);
router.get('/active/all', getActiveLoansAdvances);
router.get('/company/:companyId', getLoansAdvancesByCompany);

export default router; 
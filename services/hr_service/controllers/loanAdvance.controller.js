import { 
  getAllLoansAdvancesService, 
  getLoanAdvanceByIdService, 
  createLoanAdvanceService,
  updateLoanAdvanceService,
  deleteLoanAdvanceService,
  updateDeductionsService,
  getLoansAdvancesByEmployeeService,
  getLoansAdvancesByTypeService,
  getActiveLoansAdvancesService,
  getLoansAdvancesByCompanyService
} from '../services/loanAdvance.service.js';

export const getAllLoansAdvances = async (req, res) => {
  try {
    const loansAdvances = await getAllLoansAdvancesService();
    res.json(loansAdvances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLoanAdvanceById = async (req, res) => {
  try {
    const loanAdvance = await getLoanAdvanceByIdService(req.params.id);
    if (!loanAdvance) {
      return res.status(404).json({ message: 'Loan/Advance not found' });
    }
    res.json(loanAdvance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createLoanAdvance = async (req, res) => {
  try {
    const result = await createLoanAdvanceService(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLoanAdvance = async (req, res) => {
  try {
    const result = await updateLoanAdvanceService(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Loan/Advance not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteLoanAdvance = async (req, res) => {
  try {
    const result = await deleteLoanAdvanceService(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Loan/Advance not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDeductions = async (req, res) => {
  try {
    const { deductionAmount } = req.body;
    if (!deductionAmount || deductionAmount <= 0) {
      return res.status(400).json({ message: 'Valid deduction amount is required' });
    }
    
    const result = await updateDeductionsService(req.params.id, deductionAmount);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLoansAdvancesByEmployee = async (req, res) => {
  try {
    const loansAdvances = await getLoansAdvancesByEmployeeService(req.params.employeeId);
    res.json(loansAdvances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLoansAdvancesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const loansAdvances = await getLoansAdvancesByTypeService(type);
    res.json(loansAdvances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getActiveLoansAdvances = async (req, res) => {
  try {
    const activeLoansAdvances = await getActiveLoansAdvancesService();
    res.json(activeLoansAdvances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLoansAdvancesByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const loansAdvances = await getLoansAdvancesByCompanyService(companyId);
    res.json(loansAdvances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 
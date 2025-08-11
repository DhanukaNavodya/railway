import { 
  getAllLoanTypesService, 
  getLoanTypeByIdService, 
  createLoanTypeService,
  updateLoanTypeService,
  deleteLoanTypeService,
  getActiveLoanTypesService,
  getLoanTypesByCompanyService,
  toggleLoanTypeStatusService,
  getLoanTypeByNameService
} from '../services/loanType.service.js';

export const getAllLoanTypes = async (req, res) => {
  try {
    const loanTypes = await getAllLoanTypesService();
    res.json(loanTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLoanTypeById = async (req, res) => {
  try {
    const loanType = await getLoanTypeByIdService(req.params.id);
    if (!loanType) {
      return res.status(404).json({ message: 'Loan type not found' });
    }
    res.json(loanType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createLoanType = async (req, res) => {
  try {
    const result = await createLoanTypeService(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLoanType = async (req, res) => {
  try {
    const result = await updateLoanTypeService(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Loan type not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteLoanType = async (req, res) => {
  try {
    const result = await deleteLoanTypeService(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Loan type not found' });
    }
    res.json(result);
  } catch (err) {
    if (err.message.includes('Cannot delete loan type')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getActiveLoanTypes = async (req, res) => {
  try {
    const activeLoanTypes = await getActiveLoanTypesService();
    res.json(activeLoanTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLoanTypesByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const loanTypes = await getLoanTypesByCompanyService(companyId);
    res.json(loanTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleLoanTypeStatus = async (req, res) => {
  try {
    const result = await toggleLoanTypeStatusService(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getLoanTypeByName = async (req, res) => {
  try {
    const { loanTypeName } = req.params;
    const { companyId } = req.query;
    
    const loanType = await getLoanTypeByNameService(loanTypeName, companyId);
    if (!loanType) {
      return res.status(404).json({ message: 'Loan type not found' });
    }
    res.json(loanType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 
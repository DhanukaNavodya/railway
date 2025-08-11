import {
  getAllDeductionTypesService,
  getDeductionTypeByIdService,
  getActiveDeductionTypesService,
  getDeductionTypesByCompanyService,
  createDeductionTypeService,
  updateDeductionTypeService,
  deleteDeductionTypeService,
  hardDeleteDeductionTypeService,
  toggleDeductionTypeStatusService,
  searchDeductionTypesService
} from '../services/deductionType.service.js';

// Get all deduction types
export const getAllDeductionTypes = async (req, res) => {
  try {
    const deductionTypes = await getAllDeductionTypesService();
    res.json(deductionTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get deduction type by ID
export const getDeductionTypeById = async (req, res) => {
  try {
    const deductionType = await getDeductionTypeByIdService(req.params.id);
    if (!deductionType) {
      return res.status(404).json({ message: 'Deduction type not found' });
    }
    res.json(deductionType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get active deduction types only
export const getActiveDeductionTypes = async (req, res) => {
  try {
    const deductionTypes = await getActiveDeductionTypesService();
    res.json(deductionTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get deduction types by company
export const getDeductionTypesByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const deductionTypes = await getDeductionTypesByCompanyService(companyId);
    res.json(deductionTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new deduction type
export const createDeductionType = async (req, res) => {
  try {
    const result = await createDeductionTypeService(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err.message.includes('already exists')) {
      return res.status(409).json({ error: err.message });
    }
    if (err.message.includes('required')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// Update deduction type
export const updateDeductionType = async (req, res) => {
  try {
    const result = await updateDeductionTypeService(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Deduction type not found' });
    }
    res.json(result);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes('already exists')) {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// Delete deduction type (soft delete)
export const deleteDeductionType = async (req, res) => {
  try {
    const result = await deleteDeductionTypeService(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// Hard delete deduction type (permanent deletion)
export const hardDeleteDeductionType = async (req, res) => {
  try {
    const result = await hardDeleteDeductionTypeService(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Deduction type not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle deduction type status
export const toggleDeductionTypeStatus = async (req, res) => {
  try {
    const result = await toggleDeductionTypeStatusService(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// Search deduction types
export const searchDeductionTypes = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query parameter "q" is required' });
    }
    const deductionTypes = await searchDeductionTypesService(q);
    res.json(deductionTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

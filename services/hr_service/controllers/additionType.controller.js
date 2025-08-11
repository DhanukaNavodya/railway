import {
  getAllAdditionTypesService,
  getAdditionTypeByIdService,
  getActiveAdditionTypesService,
  getAdditionTypesByCompanyService,
  createAdditionTypeService,
  updateAdditionTypeService,
  deleteAdditionTypeService,
  hardDeleteAdditionTypeService,
  toggleAdditionTypeStatusService,
  searchAdditionTypesService
} from '../services/additionType.service.js';

// Get all addition types
export const getAllAdditionTypes = async (req, res) => {
  try {
    const additionTypes = await getAllAdditionTypesService();
    res.json(additionTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get addition type by ID
export const getAdditionTypeById = async (req, res) => {
  try {
    const additionType = await getAdditionTypeByIdService(req.params.id);
    if (!additionType) {
      return res.status(404).json({ message: 'Addition type not found' });
    }
    res.json(additionType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get active addition types only
export const getActiveAdditionTypes = async (req, res) => {
  try {
    const additionTypes = await getActiveAdditionTypesService();
    res.json(additionTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get addition types by company
export const getAdditionTypesByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const additionTypes = await getAdditionTypesByCompanyService(companyId);
    res.json(additionTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new addition type
export const createAdditionType = async (req, res) => {
  try {
    const result = await createAdditionTypeService(req.body);
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

// Update addition type
export const updateAdditionType = async (req, res) => {
  try {
    const result = await updateAdditionTypeService(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Addition type not found' });
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

// Delete addition type (soft delete)
export const deleteAdditionType = async (req, res) => {
  try {
    const result = await deleteAdditionTypeService(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// Hard delete addition type (permanent deletion)
export const hardDeleteAdditionType = async (req, res) => {
  try {
    const result = await hardDeleteAdditionTypeService(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Addition type not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle addition type status
export const toggleAdditionTypeStatus = async (req, res) => {
  try {
    const result = await toggleAdditionTypeStatusService(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// Search addition types
export const searchAdditionTypes = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query parameter "q" is required' });
    }
    const additionTypes = await searchAdditionTypesService(q);
    res.json(additionTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

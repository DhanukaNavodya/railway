import {
  getAllDesignationsService,
  getDesignationByIdService,
  createDesignationService,
  updateDesignationService,
  deleteDesignationService
} from '../services/designation.service.js';

export const getAllDesignations = async (req, res) => {
  try {
    const designations = await getAllDesignationsService();
    res.json(designations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDesignationById = async (req, res) => {
  try {
    const designation = await getDesignationByIdService(req.params.id);
    if (!designation) {
      return res.status(404).json({ message: 'Designation not found' });
    }
    res.json(designation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDesignation = async (req, res) => {
  try {
    const result = await createDesignationService(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDesignation = async (req, res) => {
  try {
    const result = await updateDesignationService(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Designation not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDesignation = async (req, res) => {
  try {
    const result = await deleteDesignationService(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Designation not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 
import {
  getAllShiftsService,
  getShiftByIdService,
  createShiftService,
  updateShiftService,
  deleteShiftService,
  getShiftsByCompanyService,
  searchShiftsByNameService
} from '../services/shift.service.js';

export const getAllShifts = async (req, res) => {
  try {
    const shifts = await getAllShiftsService();
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getShiftById = async (req, res) => {
  try {
    const shift = await getShiftByIdService(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    res.json(shift);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createShift = async (req, res) => {
  try {
    const result = await createShiftService(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateShift = async (req, res) => {
  try {
    const result = await updateShiftService(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteShift = async (req, res) => {
  try {
    const result = await deleteShiftService(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get shifts by company
export const getShiftsByCompany = async (req, res) => {
  try {
    const shifts = await getShiftsByCompanyService(req.params.companyId);
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search shifts by name
export const searchShiftsByName = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ message: 'Search term is required' });
    }
    const shifts = await searchShiftsByNameService(search);
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 
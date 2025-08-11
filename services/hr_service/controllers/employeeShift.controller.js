import {
  getAllEmployeeShiftsService,
  getEmployeeShiftByIdService,
  getEmployeeShiftsByEmployeeIdService,
  createEmployeeShiftService,
  updateEmployeeShiftService,
  deleteEmployeeShiftService
} from '../services/employeeShift.service.js';

export const getAllEmployeeShifts = async (req, res) => {
  try {
    const employeeShifts = await getAllEmployeeShiftsService();
    res.json(employeeShifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEmployeeShiftById = async (req, res) => {
  try {
    const employeeShift = await getEmployeeShiftByIdService(req.params.id);
    if (!employeeShift) {
      return res.status(404).json({ message: 'Employee shift assignment not found' });
    }
    res.json(employeeShift);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEmployeeShiftsByEmployeeId = async (req, res) => {
  try {
    const employeeShifts = await getEmployeeShiftsByEmployeeIdService(req.params.employeeId);
    res.json(employeeShifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createEmployeeShift = async (req, res) => {
  try {
    const result = await createEmployeeShiftService(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEmployeeShift = async (req, res) => {
  try {
    const result = await updateEmployeeShiftService(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee shift assignment not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEmployeeShift = async (req, res) => {
  try {
    const result = await deleteEmployeeShiftService(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee shift assignment not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 
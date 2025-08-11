import {
  getAllDepartmentsService,
  getDepartmentByIdService,
  createDepartmentService,
  updateDepartmentService,
  deleteDepartmentService
} from '../services/department.service.js';

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await getAllDepartmentsService();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const department = await getDepartmentByIdService(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const result = await createDepartmentService(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const result = await updateDepartmentService(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const result = await deleteDepartmentService(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 
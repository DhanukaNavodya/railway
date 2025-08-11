import { 
  getAllLeavesService, 
  getLeaveByIdService, 
  createLeaveService,
  updateLeaveService,
  deleteLeaveService,
  getLeavesByEmployeeService,
  updateLeaveStatusService
} from '../services/leave.service.js';

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await getAllLeavesService();
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLeaveById = async (req, res) => {
  try {
    const leave = await getLeaveByIdService(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.json(leave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createLeave = async (req, res) => {
  try {
    const result = await createLeaveService(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLeave = async (req, res) => {
  try {
    const result = await updateLeaveService(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteLeave = async (req, res) => {
  try {
    const result = await deleteLeaveService(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get leaves by employee ID
export const getLeavesByEmployee = async (req, res) => {
  try {
    const leaves = await getLeavesByEmployeeService(req.params.employeeId);
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update leave status only
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Pending, Approved, or Rejected' });
    }
    
    const result = await updateLeaveStatusService(req.params.id, status);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 
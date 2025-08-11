import { 
  getAllLeaveTypesService, 
  getLeaveTypeByIdService, 
  createLeaveTypeService,
  updateLeaveTypeService,
  deleteLeaveTypeService,
  changeLeaveTypeStatusService,
  getActiveLeaveTypesService,
  getLeaveTypesByCompanyService,
  getLeaveTypesWithEmployeeCountsService,
  getEmployeeLeaveSummaryService,
  getDepartmentLeaveSummaryService
} from '../services/leaveType.service.js';

// Get all leave types
export const getAllLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await getAllLeaveTypesService();
    res.json(leaveTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get leave type by ID
export const getLeaveTypeById = async (req, res) => {
  try {
    const leaveType = await getLeaveTypeByIdService(req.params.id);
    if (!leaveType) {
      return res.status(404).json({ message: 'Leave type not found' });
    }
    res.json(leaveType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new leave type
export const createLeaveType = async (req, res) => {
  try {
    const result = await createLeaveTypeService(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Leave type name already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

// Update leave type
export const updateLeaveType = async (req, res) => {
  try {
    const result = await updateLeaveTypeService(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Leave type not found' });
    }
    res.json(result);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Leave type name already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

// Delete leave type
export const deleteLeaveType = async (req, res) => {
  try {
    const result = await deleteLeaveTypeService(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Leave type not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Change leave type status
export const changeLeaveTypeStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const result = await changeLeaveTypeStatusService(req.params.id, isActive);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get active leave types only
export const getActiveLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await getActiveLeaveTypesService();
    res.json(leaveTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get leave types by company
export const getLeaveTypesByCompany = async (req, res) => {
  try {
    const leaveTypes = await getLeaveTypesByCompanyService(req.params.companyId);
    res.json(leaveTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all leave types with employee leave counts and details
export const getLeaveTypesWithEmployeeCounts = async (req, res) => {
  try {
    const companyId = req.query.companyId || null;
    const result = await getLeaveTypesWithEmployeeCountsService(companyId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get employee leave summary by employee ID
export const getEmployeeLeaveSummary = async (req, res) => {
  try {
    const result = await getEmployeeLeaveSummaryService(req.params.employeeId);
    res.json(result);
  } catch (err) {
    if (err.message === 'Employee not found') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(500).json({ error: err.message });
  }
};

// Get department-wise leave summary
export const getDepartmentLeaveSummary = async (req, res) => {
  try {
    const companyId = req.query.companyId || null;
    const result = await getDepartmentLeaveSummaryService(companyId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 
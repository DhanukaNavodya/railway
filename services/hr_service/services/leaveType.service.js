import db from '../config/db.js';

// Get all leave types
export const getAllLeaveTypesService = async () => {
  const [leaveTypes] = await db.query(`
    SELECT * FROM hr_leave_type 
    ORDER BY created_at DESC
  `);
  return leaveTypes;
};

// Get leave type by ID
export const getLeaveTypeByIdService = async (id) => {
  const [leaveTypes] = await db.query(`
    SELECT * FROM hr_leave_type WHERE id = ?
  `, [id]);
  
  if (leaveTypes.length === 0) return null;
  return leaveTypes[0];
};

// Create new leave type
export const createLeaveTypeService = async (leaveTypeData) => {
  const {
    leave_type_name,
    days_allowed,
    payment_type,
    carry_forward,
    carry_forward_days = 0,
    companyId,
    is_active = 1
  } = leaveTypeData;

  const [result] = await db.query(`
    INSERT INTO hr_leave_type (
      leave_type_name, 
      days_allowed, 
      payment_type, 
      carry_forward, 
      carry_forward_days, 
      companyId, 
      is_active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [leave_type_name, days_allowed, payment_type, carry_forward, carry_forward_days, companyId, is_active]);

  return { 
    id: result.insertId, 
    message: 'Leave type created successfully' 
  };
};

// Update leave type
export const updateLeaveTypeService = async (id, leaveTypeData) => {
  const {
    leave_type_name,
    days_allowed,
    payment_type,
    carry_forward,
    carry_forward_days = 0,
    companyId,
    is_active
  } = leaveTypeData;

  const [result] = await db.query(`
    UPDATE hr_leave_type 
    SET leave_type_name = ?, 
        days_allowed = ?, 
        payment_type = ?, 
        carry_forward = ?, 
        carry_forward_days = ?, 
        companyId = ?, 
        is_active = ?
    WHERE id = ?
  `, [leave_type_name, days_allowed, payment_type, carry_forward, carry_forward_days, companyId, is_active, id]);

  if (result.affectedRows === 0) {
    throw new Error('Leave type not found');
  }

  return { 
    message: 'Leave type updated successfully', 
    affectedRows: result.affectedRows 
  };
};

// Delete leave type
export const deleteLeaveTypeService = async (id) => {
  const [result] = await db.query('DELETE FROM hr_leave_type WHERE id = ?', [id]);
  return { 
    message: 'Leave type deleted successfully', 
    affectedRows: result.affectedRows 
  };
};

// Change leave type status
export const changeLeaveTypeStatusService = async (id, isActive) => {
  const [result] = await db.query(`
    UPDATE hr_leave_type SET is_active = ? WHERE id = ?
  `, [isActive, id]);
  return { 
    message: 'Leave type status changed successfully', 
    affectedRows: result.affectedRows 
  };
};

// Get active leave types only
export const getActiveLeaveTypesService = async () => {
  const [leaveTypes] = await db.query(`
    SELECT * FROM hr_leave_type 
    WHERE is_active = 1 
    ORDER BY created_at DESC
  `);
  return leaveTypes;
};

// Get leave types by company
export const getLeaveTypesByCompanyService = async (companyId) => {
  const [leaveTypes] = await db.query(`
    SELECT * FROM hr_leave_type 
    WHERE companyId = ? 
    ORDER BY created_at DESC
  `, [companyId]);
  return leaveTypes;
};

// Get all leave types with employee leave counts and details
export const getLeaveTypesWithEmployeeCountsService = async (companyId = null) => {
  // Get all leave types
  let leaveTypesQuery = `
    SELECT * FROM hr_leave_type 
    WHERE is_active = 1
  `;
  let leaveTypesParams = [];
  
  if (companyId) {
    leaveTypesQuery += ` AND companyId = ?`;
    leaveTypesParams.push(companyId);
  }
  
  leaveTypesQuery += ` ORDER BY created_at DESC`;
  
  const [leaveTypes] = await db.query(leaveTypesQuery, leaveTypesParams);
  
  // Get all employees with their department info and leave counts in a single query
  let employeesQuery = `
    SELECT 
      e.ID as employee_id,
      e.Name as employee_name,
      e.EmployeeID as employee_code,
      d.Name as department_name,
      lt.id as leave_type_id,
      lt.leave_type_name,
      lt.days_allowed,
      lt.payment_type,
      lt.carry_forward,
      lt.carry_forward_days,
      COALESCE(SUM(l.number_of_days), 0) as days_taken
    FROM hr_employee e
    LEFT JOIN hr_department d ON e.department_id = d.id
    CROSS JOIN hr_leave_type lt
    LEFT JOIN hr_leaves l ON e.ID = l.employee_id 
      AND l.leave_type = lt.id 
      AND l.status = 'Approved'
    WHERE e.Status = 'Active' AND lt.is_active = 1
  `;
  
  if (companyId) {
    employeesQuery += ` AND e.companyId = ?`;
  }
  
  employeesQuery += `
    GROUP BY e.ID, e.Name, e.EmployeeID, d.Name, lt.id, lt.leave_type_name, lt.days_allowed, lt.payment_type, lt.carry_forward, lt.carry_forward_days
    ORDER BY e.Name, lt.leave_type_name
  `;
  
  const [employeeLeaveData] = await db.query(employeesQuery, companyId ? [companyId] : []);
  
  // Group the data by employee
  const employeeLeaveSummary = {};
  
  for (const row of employeeLeaveData) {
    if (!employeeLeaveSummary[row.employee_id]) {
      employeeLeaveSummary[row.employee_id] = {
        employee_id: row.employee_id,
        employee_name: row.employee_name,
        employee_code: row.employee_code,
        department_name: row.department_name,
        leave_types: []
      };
    }
    
    employeeLeaveSummary[row.employee_id].leave_types.push({
      leave_type_id: row.leave_type_id,
      leave_type_name: row.leave_type_name,
      days_allowed: row.days_allowed,
      days_taken: row.days_taken,
      days_remaining: row.days_allowed - row.days_taken,
      payment_type: row.payment_type,
      carry_forward: row.carry_forward,
      carry_forward_days: row.carry_forward_days
    });
  }
  
  return {
    leave_types: leaveTypes,
    employee_summary: Object.values(employeeLeaveSummary),
    total_employees: Object.keys(employeeLeaveSummary).length,
    total_leave_types: leaveTypes.length
  };
};

// Get employee leave summary by employee ID
export const getEmployeeLeaveSummaryService = async (employeeId) => {
  // Get employee details and leave summary in a single query
  const [employeeLeaveData] = await db.query(`
    SELECT 
      e.ID as employee_id,
      e.Name as employee_name,
      e.EmployeeID as employee_code,
      d.Name as department_name,
      lt.id as leave_type_id,
      lt.leave_type_name,
      lt.days_allowed,
      lt.payment_type,
      lt.carry_forward,
      lt.carry_forward_days,
      COALESCE(SUM(l.number_of_days), 0) as days_taken
    FROM hr_employee e
    LEFT JOIN hr_department d ON e.department_id = d.id
    CROSS JOIN hr_leave_type lt
    LEFT JOIN hr_leaves l ON e.ID = l.employee_id 
      AND l.leave_type = lt.id 
      AND l.status = 'Approved'
    WHERE e.ID = ? AND lt.is_active = 1
    GROUP BY e.ID, e.Name, e.EmployeeID, d.Name, lt.id, lt.leave_type_name, lt.days_allowed, lt.payment_type, lt.carry_forward, lt.carry_forward_days
    ORDER BY lt.leave_type_name
  `, [employeeId]);
  
  if (employeeLeaveData.length === 0) {
    throw new Error('Employee not found');
  }
  
  // Extract employee info from first row
  const employee = {
    employee_id: employeeLeaveData[0].employee_id,
    employee_name: employeeLeaveData[0].employee_name,
    employee_code: employeeLeaveData[0].employee_code,
    department_name: employeeLeaveData[0].department_name
  };
  
  // Build leave summary
  const leaveSummary = employeeLeaveData.map(row => ({
    leave_type_id: row.leave_type_id,
    leave_type_name: row.leave_type_name,
    days_allowed: row.days_allowed,
    days_taken: row.days_taken,
    days_remaining: row.days_allowed - row.days_taken,
    payment_type: row.payment_type,
    carry_forward: row.carry_forward,
    carry_forward_days: row.carry_forward_days
  }));
  
  return {
    employee: employee,
    leave_summary: leaveSummary
  };
};

// Get department-wise leave summary
export const getDepartmentLeaveSummaryService = async (companyId = null) => {
  let query = `
    SELECT 
      d.id as department_id,
      d.Name as department_name,
      COUNT(e.ID) as total_employees,
      lt.leave_type_name,
      lt.days_allowed,
      COALESCE(SUM(l.number_of_days), 0) as total_days_taken
    FROM hr_department d
    LEFT JOIN hr_employee e ON d.id = e.department_id AND e.Status = 'Active'
    CROSS JOIN hr_leave_type lt
    LEFT JOIN hr_leaves l ON e.ID = l.employee_id 
      AND l.leave_type = lt.id 
      AND l.status = 'Approved'
    WHERE lt.is_active = 1
  `;
  
  let params = [];
  
  if (companyId) {
    query += ` AND (e.companyId = ? OR e.companyId IS NULL)`;
    params.push(companyId);
  }
  
  query += `
    GROUP BY d.id, d.Name, lt.leave_type_name, lt.days_allowed
    ORDER BY d.Name, lt.leave_type_name
  `;
  
  const [results] = await db.query(query, params);
  
  // Group by department
  const departmentSummary = {};
  
  for (const row of results) {
    if (!departmentSummary[row.department_id]) {
      departmentSummary[row.department_id] = {
        department_id: row.department_id,
        department_name: row.department_name,
        total_employees: row.total_employees,
        leave_types: []
      };
    }
    
    departmentSummary[row.department_id].leave_types.push({
      leave_type_name: row.leave_type_name,
      days_allowed: row.days_allowed,
      total_days_taken: row.total_days_taken,
      average_days_per_employee: row.total_employees > 0 ? (row.total_days_taken / row.total_employees).toFixed(2) : 0
    });
  }
  
  return Object.values(departmentSummary);
}; 
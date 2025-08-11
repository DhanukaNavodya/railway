import db from '../config/db.js';

export const getAllLeavesService = async () => {
  const [rows] = await db.query(`
    SELECT l.*, e.Name as EmployeeName, e.EmployeeID as EmployeeCode
    FROM hr_leaves l 
    LEFT JOIN hr_employee e ON l.employee_id = e.ID
    ORDER BY l.created_at DESC
  `);
  return rows;
};

export const getLeaveByIdService = async (id) => {
  const [rows] = await db.query(`
    SELECT l.*, e.Name as EmployeeName, e.EmployeeID as EmployeeCode
    FROM hr_leaves l 
    LEFT JOIN hr_employee e ON l.employee_id = e.ID 
    WHERE l.id = ?
  `, [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const createLeaveService = async (leaveData) => {
  const {
    employee_id, leave_type, start_date, end_date, number_of_days, 
    reason, companyId, status = 'Pending'
  } = leaveData;
  
  const [result] = await db.query(`
    INSERT INTO hr_leaves (
      employee_id, leave_type, start_date, end_date, number_of_days, 
      reason, companyId, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    employee_id, leave_type, start_date, end_date, number_of_days, 
    reason, companyId, status
  ]);
  
  return { id: result.insertId, message: 'Leave request created successfully' };
};

export const updateLeaveService = async (id, leaveData) => {
  const {
    employee_id, leave_type, start_date, end_date, number_of_days, 
    reason, companyId, status
  } = leaveData;
  
  const [result] = await db.query(`
    UPDATE hr_leaves SET 
      employee_id = ?, leave_type = ?, start_date = ?, end_date = ?, 
      number_of_days = ?, reason = ?, companyId = ?, status = ?
    WHERE id = ?
  `, [
    employee_id, leave_type, start_date, end_date, number_of_days, 
    reason, companyId, status, id
  ]);
  
  return { message: 'Leave request updated successfully', affectedRows: result.affectedRows };
};

export const deleteLeaveService = async (id) => {
  const [result] = await db.query('DELETE FROM hr_leaves WHERE id = ?', [id]);
  return { message: 'Leave request deleted successfully', affectedRows: result.affectedRows };
};

// Get leaves by employee ID
export const getLeavesByEmployeeService = async (employeeId) => {
  const [rows] = await db.query(`
    SELECT l.*, e.Name as EmployeeName, e.EmployeeID as EmployeeCode
    FROM hr_leaves l 
    LEFT JOIN hr_employee e ON l.employee_id = e.ID 
    WHERE l.employee_id = ?
    ORDER BY l.created_at DESC
  `, [employeeId]);
  return rows;
};

// Update leave status only
export const updateLeaveStatusService = async (id, status) => {
  const [result] = await db.query('UPDATE hr_leaves SET status = ? WHERE id = ?', [status, id]);
  return { message: 'Leave status updated successfully', affectedRows: result.affectedRows };
}; 
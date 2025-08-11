import db from '../config/db.js';

export const getAllEmployeeShiftsService = async () => {
  const [rows] = await db.query(`
    SELECT es.*, e.Name as EmployeeName, s.ShiftType, s.StartTime, s.EndTime
    FROM hr_employeeshift es
    LEFT JOIN hr_employee e ON es.employee_id = e.ID
    LEFT JOIN hr_shift s ON es.shift_id = s.id
  `);
  return rows;
};

export const getEmployeeShiftByIdService = async (id) => {
  const [rows] = await db.query(`
    SELECT es.*, e.Name as EmployeeName, s.ShiftType, s.StartTime, s.EndTime
    FROM hr_employeeshift es
    LEFT JOIN hr_employee e ON es.employee_id = e.ID
    LEFT JOIN hr_shift s ON es.shift_id = s.id
    WHERE es.id = ?
  `, [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const getEmployeeShiftsByEmployeeIdService = async (employeeId) => {
  const [rows] = await db.query(`
    SELECT es.*, e.Name as EmployeeName, s.ShiftType, s.StartTime, s.EndTime
    FROM hr_employeeshift es
    LEFT JOIN hr_employee e ON es.employee_id = e.ID
    LEFT JOIN hr_shift s ON es.shift_id = s.id
    WHERE es.employee_id = ?
  `, [employeeId]);
  return rows;
};

export const createEmployeeShiftService = async (employeeShiftData) => {
  const { employee_id, shift_id, assigned_date, companyId } = employeeShiftData;
  const [result] = await db.query(
    'INSERT INTO hr_employeeshift (employee_id, shift_id, assigned_date, companyId) VALUES (?, ?, ?, ?)',
    [employee_id, shift_id, assigned_date, companyId]
  );
  return { id: result.insertId, message: 'Employee shift assigned successfully' };
};

export const updateEmployeeShiftService = async (id, employeeShiftData) => {
  const { employee_id, shift_id, assigned_date, companyId } = employeeShiftData;
  const [result] = await db.query(
    'UPDATE hr_employeeshift SET employee_id = ?, shift_id = ?, assigned_date = ?, companyId = ? WHERE id = ?',
    [employee_id, shift_id, assigned_date, companyId, id]
  );
  return { message: 'Employee shift updated successfully', affectedRows: result.affectedRows };
};

export const deleteEmployeeShiftService = async (id) => {
  const [result] = await db.query('DELETE FROM hr_employeeshift WHERE id = ?', [id]);
  return { message: 'Employee shift assignment deleted successfully', affectedRows: result.affectedRows };
}; 
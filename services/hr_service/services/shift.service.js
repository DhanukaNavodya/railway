import db from '../config/db.js';

export const getAllShiftsService = async () => {
  const [rows] = await db.query('SELECT * FROM hr_shift');
  return rows;
};

export const getShiftByIdService = async (id) => {
  const [rows] = await db.query('SELECT * FROM hr_shift WHERE shift_id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const createShiftService = async (shiftData) => {
  const { start_time, end_time, start_late_time, end_late_time, company_id, shift_name, description } = shiftData;
  const [result] = await db.query(
    'INSERT INTO hr_shift (start_time, end_time, start_late_time, end_late_time, company_id, shift_name, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [start_time, end_time, start_late_time, end_late_time, company_id, shift_name, description]
  );
  return { shift_id: result.insertId, message: 'Shift created successfully' };
};

export const updateShiftService = async (id, shiftData) => {
  const { start_time, end_time, start_late_time, end_late_time, company_id, shift_name, description } = shiftData;
  const [result] = await db.query(
    'UPDATE hr_shift SET start_time = ?, end_time = ?, start_late_time = ?, end_late_time = ?, company_id = ?, shift_name = ?, description = ? WHERE shift_id = ?',
    [start_time, end_time, start_late_time, end_late_time, company_id, shift_name, description, id]
  );
  return { message: 'Shift updated successfully', affectedRows: result.affectedRows };
};

export const deleteShiftService = async (id) => {
  const [result] = await db.query('DELETE FROM hr_shift WHERE shift_id = ?', [id]);
  return { message: 'Shift deleted successfully', affectedRows: result.affectedRows };
};

// Get shifts by company
export const getShiftsByCompanyService = async (companyId) => {
  const [rows] = await db.query('SELECT * FROM hr_shift WHERE company_id = ?', [companyId]);
  return rows;
};

// Search shifts by name
export const searchShiftsByNameService = async (searchTerm) => {
  const [rows] = await db.query('SELECT * FROM hr_shift WHERE shift_name LIKE ?', [`%${searchTerm}%`]);
  return rows;
}; 
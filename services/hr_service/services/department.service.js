import db from '../config/db.js';

export const getAllDepartmentsService = async () => {
  const [rows] = await db.query('SELECT * FROM hr_department');
  return rows;
};

export const getDepartmentByIdService = async (id) => {
  const [rows] = await db.query('SELECT * FROM hr_department WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const createDepartmentService = async (departmentData) => {
  const { companyId, Name, Description } = departmentData;
  const [result] = await db.query(
    'INSERT INTO hr_department (companyId, Name, Description) VALUES (?, ?, ?)',
    [companyId, Name, Description]
  );
  return { id: result.insertId, message: 'Department created successfully' };
};

export const updateDepartmentService = async (id, departmentData) => {
  const { companyId, Name, Description } = departmentData;
  const [result] = await db.query(
    'UPDATE hr_department SET companyId = ?, Name = ?, Description = ? WHERE id = ?',
    [companyId, Name, Description, id]
  );
  return { message: 'Department updated successfully', affectedRows: result.affectedRows };
};

export const deleteDepartmentService = async (id) => {
  const [result] = await db.query('DELETE FROM hr_department WHERE id = ?', [id]);
  return { message: 'Department deleted successfully', affectedRows: result.affectedRows };
}; 
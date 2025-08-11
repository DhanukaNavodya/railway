import db from '../config/db.js';

export const getAllDesignationsService = async () => {
  const [rows] = await db.query('SELECT * FROM hr_designation');
  return rows;
};

export const getDesignationByIdService = async (id) => {
  const [rows] = await db.query('SELECT * FROM hr_designation WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const createDesignationService = async (designationData) => {
  const { DesignationID, companyId, Title, Description } = designationData;
  const [result] = await db.query(
    'INSERT INTO hr_designation (DesignationID, companyId, Title, Description) VALUES (?, ?, ?, ?)',
    [DesignationID, companyId, Title, Description]
  );
  return { id: result.insertId, message: 'Designation created successfully' };
};

export const updateDesignationService = async (id, designationData) => {
  const { DesignationID, companyId, Title, Description } = designationData;
  const [result] = await db.query(
    'UPDATE hr_designation SET DesignationID = ?, companyId = ?, Title = ?, Description = ? WHERE id = ?',
    [DesignationID, companyId, Title, Description, id]
  );
  return { message: 'Designation updated successfully', affectedRows: result.affectedRows };
};

export const deleteDesignationService = async (id) => {
  const [result] = await db.query('DELETE FROM hr_designation WHERE id = ?', [id]);
  return { message: 'Designation deleted successfully', affectedRows: result.affectedRows };
}; 
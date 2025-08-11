import db from '../config/db.js';

// Get all addition types
export const getAllAdditionTypesService = async () => {
  const [rows] = await db.query(`
    SELECT * FROM hr_addition_types 
    ORDER BY created_at DESC
  `);
  return rows;
};

// Get addition type by ID
export const getAdditionTypeByIdService = async (id) => {
  const [rows] = await db.query(`
    SELECT * FROM hr_addition_types WHERE id = ?
  `, [id]);
  return rows.length > 0 ? rows[0] : null;
};

// Get active addition types only
export const getActiveAdditionTypesService = async () => {
  const [rows] = await db.query(`
    SELECT * FROM hr_addition_types 
    WHERE is_active = 1 
    ORDER BY addition_name ASC
  `);
  return rows;
};

// Get addition types by company
export const getAdditionTypesByCompanyService = async (companyId) => {
  const [rows] = await db.query(`
    SELECT * FROM hr_addition_types 
    WHERE companyId = ? OR companyId IS NULL
    ORDER BY addition_name ASC
  `, [companyId]);
  return rows;
};

// Create new addition type
export const createAdditionTypeService = async (additionTypeData) => {
  const { addition_name, description, companyId, is_active } = additionTypeData;
  
  // Validate required fields
  if (!addition_name) {
    throw new Error('Addition name is required');
  }
  
  // Check for duplicate addition_name
  const [existing] = await db.query(
    'SELECT id, addition_name FROM hr_addition_types WHERE addition_name = ?', 
    [addition_name]
  );
  if (existing.length > 0) {
    throw new Error(`Addition type '${addition_name}' already exists`);
  }
  
  const [result] = await db.query(`
    INSERT INTO hr_addition_types (addition_name, description, companyId, is_active)
    VALUES (?, ?, ?, ?)
  `, [
    addition_name,
    description || null,
    companyId || null,
    is_active !== undefined ? is_active : 1
  ]);
  
  return { 
    id: result.insertId, 
    message: 'Addition type created successfully' 
  };
};

// Update addition type
export const updateAdditionTypeService = async (id, additionTypeData) => {
  const { addition_name, description, companyId, is_active } = additionTypeData;
  
  // Check if addition type exists
  const existingAdditionType = await getAdditionTypeByIdService(id);
  if (!existingAdditionType) {
    throw new Error('Addition type not found');
  }
  
  // Check for duplicate addition_name (excluding current record)
  if (addition_name && addition_name !== existingAdditionType.addition_name) {
    const [existing] = await db.query(
      'SELECT id, addition_name FROM hr_addition_types WHERE addition_name = ? AND id != ?', 
      [addition_name, id]
    );
    if (existing.length > 0) {
      throw new Error(`Addition type '${addition_name}' already exists`);
    }
  }
  
  const [result] = await db.query(`
    UPDATE hr_addition_types SET 
      addition_name = ?, 
      description = ?, 
      companyId = ?, 
      is_active = ?
    WHERE id = ?
  `, [
    addition_name || existingAdditionType.addition_name,
    description !== undefined ? description : existingAdditionType.description,
    companyId !== undefined ? companyId : existingAdditionType.companyId,
    is_active !== undefined ? is_active : existingAdditionType.is_active,
    id
  ]);
  
  return { 
    message: 'Addition type updated successfully', 
    affectedRows: result.affectedRows 
  };
};

// Delete addition type (soft delete by setting is_active = 0)
export const deleteAdditionTypeService = async (id) => {
  // Check if addition type exists
  const existingAdditionType = await getAdditionTypeByIdService(id);
  if (!existingAdditionType) {
    throw new Error('Addition type not found');
  }
  
  const [result] = await db.query(`
    UPDATE hr_addition_types SET is_active = 0 WHERE id = ?
  `, [id]);
  
  return { 
    message: 'Addition type deactivated successfully', 
    affectedRows: result.affectedRows 
  };
};

// Hard delete addition type (permanent deletion)
export const hardDeleteAdditionTypeService = async (id) => {
  const [result] = await db.query('DELETE FROM hr_addition_types WHERE id = ?', [id]);
  return { 
    message: 'Addition type deleted permanently', 
    affectedRows: result.affectedRows 
  };
};

// Toggle addition type status
export const toggleAdditionTypeStatusService = async (id) => {
  const existingAdditionType = await getAdditionTypeByIdService(id);
  if (!existingAdditionType) {
    throw new Error('Addition type not found');
  }
  
  const newStatus = existingAdditionType.is_active === 1 ? 0 : 1;
  
  const [result] = await db.query(`
    UPDATE hr_addition_types SET is_active = ? WHERE id = ?
  `, [newStatus, id]);
  
  return { 
    message: `Addition type ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`, 
    affectedRows: result.affectedRows,
    new_status: newStatus
  };
};

// Search addition types by name
export const searchAdditionTypesService = async (searchTerm) => {
  const [rows] = await db.query(`
    SELECT * FROM hr_addition_types 
    WHERE addition_name LIKE ? OR description LIKE ?
    ORDER BY addition_name ASC
  `, [`%${searchTerm}%`, `%${searchTerm}%`]);
  return rows;
};

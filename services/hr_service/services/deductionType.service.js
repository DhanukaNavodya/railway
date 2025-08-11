import db from '../config/db.js';

// Get all deduction types
export const getAllDeductionTypesService = async () => {
  const [rows] = await db.query(`
    SELECT * FROM hr_deduction_types 
    ORDER BY created_at DESC
  `);
  return rows;
};

// Get deduction type by ID
export const getDeductionTypeByIdService = async (id) => {
  const [rows] = await db.query(`
    SELECT * FROM hr_deduction_types WHERE id = ?
  `, [id]);
  return rows.length > 0 ? rows[0] : null;
};

// Get active deduction types only
export const getActiveDeductionTypesService = async () => {
  const [rows] = await db.query(`
    SELECT * FROM hr_deduction_types 
    WHERE is_active = 1 
    ORDER BY deduction_name ASC
  `);
  return rows;
};

// Get deduction types by company
export const getDeductionTypesByCompanyService = async (companyId) => {
  const [rows] = await db.query(`
    SELECT * FROM hr_deduction_types 
    WHERE companyId = ? OR companyId IS NULL
    ORDER BY deduction_name ASC
  `, [companyId]);
  return rows;
};

// Create new deduction type
export const createDeductionTypeService = async (deductionTypeData) => {
  const { deduction_name, description, companyId, is_active } = deductionTypeData;
  
  // Validate required fields
  if (!deduction_name) {
    throw new Error('Deduction name is required');
  }
  
  // Check for duplicate deduction_name
  const [existing] = await db.query(
    'SELECT id, deduction_name FROM hr_deduction_types WHERE deduction_name = ?', 
    [deduction_name]
  );
  if (existing.length > 0) {
    throw new Error(`Deduction type '${deduction_name}' already exists`);
  }
  
  const [result] = await db.query(`
    INSERT INTO hr_deduction_types (deduction_name, description, companyId, is_active)
    VALUES (?, ?, ?, ?)
  `, [
    deduction_name,
    description || null,
    companyId || null,
    is_active !== undefined ? is_active : 1
  ]);
  
  return { 
    id: result.insertId, 
    message: 'Deduction type created successfully' 
  };
};

// Update deduction type
export const updateDeductionTypeService = async (id, deductionTypeData) => {
  const { deduction_name, description, companyId, is_active } = deductionTypeData;
  
  // Check if deduction type exists
  const existingDeductionType = await getDeductionTypeByIdService(id);
  if (!existingDeductionType) {
    throw new Error('Deduction type not found');
  }
  
  // Check for duplicate deduction_name (excluding current record)
  if (deduction_name && deduction_name !== existingDeductionType.deduction_name) {
    const [existing] = await db.query(
      'SELECT id, deduction_name FROM hr_deduction_types WHERE deduction_name = ? AND id != ?', 
      [deduction_name, id]
    );
    if (existing.length > 0) {
      throw new Error(`Deduction type '${deduction_name}' already exists`);
    }
  }
  
  const [result] = await db.query(`
    UPDATE hr_deduction_types SET 
      deduction_name = ?, 
      description = ?, 
      companyId = ?, 
      is_active = ?
    WHERE id = ?
  `, [
    deduction_name || existingDeductionType.deduction_name,
    description !== undefined ? description : existingDeductionType.description,
    companyId !== undefined ? companyId : existingDeductionType.companyId,
    is_active !== undefined ? is_active : existingDeductionType.is_active,
    id
  ]);
  
  return { 
    message: 'Deduction type updated successfully', 
    affectedRows: result.affectedRows 
  };
};

// Delete deduction type (soft delete by setting is_active = 0)
export const deleteDeductionTypeService = async (id) => {
  // Check if deduction type exists
  const existingDeductionType = await getDeductionTypeByIdService(id);
  if (!existingDeductionType) {
    throw new Error('Deduction type not found');
  }
  
  const [result] = await db.query(`
    UPDATE hr_deduction_types SET is_active = 0 WHERE id = ?
  `, [id]);
  
  return { 
    message: 'Deduction type deactivated successfully', 
    affectedRows: result.affectedRows 
  };
};

// Hard delete deduction type (permanent deletion)
export const hardDeleteDeductionTypeService = async (id) => {
  const [result] = await db.query('DELETE FROM hr_deduction_types WHERE id = ?', [id]);
  return { 
    message: 'Deduction type deleted permanently', 
    affectedRows: result.affectedRows 
  };
};

// Toggle deduction type status
export const toggleDeductionTypeStatusService = async (id) => {
  const existingDeductionType = await getDeductionTypeByIdService(id);
  if (!existingDeductionType) {
    throw new Error('Deduction type not found');
  }
  
  const newStatus = existingDeductionType.is_active === 1 ? 0 : 1;
  
  const [result] = await db.query(`
    UPDATE hr_deduction_types SET is_active = ? WHERE id = ?
  `, [newStatus, id]);
  
  return { 
    message: `Deduction type ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`, 
    affectedRows: result.affectedRows,
    new_status: newStatus
  };
};

// Search deduction types by name
export const searchDeductionTypesService = async (searchTerm) => {
  const [rows] = await db.query(`
    SELECT * FROM hr_deduction_types 
    WHERE deduction_name LIKE ? OR description LIKE ?
    ORDER BY deduction_name ASC
  `, [`%${searchTerm}%`, `%${searchTerm}%`]);
  return rows;
};

import db from '../config/db.js';

export const getAllLoanTypesService = async () => {
  const [rows] = await db.query(`
    SELECT * FROM loan_types 
    ORDER BY created_at DESC
  `);
  return rows;
};

export const getLoanTypeByIdService = async (id) => {
  const [rows] = await db.query(`
    SELECT * FROM loan_types 
    WHERE id = ?
  `, [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const createLoanTypeService = async (loanTypeData) => {
  console.log("Loan Type Data", loanTypeData);
  const {
    loan_type,
    interest_rate,
    max_amount,
    max_tenure_months,
    is_active = 1,
    companyId
  } = loanTypeData;
  
  const [result] = await db.query(`
    INSERT INTO loan_types (
      loan_type, interest_rate, max_amount, max_tenure_months, is_active, companyId
    ) VALUES (?, ?, ?, ?, ?, ?)
  `, [
    loan_type, interest_rate, max_amount, max_tenure_months, is_active, companyId
  ]);
  
  return { id: result.insertId, message: 'Loan type created successfully' };
};

export const updateLoanTypeService = async (id, loanTypeData) => {
  const {
    loan_type,
    interest_rate,
    max_amount,
    max_tenure_months,
    is_active,
    companyId
  } = loanTypeData;
  
  const [result] = await db.query(`
    UPDATE loan_types SET 
      loan_type = ?, interest_rate = ?, max_amount = ?, 
      max_tenure_months = ?, is_active = ?, companyId = ?
    WHERE id = ?
  `, [
    loan_type, interest_rate, max_amount, max_tenure_months, is_active, companyId, id
  ]);
  
  return { message: 'Loan type updated successfully', affectedRows: result.affectedRows };
};

export const deleteLoanTypeService = async (id) => {
  // Check if loan type is being used in any loans
  const [existingLoans] = await db.query(
    'SELECT COUNT(*) as count FROM hr_loans WHERE loan_type_id = ?',
    [id]
  );
  
  if (existingLoans[0].count > 0) {
    throw new Error('Cannot delete loan type as it is being used by existing loans');
  }
  
  const [result] = await db.query('DELETE FROM loan_types WHERE id = ?', [id]);
  return { message: 'Loan type deleted successfully', affectedRows: result.affectedRows };
};

export const getActiveLoanTypesService = async () => {
  const [rows] = await db.query(`
    SELECT * FROM loan_types 
    WHERE is_active = 1
    ORDER BY loan_type ASC
  `);
  return rows;
};

export const getLoanTypesByCompanyService = async (companyId) => {
  const [rows] = await db.query(`
    SELECT * FROM loan_types 
    WHERE companyId = ?
    ORDER BY created_at DESC
  `, [companyId]);
  return rows;
};

export const toggleLoanTypeStatusService = async (id) => {
  const [currentType] = await db.query(
    'SELECT is_active FROM loan_types WHERE id = ?',
    [id]
  );
  
  if (currentType.length === 0) {
    throw new Error('Loan type not found');
  }
  
  const newStatus = currentType[0].is_active === 1 ? 0 : 1;
  
  const [result] = await db.query(`
    UPDATE loan_types SET is_active = ? WHERE id = ?
  `, [newStatus, id]);
  
  return { 
    message: `Loan type ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`, 
    affectedRows: result.affectedRows,
    newStatus
  };
};

export const getLoanTypeByNameService = async (loanTypeName, companyId = null) => {
  let query = 'SELECT * FROM loan_types WHERE loan_type = ?';
  let params = [loanTypeName];
  
  if (companyId) {
    query += ' AND companyId = ?';
    params.push(companyId);
  }
  
  const [rows] = await db.query(query, params);
  return rows.length > 0 ? rows[0] : null;
}; 
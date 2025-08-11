import db from '../config/db.js';

export const getAllLoansAdvancesService = async () => {
  const [rows] = await db.query(`
    SELECT la.*, e.Name as EmployeeName, e.EmployeeID as EmployeeCode,
           lt.loan_type, lt.interest_rate, lt.max_amount, lt.max_tenure_months
    FROM hr_loans la 
    LEFT JOIN hr_employee e ON la.employee_id = e.ID
    LEFT JOIN loan_types lt ON la.loan_type_id = lt.id
    ORDER BY la.created_at DESC
  `);
  return rows;
};

export const getLoanAdvanceByIdService = async (id) => {
  const [rows] = await db.query(`
    SELECT la.*, e.Name as EmployeeName, e.EmployeeID as EmployeeCode,
           lt.loan_type, lt.interest_rate, lt.max_amount, lt.max_tenure_months
    FROM hr_loans la 
    LEFT JOIN hr_employee e ON la.employee_id = e.ID 
    LEFT JOIN loan_types lt ON la.loan_type_id = lt.id
    WHERE la.id = ?
  `, [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const getLoansAdvancesByEmployeeService = async (employeeId) => {
  const [rows] = await db.query(`
    SELECT la.*, e.Name as EmployeeName, e.EmployeeID as EmployeeCode,
           lt.loan_type, lt.interest_rate, lt.max_amount, lt.max_tenure_months
    FROM hr_loans la 
    LEFT JOIN hr_employee e ON la.employee_id = e.ID 
    LEFT JOIN loan_types lt ON la.loan_type_id = lt.id
    WHERE la.employee_id = ?
    ORDER BY la.created_at DESC
  `, [employeeId]);
  return rows;
};

export const createLoanAdvanceService = async (loanAdvanceData) => {
  const {
    employee_id,
    loan_type_id,
    granted_amount,
    granted_date,
    period,
    closing_date,
    total_deductions,
    outstanding_balance,
    companyId
  } = loanAdvanceData;
  
  const [result] = await db.query(`
    INSERT INTO hr_loans (
      employee_id, loan_type_id, granted_amount, granted_date, period, 
      closing_date, total_deductions, outstanding_balance, companyId
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    employee_id, loan_type_id, granted_amount, granted_date, period, 
    closing_date, total_deductions, outstanding_balance, companyId
  ]);
  
  return { id: result.insertId, message: 'Loan/Advance created successfully' };
};

export const updateLoanAdvanceService = async (id, loanAdvanceData) => {
  const {
    employee_id,
    loan_type_id,
    granted_amount,
    granted_date,
    period,
    closing_date,
    total_deductions,
    outstanding_balance,
    companyId
  } = loanAdvanceData;
  
  const [result] = await db.query(`
    UPDATE hr_loans SET 
      employee_id = ?, loan_type_id = ?, granted_amount = ?, granted_date = ?, 
      period = ?, closing_date = ?, total_deductions = ?, 
      outstanding_balance = ?, companyId = ?
    WHERE id = ?
  `, [
    employee_id, loan_type_id, granted_amount, granted_date, period, 
    closing_date, total_deductions, outstanding_balance, companyId, id
  ]);
  
  return { message: 'Loan/Advance updated successfully', affectedRows: result.affectedRows };
};

export const deleteLoanAdvanceService = async (id) => {
  const [result] = await db.query('DELETE FROM hr_loans WHERE id = ?', [id]);
  return { message: 'Loan/Advance deleted successfully', affectedRows: result.affectedRows };
};

export const updateDeductionsService = async (id, deductionAmount) => {
  // Get current loan/advance details
  const [currentLoan] = await db.query(
    'SELECT total_deductions, outstanding_balance FROM hr_loans WHERE id = ?',
    [id]
  );
  
  if (currentLoan.length === 0) {
    throw new Error('Loan/Advance not found');
  }
  
  const newTotalDeductions = (currentLoan[0].total_deductions || 0) + parseFloat(deductionAmount);
  const newOutstandingBalance = Math.max(0, (currentLoan[0].outstanding_balance || 0) - parseFloat(deductionAmount));
  
  const [result] = await db.query(`
    UPDATE hr_loans SET 
      total_deductions = ?, outstanding_balance = ?
    WHERE id = ?
  `, [newTotalDeductions, newOutstandingBalance, id]);
  
  return { 
    message: 'Deductions updated successfully', 
    affectedRows: result.affectedRows,
    newTotalDeductions,
    newOutstandingBalance
  };
};

export const getLoansAdvancesByTypeService = async (loanTypeId) => {
  const [rows] = await db.query(`
    SELECT la.*, e.Name as EmployeeName, e.EmployeeID as EmployeeCode,
           lt.loan_type, lt.interest_rate, lt.max_amount, lt.max_tenure_months
    FROM hr_loans la 
    LEFT JOIN hr_employee e ON la.employee_id = e.ID 
    LEFT JOIN loan_types lt ON la.loan_type_id = lt.id
    WHERE la.loan_type_id = ?
    ORDER BY la.created_at DESC
  `, [loanTypeId]);
  return rows;
};

export const getActiveLoansAdvancesService = async () => {
  const [rows] = await db.query(`
    SELECT la.*, e.Name as EmployeeName, e.EmployeeID as EmployeeCode,
           lt.loan_type, lt.interest_rate, lt.max_amount, lt.max_tenure_months
    FROM hr_loans la 
    LEFT JOIN hr_employee e ON la.employee_id = e.ID 
    LEFT JOIN loan_types lt ON la.loan_type_id = lt.id
    WHERE la.outstanding_balance > 0
    ORDER BY la.created_at DESC
  `);
  return rows;
};

export const getLoansAdvancesByCompanyService = async (companyId) => {
  const [rows] = await db.query(`
    SELECT la.*, e.Name as EmployeeName, e.EmployeeID as EmployeeCode,
           lt.loan_type, lt.interest_rate, lt.max_amount, lt.max_tenure_months
    FROM hr_loans la 
    LEFT JOIN hr_employee e ON la.employee_id = e.ID 
    LEFT JOIN loan_types lt ON la.loan_type_id = lt.id
    WHERE la.companyId = ?
    ORDER BY la.created_at DESC
  `, [companyId]);
  return rows;
}; 
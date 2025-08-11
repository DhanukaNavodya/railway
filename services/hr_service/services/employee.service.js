import db from '../config/db.js';

export const getAllEmployeesService = async () => {
  const [rows] = await db.query(`
    SELECT e.*, d.Name as DepartmentName, des.Title as DesignationTitle 
    FROM hr_employee e 
    LEFT JOIN hr_department d ON e.department_id = d.id 
    LEFT JOIN hr_designation des ON e.designation_id = des.id
  `);
  
  // Get salary, adjustments, and document data for each employee
  const employeesWithDetails = await Promise.all(rows.map(async (employee) => {
    // Get salary data
    const [salaryData] = await db.query(`
      SELECT s.* FROM hr_salary s WHERE s.employee_number = ?
    `, [employee.ID]);
    
    // Get salary adjustments (additions)
    const [additionsData] = await db.query(`
      SELECT sa.*, at.addition_name, at.description as addition_description
      FROM hr_employee_salary_adjustments sa
      LEFT JOIN hr_addition_types at ON sa.type_id = at.id
      WHERE sa.employee_id = ? AND sa.adjustment_type = 'addition'
      ORDER BY at.addition_name ASC
    `, [employee.ID]);
    
    // Get salary adjustments (deductions)
    const [deductionsData] = await db.query(`
      SELECT sa.*, dt.deduction_name, dt.description as deduction_description
      FROM hr_employee_salary_adjustments sa
      LEFT JOIN hr_deduction_types dt ON sa.type_id = dt.id
      WHERE sa.employee_id = ? AND sa.adjustment_type = 'deduction'
      ORDER BY dt.deduction_name ASC
    `, [employee.ID]);
    
    // Get employee shifts
    const [shiftsData] = await db.query(`
      SELECT es.*, s.ShiftType, s.StartTime, s.EndTime, s.MaxArrivalDelay, s.LatestLeave, s.OTStartHours, s.Status
      FROM hr_employeeShift es
      LEFT JOIN hr_shift s ON es.shift_id = s.id
      WHERE es.employee_id = ?
      ORDER BY s.ShiftType ASC
    `, [employee.ID]);
    
    // Get document data
    const [documentData] = await db.query(`
      SELECT * FROM hr_employee_documents WHERE EmployeeID = ?
    `, [employee.ID]);
    
    // Get education qualifications
    const [educationData] = await db.query(`
      SELECT * FROM hr_employee_education WHERE employee_id = ?
      ORDER BY id ASC
    `, [employee.ID]);
    
    // Calculate salary totals
    const basicSalary = salaryData.length > 0 ? parseFloat(salaryData[0].basic_salary || 0) : 0;
    const totalAdditions = additionsData.reduce((sum, addition) => sum + parseFloat(addition.amount || 0), 0);
    const totalDeductions = deductionsData.reduce((sum, deduction) => sum + parseFloat(deduction.amount || 0), 0);
    const netSalary = basicSalary + totalAdditions - totalDeductions;
    
    return {
      // Basic employee information
      ...employee,
      
      // Salary information with calculations
      salary: {
        basic_salary: basicSalary,
        total_additions: totalAdditions,
        total_deductions: totalDeductions,
        net_salary: netSalary,
        raw_salary_data: salaryData.length > 0 ? salaryData[0] : null
      },
      
      // Detailed additions with type information
      additions: additionsData.map(addition => ({
        id: addition.id,
        type_id: addition.type_id,
        amount: parseFloat(addition.amount || 0),
        addition_name: addition.addition_name,
        description: addition.addition_description,
        companyId: addition.companyId,
        created_at: addition.created_at,
        updated_at: addition.updated_at
      })),
      
      // Detailed deductions with type information
      deductions: deductionsData.map(deduction => ({
        id: deduction.id,
        type_id: deduction.type_id,
        amount: parseFloat(deduction.amount || 0),
        deduction_name: deduction.deduction_name,
        description: deduction.deduction_description,
        companyId: deduction.companyId,
        created_at: deduction.created_at,
        updated_at: deduction.updated_at
      })),
      
      // Employee shifts with shift details
      shifts: shiftsData.map(shift => ({
        id: shift.id,
        shift_id: shift.shift_id,
        shift_type: shift.ShiftType,
        start_time: shift.StartTime,
        end_time: shift.EndTime,
        max_arrival_delay: shift.MaxArrivalDelay,
        latest_leave: shift.LatestLeave,
        ot_start_hours: shift.OTStartHours,
        status: shift.Status,
        assigned_date: shift.assigned_date,
        companyId: shift.companyId
      })),
      
      // Document information
      documents: documentData,
      
      // Education qualifications
      education_qualifications: educationData.map(education => ({
        id: education.id,
        qualification: education.qualification,
        companyId: education.companyId,
        created_at: education.created_at,
        updated_at: education.updated_at
      })),
      
      // Summary counts
      summary: {
        total_additions_count: additionsData.length,
        total_deductions_count: deductionsData.length,
        total_shifts_count: shiftsData.length,
        total_documents_count: documentData.length,
        total_education_count: educationData.length,
        has_salary_data: salaryData.length > 0
      }
    };
  }));
  
  return employeesWithDetails;
};

export const getEmployeeByIdService = async (id) => {
  const [rows] = await db.query(`
    SELECT e.*, d.Name as DepartmentName, des.Title as DesignationTitle 
    FROM hr_employee e 
    LEFT JOIN hr_department d ON e.department_id = d.id 
    LEFT JOIN hr_designation des ON e.designation_id = des.id 
    WHERE e.ID = ?
  `, [id]);
  
  if (rows.length === 0) {
    return null;
  }
  
  const employee = rows[0];
  
  // Get salary data
  const [salaryData] = await db.query(`
    SELECT s.* FROM hr_salary s WHERE s.employee_number = ?
  `, [employee.ID]);
  
  // Get salary adjustments (additions)
  const [additionsData] = await db.query(`
    SELECT sa.*, at.addition_name, at.description as addition_description
    FROM hr_employee_salary_adjustments sa
    LEFT JOIN hr_addition_types at ON sa.type_id = at.id
    WHERE sa.employee_id = ? AND sa.adjustment_type = 'addition'
    ORDER BY at.addition_name ASC
  `, [employee.ID]);
  
  // Get salary adjustments (deductions)
  const [deductionsData] = await db.query(`
    SELECT sa.*, dt.deduction_name, dt.description as deduction_description
    FROM hr_employee_salary_adjustments sa
    LEFT JOIN hr_deduction_types dt ON sa.type_id = dt.id
    WHERE sa.employee_id = ? AND sa.adjustment_type = 'deduction'
    ORDER BY dt.deduction_name ASC
  `, [employee.ID]);
  
  // Get employee shifts
  const [shiftsData] = await db.query(`
    SELECT es.*, s.ShiftType, s.StartTime, s.EndTime, s.MaxArrivalDelay, s.LatestLeave, s.OTStartHours, s.Status
    FROM hr_employeeShift es
    LEFT JOIN hr_shift s ON es.shift_id = s.id
    WHERE es.employee_id = ?
    ORDER BY s.ShiftType ASC
  `, [employee.ID]);
  
  // Get document data
  const [documentData] = await db.query(`
    SELECT * FROM hr_employee_documents WHERE EmployeeID = ?
  `, [employee.ID]);
  
  // Get education qualifications
  const [educationData] = await db.query(`
    SELECT * FROM hr_employee_education WHERE employee_id = ?
    ORDER BY id ASC
  `, [employee.ID]);
  
  // Get attendance summary (last 30 days)
  const [attendanceData] = await db.query(`
    SELECT 
      COUNT(*) as total_days,
      COUNT(CASE WHEN OutTime IS NOT NULL THEN 1 END) as completed_days,
      COUNT(CASE WHEN OutTime IS NULL THEN 1 END) as incomplete_days
    FROM hr_attendance 
    WHERE EmpID = ? AND DATE(InTime) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  `, [employee.ID]);
  
  // Calculate salary totals
  const basicSalary = salaryData.length > 0 ? parseFloat(salaryData[0].basic_salary || 0) : 0;
  const totalAdditions = additionsData.reduce((sum, addition) => sum + parseFloat(addition.amount || 0), 0);
  const totalDeductions = deductionsData.reduce((sum, deduction) => sum + parseFloat(deduction.amount || 0), 0);
  const netSalary = basicSalary + totalAdditions - totalDeductions;
  
  return {
    // Basic employee information
    ...employee,
    
    // Salary information with calculations
    salary: {
      basic_salary: basicSalary,
      total_additions: totalAdditions,
      total_deductions: totalDeductions,
      net_salary: netSalary,
      raw_salary_data: salaryData.length > 0 ? salaryData[0] : null
    },
    
    // Detailed additions with type information
    additions: additionsData.map(addition => ({
      id: addition.id,
      type_id: addition.type_id,
      amount: parseFloat(addition.amount || 0),
      addition_name: addition.addition_name,
      description: addition.addition_description,
      companyId: addition.companyId,
      created_at: addition.created_at,
      updated_at: addition.updated_at
    })),
    
    // Detailed deductions with type information
    deductions: deductionsData.map(deduction => ({
      id: deduction.id,
      type_id: deduction.type_id,
      amount: parseFloat(deduction.amount || 0),
      deduction_name: deduction.deduction_name,
      description: deduction.deduction_description,
      companyId: deduction.companyId,
      created_at: deduction.created_at,
      updated_at: deduction.updated_at
    })),
    
    // Employee shifts with detailed shift information
    shifts: shiftsData.map(shift => ({
      id: shift.id,
      shift_id: shift.shift_id,
      shift_type: shift.ShiftType,
      start_time: shift.StartTime,
      end_time: shift.EndTime,
      max_arrival_delay: shift.MaxArrivalDelay,
      latest_leave: shift.LatestLeave,
      ot_start_hours: shift.OTStartHours,
      status: shift.Status,
      assigned_date: shift.assigned_date,
      companyId: shift.companyId
    })),
    
    // Document information
    documents: documentData,
    
    // Education qualifications
    education_qualifications: educationData.map(education => ({
      id: education.id,
      qualification: education.qualification,
      companyId: education.companyId,
      created_at: education.created_at,
      updated_at: education.updated_at
    })),
    
    // Attendance summary (last 30 days)
    attendance_summary: attendanceData.length > 0 ? {
      total_days: attendanceData[0].total_days || 0,
      completed_days: attendanceData[0].completed_days || 0,
      incomplete_days: attendanceData[0].incomplete_days || 0,
      attendance_rate: attendanceData[0].total_days > 0 ? 
        ((attendanceData[0].completed_days / attendanceData[0].total_days) * 100).toFixed(2) + '%' : '0%'
    } : {
      total_days: 0,
      completed_days: 0,
      incomplete_days: 0,
      attendance_rate: '0%'
    },
    
    // Summary counts and status
    summary: {
      total_additions_count: additionsData.length,
      total_deductions_count: deductionsData.length,
      total_shifts_count: shiftsData.length,
      total_documents_count: documentData.length,
      total_education_count: educationData.length,
      has_salary_data: salaryData.length > 0,
      employment_status: employee.Status || 'active', // Assuming you have a status field
      epf_status: employee.epfStatus === 1 ? 'Active' : 'Inactive'
    }
  };
};

export const createEmployeeService = async (employeeData) => {
  console.log("=== CREATE EMPLOYEE SERVICE START ===");
  console.log("Input employeeData:", JSON.stringify(employeeData, null, 2));
  
  // Validate required fields
  if (!employeeData.EmployeeID || !employeeData.Name) {
    console.error("Validation failed: Missing required fields");
    console.error("EmployeeID:", employeeData.EmployeeID);
    console.error("Name:", employeeData.Name);
    throw new Error('EmployeeID and Name are required fields');
  }
  
  console.log("Validation passed: Required fields present");
  
  const {
    EmployeeID, EPF, Name, DOB, NIC, TIN_No, Passport_No, Driving_License,
    department_id, designation_id, Contact_Details, Emergency_Contact,
    Permanent_Address, Current_Address, Race, Religion, Gender, DateOfJoin,
    Confirmation_Date, Bank_Name, Bank_Branch, Branch_Code, Bank_Acc_No, companyId,
    FingerprintNumber, epfStatus,
    Basic_Salary, additions, deductions, shifts, documents, educationQualification
  } = employeeData;
  
  // Check for duplicate NIC
  console.log("Checking for duplicate NIC...");
  const [existingNIC] = await db.query('SELECT ID, Name FROM hr_employee WHERE NIC = ?', [NIC]);
  if (existingNIC.length > 0) {
    console.error(`NIC ${NIC} already exists for employee: ${existingNIC[0].Name} (ID: ${existingNIC[0].ID})`);
    throw new Error(`NIC ${NIC} is already registered for employee ${existingNIC[0].Name}`);
  }
  console.log("NIC validation passed - no duplicates found");
  
  // Start transaction
  console.log("Starting database transaction...");
  const connection = await db.getConnection();
  console.log("Database connection obtained");
  await connection.beginTransaction();
  console.log("Transaction started successfully");
  
  try {
    // Insert employee data
    console.log("Preparing to insert employee data...");
    console.log("Employee data values:", {
      EmployeeID, EPF, Name, DOB, NIC, TIN_No, Passport_No, Driving_License,
      department_id, designation_id, Contact_Details, Emergency_Contact,
      Permanent_Address, Current_Address, Race, Religion, Gender, DateOfJoin,
      Confirmation_Date, Bank_Name, Bank_Branch, Branch_Code, Bank_Acc_No, companyId,
      FingerprintNumber, epfStatus, Basic_Salary, 
      additions: additions?.length || 0, deductions: deductions?.length || 0, shifts: shifts?.length || 0
    });
    
    const [employeeResult] = await connection.query(`
      INSERT INTO hr_employee (
        EmployeeID, EPF, Name, DOB, NIC, TIN_No, Passport_No, Driving_License,
        department_id, designation_id, Contact_Details, Emergency_Contact,
        Permanent_Address, Current_Address, Race, Religion, Gender, DateOfJoin,
        Confirmation_Date, Bank_Name, Bank_Branch, Branch_Code, Bank_Acc_No, companyId,
        FingerprintNumber, epfStatus
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      EmployeeID, EPF, Name, DOB, NIC, TIN_No, Passport_No, Driving_License,
      department_id, designation_id, Contact_Details, Emergency_Contact,
      Permanent_Address, Current_Address, Race, Religion, Gender, DateOfJoin,
      Confirmation_Date, Bank_Name, Bank_Branch, Branch_Code, Bank_Acc_No, companyId,
      FingerprintNumber, (epfStatus !== undefined && epfStatus !== null) ? epfStatus : 0
    ]);
    
    console.log("Employee insert result:", employeeResult);
    const employeeId = employeeResult.insertId;
    console.log("Employee created with ID:", employeeId);
    
    // Insert salary data if provided
    if (Basic_Salary !== undefined) {
      console.log(`Inserting basic salary data: Basic_Salary=${Basic_Salary}`);
      
      try {
        await connection.query(`
          INSERT INTO hr_salary (employee_number, basic_salary, allowances)
          VALUES (?, ?, ?)
        `, [employeeId, Basic_Salary || 0, 0]); // Set allowances to 0 as we're using adjustments table
        console.log("Basic salary data inserted successfully");
      } catch (salaryError) {
        console.error("Error inserting salary data:", salaryError);
        throw salaryError;
      }
    } else {
      console.log("No salary data provided, skipping salary insertion");
    }
    
    // Insert salary adjustments (additions)
    if (additions && Array.isArray(additions) && additions.length > 0) {
      console.log(`Inserting ${additions.length} salary additions for employee ${employeeId}`);
      for (const addition of additions) {
        try {
          await connection.query(`
            INSERT INTO hr_employee_salary_adjustments (employee_id, adjustment_type, type_id, amount, companyId)
            VALUES (?, 'addition', ?, ?, ?)
          `, [employeeId, addition.addition_type_id, addition.amount, companyId]);
          console.log(`Addition inserted: type_id=${addition.addition_type_id}, amount=${addition.amount}`);
        } catch (additionError) {
          console.error(`Error inserting addition:`, additionError);
          throw additionError;
        }
      }
    } else {
      console.log("No additions provided, skipping additions insertion");
    }
    
    // Insert salary adjustments (deductions)
    if (deductions && Array.isArray(deductions) && deductions.length > 0) {
      console.log(`Inserting ${deductions.length} salary deductions for employee ${employeeId}`);
      for (const deduction of deductions) {
        try {
          await connection.query(`
            INSERT INTO hr_employee_salary_adjustments (employee_id, adjustment_type, type_id, amount, companyId)
            VALUES (?, 'deduction', ?, ?, ?)
          `, [employeeId, deduction.deduction_type_id, deduction.amount, companyId]);
          console.log(`Deduction inserted: type_id=${deduction.deduction_type_id}, amount=${deduction.amount}`);
        } catch (deductionError) {
          console.error(`Error inserting deduction:`, deductionError);
          throw deductionError;
        }
      }
    } else {
      console.log("No deductions provided, skipping deductions insertion");
    }
    
    // Insert employee shifts if provided
    if (shifts && Array.isArray(shifts) && shifts.length > 0) {
      console.log(`Inserting ${shifts.length} shifts for employee ${employeeId}`);
      for (const shift of shifts) {
        try {
          await connection.query(`
            INSERT INTO hr_employeeShift (employee_id, shift_id, assigned_date, companyId)
            VALUES (?, ?, CURDATE(), ?)
          `, [employeeId, shift.shift_id, companyId]);
          console.log(`Shift inserted: shift_id=${shift.shift_id} for employee ${employeeId}`);
        } catch (shiftError) {
          console.error(`Error inserting shift:`, shiftError);
          throw shiftError;
        }
      }
    } else {
      console.log("No shifts provided, skipping shifts insertion");
    }
    
    // Insert documents if provided
    if (documents && Array.isArray(documents) && documents.length > 0) {
      console.log(`Inserting ${documents.length} documents for employee ${employeeId}`);
      for (const document of documents) {
        // Note: In a real application, you would upload the file to a storage service
        // and get the URL. For now, we'll store the file name as a placeholder
        const documentUrl = `/uploads/documents/${document.name}`; // Placeholder URL
        console.log(`Inserting document: ${document.name} with URL: ${documentUrl}`);
        
        try {
          await connection.query(`
            INSERT INTO hr_employee_documents (EmployeeID, educationType, DocumentURL)
            VALUES (?, ?, ?)
          `, [employeeId, document.name, documentUrl]);
          console.log(`Document ${document.name} inserted successfully`);
        } catch (documentError) {
          console.error(`Error inserting document ${document.name}:`, documentError);
          throw documentError;
        }
      }
    } else {
      console.log("No documents provided, skipping document insertion");
    }
    
    // Insert education qualifications if provided
    if (educationQualification && Array.isArray(educationQualification) && educationQualification.length > 0) {
      console.log(`Inserting ${educationQualification.length} education qualifications for employee ${employeeId}`);
      for (const qualification of educationQualification) {
        try {
          await connection.query(`
            INSERT INTO hr_employee_education (employee_id, qualification, companyId)
            VALUES (?, ?, ?)
          `, [employeeId, qualification, companyId]);
          console.log(`Education qualification inserted: ${qualification}`);
        } catch (educationError) {
          console.error(`Error inserting education qualification ${qualification}:`, educationError);
          throw educationError;
        }
      }
    } else {
      console.log("No education qualifications provided, skipping education insertion");
    }
    
    console.log("Committing transaction...");
    await connection.commit();
    console.log("Transaction committed successfully");
    connection.release();
    console.log("Database connection released");
    
    console.log("=== CREATE EMPLOYEE SERVICE SUCCESS ===");
    return { 
      id: employeeId, 
      message: 'Employee created successfully with salary and documents' 
    };
    
  } catch (error) {
    console.error("=== CREATE EMPLOYEE SERVICE ERROR ===");
    console.error("Error occurred:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    console.log("Rolling back transaction...");
    await connection.rollback();
    console.log("Transaction rolled back");
    connection.release();
    console.log("Database connection released");
    
    throw error;
  }
};

export const updateEmployeeService = async (id, employeeData) => {
  const {
    EmployeeID, EPF, Name, DOB, NIC, TIN_No, Passport_No, Driving_License,
    department_id, designation_id, Contact_Details, Emergency_Contact,
    Permanent_Address, Current_Address, Race, Religion, Gender, DateOfJoin,
    Confirmation_Date, Bank_Name, Bank_Branch, Branch_Code, Bank_Acc_No, companyId,
    FingerprintNumber, epfStatus,
    Basic_Salary, additions, deductions, shifts, documents, educationQualification
  } = employeeData;
  
  // Start transaction
  const connection = await db.getConnection();
  await connection.beginTransaction();
  
  try {
    // Update employee data
    const [result] = await connection.query(`
      UPDATE hr_employee SET 
        EmployeeID = ?, EPF = ?, Name = ?, DOB = ?, NIC = ?, TIN_No = ?, 
        Passport_No = ?, Driving_License = ?, department_id = ?, designation_id = ?, 
        Contact_Details = ?, Emergency_Contact = ?, Permanent_Address = ?, 
        Current_Address = ?, Race = ?, Religion = ?, Gender = ?, DateOfJoin = ?, 
        Confirmation_Date = ?, Bank_Name = ?, Bank_Branch = ?, Branch_Code = ?, 
        Bank_Acc_No = ?, companyId = ?, FingerprintNumber = ?, epfStatus = ?
      WHERE ID = ?
    `, [
      EmployeeID, EPF, Name, DOB, NIC, TIN_No, Passport_No, Driving_License,
      department_id, designation_id, Contact_Details, Emergency_Contact,
      Permanent_Address, Current_Address, Race, Religion, Gender, DateOfJoin,
      Confirmation_Date, Bank_Name, Bank_Branch, Branch_Code, Bank_Acc_No, companyId,
      FingerprintNumber, (epfStatus !== undefined && epfStatus !== null) ? epfStatus : 0, id
    ]);
    
    // Update or insert salary data if provided
    if (Basic_Salary !== undefined) {
      const [salaryCheck] = await connection.query(
        'SELECT salary_id FROM hr_salary WHERE employee_number = ?',
        [id]
      );
      
      if (salaryCheck.length > 0) {
        // Update existing salary record
        await connection.query(`
          UPDATE hr_salary SET basic_salary = ?, allowances = ?
          WHERE employee_number = ?
        `, [Basic_Salary || 0, 0, id]); // Set allowances to 0 as we're using adjustments table
      } else {
        // Insert new salary record
        await connection.query(`
          INSERT INTO hr_salary (employee_number, basic_salary, allowances)
          VALUES (?, ?, ?)
        `, [id, Basic_Salary || 0, 0]); // Set allowances to 0 as we're using adjustments table
      }
    }
    
    // Handle salary adjustments (both additions and deductions)
    if ((additions && Array.isArray(additions)) || (deductions && Array.isArray(deductions))) {
      // Remove existing salary adjustments for this employee
      await connection.query('DELETE FROM hr_employee_salary_adjustments WHERE employee_id = ?', [id]);
      
      // Insert new additions
      if (additions && Array.isArray(additions) && additions.length > 0) {
        for (const addition of additions) {
          await connection.query(`
            INSERT INTO hr_employee_salary_adjustments (employee_id, adjustment_type, type_id, amount, companyId)
            VALUES (?, 'addition', ?, ?, ?)
          `, [id, addition.addition_type_id, addition.amount, companyId]);
        }
      }
      
      // Insert new deductions
      if (deductions && Array.isArray(deductions) && deductions.length > 0) {
        for (const deduction of deductions) {
          await connection.query(`
            INSERT INTO hr_employee_salary_adjustments (employee_id, adjustment_type, type_id, amount, companyId)
            VALUES (?, 'deduction', ?, ?, ?)
          `, [id, deduction.deduction_type_id, deduction.amount, companyId]);
        }
      }
    }
    
    // Handle employee shifts if provided
    if (shifts && Array.isArray(shifts)) {
      // Remove existing shifts for this employee
      await connection.query('DELETE FROM hr_employeeShift WHERE employee_id = ?', [id]);
      
      // Insert new shifts
      if (shifts.length > 0) {
        for (const shift of shifts) {
          await connection.query(`
            INSERT INTO hr_employeeShift (employee_id, shift_id, assigned_date, companyId)
            VALUES (?, ?, CURDATE(), ?)
          `, [id, shift.shift_id, companyId]);
        }
      }
    }
    
    // Handle documents if provided
    if (documents && Array.isArray(documents) && documents.length > 0) {
      // Remove existing documents for this employee
      await connection.query('DELETE FROM hr_employee_documents WHERE EmployeeID = ?', [id]);
      
      // Insert new documents
      for (const document of documents) {
        const documentUrl = `/uploads/documents/${document.name}`; // Placeholder URL
        
        await connection.query(`
          INSERT INTO hr_employee_documents (EmployeeID, educationType, DocumentURL)
          VALUES (?, ?, ?)
        `, [id, document.name, documentUrl]);
      }
    }
    
    // Handle education qualifications if provided
    if (educationQualification && Array.isArray(educationQualification)) {
      // Remove existing education qualifications for this employee
      await connection.query('DELETE FROM hr_employee_education WHERE employee_id = ?', [id]);
      
      // Insert new education qualifications
      if (educationQualification.length > 0) {
        for (const qualification of educationQualification) {
          await connection.query(`
            INSERT INTO hr_employee_education (employee_id, qualification, companyId)
            VALUES (?, ?, ?)
          `, [id, qualification, companyId]);
        }
      }
    }
    
    await connection.commit();
    connection.release();
    
    return { message: 'Employee updated successfully', affectedRows: result.affectedRows };
    
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
};

export const deleteEmployeeService = async (id) => {
  const [result] = await db.query('DELETE FROM hr_employee WHERE ID = ?', [id]);
  return { message: 'Employee deleted successfully', affectedRows: result.affectedRows };
};

//change employee status
export const changeEmployeeStatusService= async(id,Status)=>{
  const [result]= await db.query('UPDATE hr_employee SET Status = ? WHERE ID = ?', [Status, id]);
  return {message: 'Employee status changed successfully', affectedRows: result.affectedRows};
}

// New service functions for salary operations
export const getEmployeeSalaryService = async (employeeId) => {
  const [rows] = await db.query(`
    SELECT s.*, e.Name as EmployeeName, e.EmployeeID, e.NIC, e.Contact_Details
    FROM hr_salary s
    JOIN hr_employee e ON s.employee_number = e.ID
    WHERE e.ID = ?
  `, [employeeId]);
  return rows.length > 0 ? rows[0] : null;
};

export const updateEmployeeSalaryService = async (employeeId, salaryData) => {
  const { Basic_Salary, Attendance_Allowance, Travel_Allowance } = salaryData;
  
  // Check if employee exists
  const [employeeRows] = await db.query('SELECT ID FROM hr_employee WHERE ID = ?', [employeeId]);
  if (employeeRows.length === 0) {
    throw new Error('Employee not found');
  }
  
  const totalAllowances = (Attendance_Allowance || 0) + (Travel_Allowance || 0);
  
  const [result] = await db.query(`
    UPDATE hr_salary SET basic_salary = ?, allowances = ?
    WHERE employee_number = ?
  `, [Basic_Salary || 0, totalAllowances, employeeId]);
  
  return { message: 'Salary updated successfully', affectedRows: result.affectedRows };
};

// New service functions for document operations
export const getEmployeeDocumentsService = async (employeeId) => {
  const [rows] = await db.query(`
    SELECT * FROM hr_employee_documents WHERE EmployeeID = ?
  `, [employeeId]);
  return rows;
};

export const addEmployeeDocumentService = async (employeeId, documentData) => {
  const { educationType, DocumentURL } = documentData;
  
  const [result] = await db.query(`
    INSERT INTO hr_employee_documents (EmployeeID, educationType, DocumentURL)
    VALUES (?, ?, ?)
  `, [employeeId, educationType, DocumentURL]);
  
  return { id: result.insertId, message: 'Document added successfully' };
};

export const deleteEmployeeDocumentService = async (documentId) => {
  const [result] = await db.query('DELETE FROM hr_employee_documents WHERE id = ?', [documentId]);
  return { message: 'Document deleted successfully', affectedRows: result.affectedRows };
};

// New service functions for education qualification operations
export const getEmployeeEducationService = async (employeeId) => {
  const [rows] = await db.query(`
    SELECT * FROM hr_employee_education WHERE employee_id = ?
    ORDER BY id ASC
  `, [employeeId]);
  return rows;
};

export const addEmployeeEducationService = async (employeeId, educationData) => {
  const { qualification, companyId } = educationData;
  
  const [result] = await db.query(`
    INSERT INTO hr_employee_education (employee_id, qualification, companyId)
    VALUES (?, ?, ?)
  `, [employeeId, qualification, companyId]);
  
  return { id: result.insertId, message: 'Education qualification added successfully' };
};

export const updateEmployeeEducationService = async (educationId, educationData) => {
  const { qualification, companyId } = educationData;
  
  const [result] = await db.query(`
    UPDATE hr_employee_education SET qualification = ?, companyId = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [qualification, companyId, educationId]);
  
  return { message: 'Education qualification updated successfully', affectedRows: result.affectedRows };
};

export const deleteEmployeeEducationService = async (educationId) => {
  const [result] = await db.query('DELETE FROM hr_employee_education WHERE id = ?', [educationId]);
  return { message: 'Education qualification deleted successfully', affectedRows: result.affectedRows };
};
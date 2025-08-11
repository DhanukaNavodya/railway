import { 
  getAllEmployeesService, 
  getEmployeeByIdService, 
  createEmployeeService,
  updateEmployeeService,
  deleteEmployeeService,
  changeEmployeeStatusService,
  getEmployeeSalaryService,
  updateEmployeeSalaryService,
  getEmployeeDocumentsService,
  addEmployeeDocumentService,
  deleteEmployeeDocumentService,
  getEmployeeEducationService,
  addEmployeeEducationService,
  updateEmployeeEducationService,
  deleteEmployeeEducationService
} from '../services/employee.service.js';

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await getAllEmployeesService();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await getEmployeeByIdService(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createEmployee = async (req, res) => {
  console.log("=== CREATE EMPLOYEE CONTROLLER START ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  
  try {
    console.log("Calling createEmployeeService...");
    const result = await createEmployeeService(req.body);
    console.log("Service returned result:", result);
    res.status(201).json(result);
    console.log("=== CREATE EMPLOYEE CONTROLLER SUCCESS ===");
  } catch (err) {
    console.error("=== CREATE EMPLOYEE CONTROLLER ERROR ===");
    console.error("Error in controller:", err);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: err.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const result = await updateEmployeeService(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const result = await deleteEmployeeService(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//change employee status
export const changeEmployeeStatus= async(req,res)=>{
  try{
    const Status=req.body.status;
    const result= await changeEmployeeStatusService(req.params.id,Status);
    res.json(result);
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

// New controller functions for salary operations
export const getEmployeeSalary = async (req, res) => {
  try {
    const salary = await getEmployeeSalaryService(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: 'Salary information not found for this employee' });
    }
    res.json(salary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEmployeeSalary = async (req, res) => {
  try {
    const result = await updateEmployeeSalaryService(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// New controller functions for document operations
export const getEmployeeDocuments = async (req, res) => {
  try {
    const documents = await getEmployeeDocumentsService(req.params.id);
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addEmployeeDocument = async (req, res) => {
  try {
    const result = await addEmployeeDocumentService(req.params.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEmployeeDocument = async (req, res) => {
  try {
    const result = await deleteEmployeeDocumentService(req.params.documentId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// New controller functions for education qualification operations
export const getEmployeeEducation = async (req, res) => {
  try {
    const education = await getEmployeeEducationService(req.params.id);
    res.json(education);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addEmployeeEducation = async (req, res) => {
  try {
    const result = await addEmployeeEducationService(req.params.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEmployeeEducation = async (req, res) => {
  try {
    const result = await updateEmployeeEducationService(req.params.educationId, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Education qualification not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEmployeeEducation = async (req, res) => {
  try {
    const result = await deleteEmployeeEducationService(req.params.educationId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Education qualification not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

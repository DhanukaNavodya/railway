import express from 'express';
import { 
  getAllEmployees, 
  getEmployeeById, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee,
  changeEmployeeStatus,
  getEmployeeSalary,
  updateEmployeeSalary,
  getEmployeeDocuments,
  addEmployeeDocument,
  deleteEmployeeDocument,
  getEmployeeEducation,
  addEmployeeEducation,
  updateEmployeeEducation,
  deleteEmployeeEducation
} from '../controllers/employee.controller.js';

const router = express.Router();

router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.put('/employee-status/:id', changeEmployeeStatus);

// Salary routes
router.get('/:id/salary', getEmployeeSalary);
router.put('/:id/salary', updateEmployeeSalary);

// Document routes
router.get('/:id/documents', getEmployeeDocuments);
router.post('/:id/documents', addEmployeeDocument);
router.delete('/documents/:documentId', deleteEmployeeDocument);

// Education qualification routes
router.get('/:id/education', getEmployeeEducation);
router.post('/:id/education', addEmployeeEducation);
router.put('/education/:educationId', updateEmployeeEducation);
router.delete('/education/:educationId', deleteEmployeeEducation);

export default router;

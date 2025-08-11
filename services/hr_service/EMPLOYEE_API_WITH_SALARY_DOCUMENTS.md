# Employee API with Salary and Document Management

This document describes the updated Employee API that now includes salary management and document storage functionality.

## Database Tables

### hr_salary
```sql
CREATE TABLE IF NOT EXISTS hr_salary (
    salary_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_number INT NOT NULL,
    basic_salary DECIMAL(10, 2) NOT NULL,
    allowances DECIMAL(10, 2) DEFAULT 0.00,
    net_salary DECIMAL(10, 2) GENERATED ALWAYS AS (basic_salary + allowances) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_number) REFERENCES hr_employee(ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

### hr_employee_documents
```sql
CREATE TABLE IF NOT EXISTS hr_employee_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    EmployeeID INT NOT NULL,
    educationType VARCHAR(255),
    DocumentURL TEXT,
    FOREIGN KEY (EmployeeID) REFERENCES hr_employee(ID)
);
```

## API Endpoints

### Employee Management

#### 1. Get All Employees
- **GET** `/api/employees`
- **Description**: Retrieve all employees with department, designation, salary, and document information
- **Response**: Array of employee objects with complete data
```json
[
  {
    "ID": 1,
    "EmployeeID": "IT21012",
    "Name": "ABC",
    "DepartmentName": "IT Department",
    "DesignationTitle": "Software Developer",
    "salary": {
      "salary_id": 1,
      "employee_number": 1,
      "basic_salary": 1000.00,
      "allowances": 1000.00,
      "net_salary": 2000.00,
      "created_at": "2023-07-13T10:00:00Z",
      "updated_at": "2023-07-13T10:00:00Z"
    },
    "documents": [
      {
        "id": 1,
        "EmployeeID": 1,
        "educationType": "Birth Certificate",
        "DocumentURL": "/uploads/documents/Birth Certificate"
      }
    ]
  }
]
```

#### 2. Get Employee by ID
- **GET** `/api/employees/:id`
- **Description**: Retrieve a specific employee by ID with complete data
- **Response**: Employee object with salary and documents or 404 if not found
```json
{
  "ID": 1,
  "EmployeeID": "IT21012",
  "Name": "ABC",
  "DepartmentName": "IT Department",
  "DesignationTitle": "Software Developer",
  "salary": {
    "salary_id": 1,
    "employee_number": 1,
    "basic_salary": 1000.00,
    "allowances": 1000.00,
    "net_salary": 2000.00,
    "created_at": "2023-07-13T10:00:00Z",
    "updated_at": "2023-07-13T10:00:00Z"
  },
  "documents": [
    {
      "id": 1,
      "EmployeeID": 1,
      "educationType": "Birth Certificate",
      "DocumentURL": "/uploads/documents/Birth Certificate"
    }
  ]
}
```

#### 3. Create Employee
- **POST** `/api/employees`
- **Description**: Create a new employee with optional salary and document data
- **Request Body**:
```json
{
  "EmployeeID": "IT21012",
  "EPF": "EPF123456w",
  "Name": "ABC",
  "DOB": "1976-01-31",
  "Age": 24,
  "NIC": "901234567V",
  "TIN_No": "TIN123456s",
  "Passport_No": "P123456789",
  "Driving_License": "DL123456789",
  "department_id": 2,
  "designation_id": 2,
  "Contact_Details": "0781896658",
  "Emergency_Contact": "0781896658",
  "Permanent_Address": "Agaregedara ,wewagama",
  "Current_Address": "Agaregedara ,wewagama",
  "Race": "sinhalese",
  "Religion": "buddhism",
  "Gender": "male",
  "DateOfJoin": "2023-07-13",
  "Confirmation_Date": "2023-07-13",
  "Bank_Name": "Pan Asia Bank",
  "Bank_Branch": "KULI",
  "Branch_Code": "CBC001",
  "Bank_Acc_No": "1234567890",
  "companyId": "companyId-1",
  "Basic_Salary": 1000.00,
  "Attendance_Allowance": 1000.00,
  "Travel_Allowance": 0.00,
  "documents": [
    {
      "name": "Birth Certificate",
      "file": "File object"
    }
  ]
}
```
- **Response**: Created employee object with ID

#### 4. Update Employee
- **PUT** `/api/employees/:id`
- **Description**: Update an existing employee
- **Request Body**: Same as create employee (all fields optional)
- **Response**: Update confirmation

#### 5. Delete Employee
- **DELETE** `/api/employees/:id`
- **Description**: Delete an employee (cascades to salary and documents)
- **Response**: Deletion confirmation

#### 6. Change Employee Status
- **PUT** `/api/employees/employee-status/:id`
- **Description**: Change employee status
- **Request Body**: `{ "status": "active|inactive" }`
- **Response**: Status change confirmation

### Salary Management

#### 7. Get Employee Salary
- **GET** `/api/employees/:id/salary`
- **Description**: Retrieve salary information for a specific employee
- **Response**:
```json
{
  "salary_id": 1,
  "employee_number": 1,
  "basic_salary": 1000.00,
  "allowances": 1000.00,
  "net_salary": 2000.00,
  "created_at": "2023-07-13T10:00:00Z",
  "updated_at": "2023-07-13T10:00:00Z",
  "EmployeeName": "ABC",
  "EmployeeID": "IT21012",
  "NIC": "90123417V",
  "Contact_Details": "0781896658"
}
```

#### 8. Update Employee Salary
- **PUT** `/api/employees/:id/salary`
- **Description**: Update salary information for an employee
- **Request Body**:
```json
{
  "Basic_Salary": 1000.00,
  "Attendance_Allowance": 1000.00,
  "Travel_Allowance": 0.00
}
```
- **Response**: Salary update confirmation

### Document Management

#### 9. Get Employee Documents
- **GET** `/api/employees/:id/documents`
- **Description**: Retrieve all documents for a specific employee
- **Response**: Array of document objects
```json
[
  {
    "id": 1,
    "EmployeeID": 1,
    "educationType": "Birth Certificate",
    "DocumentURL": "/uploads/documents/Birth Certificate"
  }
]
```

#### 10. Add Employee Document
- **POST** `/api/employees/:id/documents`
- **Description**: Add a new document for an employee
- **Request Body**:
```json
{
  "educationType": "Educational Certificate",
  "DocumentURL": "/uploads/documents/education_cert.pdf"
}
```
- **Response**: Created document object with ID

#### 11. Delete Employee Document
- **DELETE** `/api/employees/documents/:documentId`
- **Description**: Delete a specific document
- **Response**: Document deletion confirmation

## Features

### Transaction Support
- All employee creation and update operations use database transactions
- Ensures data consistency across employee, salary, and document tables
- Automatic rollback on errors

### Salary Calculation
- Net salary is automatically calculated as basic_salary + allowances
- Stored as a generated column for performance
- Updates automatically when basic_salary or allowances change

### Document Storage
- Documents are stored with metadata (education type, URL)
- File upload handling (placeholder implementation)
- Support for multiple documents per employee

### Foreign Key Constraints
- Salary table references employee by EmployeeID
- Document table references employee by ID
- Cascade delete ensures data integrity

## Error Handling

- 404 responses for non-existent employees/documents
- 500 responses for server errors
- Transaction rollback on database errors
- Proper error messages for debugging

## Usage Examples

### Creating an Employee with Salary and Documents
```javascript
const employeeData = {
  EmployeeID: "IT21012",
  Name: "John Doe",
  // ... other employee fields
  Basic_Salary: 1000.00,
  Attendance_Allowance: 1000.00,
  Travel_Allowance: 0.00,
  documents: [
    { name: "Birth Certificate", file: birthCertFile },
    { name: "Educational Certificate", file: eduCertFile }
  ]
};

const response = await fetch('/api/employees', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(employeeData)
});
```

### Updating Employee Salary
```javascript
const salaryData = {
  Basic_Salary: 1000.00,
  Attendance_Allowance: 1000.00,
  Travel_Allowance: 0.00
};

const response = await fetch('/api/employees/1/salary', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(salaryData)
});
```

### Adding a Document
```javascript
const documentData = {
  educationType: "Professional Certificate",
  DocumentURL: "/uploads/documents/professional_cert.pdf"
};

const response = await fetch('/api/employees/1/documents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(documentData)
});
```

## Notes

1. **File Upload**: The current implementation uses placeholder URLs. In production, implement proper file upload handling with cloud storage or local file system.

2. **Validation**: Add input validation for salary amounts, document types, and other fields.

3. **Authentication**: Implement proper authentication and authorization for sensitive operations.

4. **Logging**: Add comprehensive logging for audit trails.

5. **Performance**: Consider indexing on frequently queried fields like EmployeeID and employee_number. 
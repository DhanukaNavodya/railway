# Employee Education Qualifications API

This document describes the API endpoints for managing employee education qualifications in the HR system.

## Database Schema

The education qualifications are stored in the `hr_employee_education` table:

```sql
CREATE TABLE hr_employee_education (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    qualification VARCHAR(500) NOT NULL,
    companyId VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES hr_employee(ID)
);
```

**Note:** If you're using MySQL 5.7 or earlier, you might need to use this alternative syntax:
```sql
CREATE TABLE hr_employee_education (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    qualification VARCHAR(500) NOT NULL,
    companyId VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES hr_employee(ID)
);

-- Add trigger for updated_at
DELIMITER //
CREATE TRIGGER update_hr_employee_education_timestamp 
BEFORE UPDATE ON hr_employee_education
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//
DELIMITER ;
```

## API Endpoints

### 1. Get Employee Education Qualifications

**GET** `/api/employees/:id/education`

Retrieves all education qualifications for a specific employee.

**Parameters:**
- `id` (path parameter): Employee ID

**Response:**
```json
[
  {
    "id": 1,
    "employee_id": 123,
    "qualification": "Bachelor's Degree in Computer Science",
    "companyId": "COMP001",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "employee_id": 123,
    "qualification": "Master's Degree in Business Administration",
    "companyId": "COMP001",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### 2. Add Education Qualification

**POST** `/api/employees/:id/education`

Adds a new education qualification for an employee.

**Parameters:**
- `id` (path parameter): Employee ID

**Request Body:**
```json
{
  "qualification": "Bachelor's Degree in Engineering",
  "companyId": "COMP001"
}
```

**Response:**
```json
{
  "id": 3,
  "message": "Education qualification added successfully"
}
```

### 3. Update Education Qualification

**PUT** `/api/employees/education/:educationId`

Updates an existing education qualification.

**Parameters:**
- `educationId` (path parameter): Education qualification ID

**Request Body:**
```json
{
  "qualification": "Master's Degree in Engineering",
  "companyId": "COMP001"
}
```

**Response:**
```json
{
  "message": "Education qualification updated successfully",
  "affectedRows": 1
}
```

### 4. Delete Education Qualification

**DELETE** `/api/employees/education/:educationId`

Deletes an education qualification.

**Parameters:**
- `educationId` (path parameter): Education qualification ID

**Response:**
```json
{
  "message": "Education qualification deleted successfully",
  "affectedRows": 1
}
```

## Integration with Employee Creation

When creating a new employee, education qualifications can be included in the request body:

**POST** `/api/employees`

**Request Body:**
```json
{
  "EmployeeID": "EMP001",
  "Name": "John Doe",
  "NIC": "123456789V",
  "Contact_Details": "+94 71 123 4567",
  "department_id": 1,
  "designation_id": 1,
  "Basic_Salary": 50000,
  "companyId": "COMP001",
  "educationQualification": [
    "O/L",
    "A/L",
    "Bachelor's Degree"
  ],
  "additions": [
    {
      "addition_type_id": 1,
      "amount": 5000
    }
  ],
  "deductions": [
    {
      "deduction_type_id": 1,
      "amount": 2000
    }
  ],
  "shifts": [
    {
      "shift_id": 1
    }
  ],
  "documents": [
    {
      "name": "NIC Copy"
    }
  ]
}
```

## Integration with Employee Retrieval

When retrieving employee details, education qualifications are included in the response:

**GET** `/api/employees/:id`

**Response includes:**
```json
{
  "ID": 123,
  "EmployeeID": "EMP001",
  "Name": "John Doe",
  "NIC": "123456789V",
  "Contact_Details": "+94 71 123 4567",
  "department_id": 1,
  "designation_id": 1,
  "DepartmentName": "IT Department",
  "DesignationTitle": "Software Engineer",
  "education_qualifications": [
    {
      "id": 1,
      "qualification": "O/L",
      "companyId": "COMP001",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "qualification": "A/L",
      "companyId": "COMP001",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 3,
      "qualification": "Bachelor's Degree",
      "companyId": "COMP001",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "summary": {
    "total_education_count": 3,
    "total_additions_count": 1,
    "total_deductions_count": 1,
    "total_shifts_count": 1,
    "total_documents_count": 1,
    "has_salary_data": true
  }
}
```

## Error Responses

### 404 Not Found
```json
{
  "message": "Education qualification not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Database connection failed"
}
```

## Frontend Integration

The frontend can send education qualifications as an array in the `educationQualification` field when creating or updating employees. The backend will automatically handle the insertion and retrieval of these qualifications.

### Example Frontend Usage

```javascript
const employeeData = {
  EmployeeID: "EMP001",
  Name: "John Doe",
  NIC: "123456789V",
  Contact_Details: "+94 71 123 4567",
  department_id: 1,
  designation_id: 1,
  Basic_Salary: 50000,
  companyId: "COMP001",
  educationQualification: [
    "O/L",
    "A/L", 
    "Bachelor's Degree in Computer Science",
    "Master's Degree in Business Administration"
  ]
};

// Create employee with education qualifications
const response = await fetch('/api/employees', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(employeeData)
});
```

## Notes

1. Education qualifications are automatically included when creating or updating employees
2. Each qualification is stored as a separate record in the database
3. The `companyId` field is used for multi-tenant support
4. Timestamps are automatically managed by the database
5. Foreign key constraints ensure data integrity
6. Education qualifications are returned in chronological order (by ID)

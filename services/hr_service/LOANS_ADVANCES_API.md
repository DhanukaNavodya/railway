# Loans and Advances API Documentation

This document describes the API endpoints for managing employee loans and advances in the HR system.

## Database Schema

The loans and advances are stored in the `hr_loans` table with the following structure:

```sql
CREATE TABLE IF NOT EXISTS hr_loans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    loan_type_id INT NOT NULL,
    granted_amount DECIMAL(10,2),
    granted_date DATE,
    period INT,
    closing_date DATE,
    total_deductions DECIMAL(10,2),
    outstanding_balance DECIMAL(10,2),
    companyId VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES hr_employee(ID),
    FOREIGN KEY (loan_type_id) REFERENCES loan_types(id)
);
```

## API Endpoints

### Base URL
```
/api/loans-advances
```

### 1. Get All Loans and Advances
**GET** `/api/loans-advances`

Returns all loans and advances with employee information.

**Response:**
```json
[
  {
    "id": 1,
    "employee_id": 123,
    "type": "Personal Loan",
    "granted_amount": "50000.00",
    "granted_date": "2024-01-15",
    "period": 12,
    "closing_date": "2025-01-15",
    "total_deductions": "15000.00",
    "outstanding_balance": "35000.00",
    "companyId": "COMP001",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "EmployeeName": "John Doe",
    "EmployeeCode": "EMP001"
  }
]
```

### 2. Get Loan/Advance by ID
**GET** `/api/loans-advances/:id`

Returns a specific loan or advance by its ID.

**Response:**
```json
{
  "id": 1,
  "employee_id": 123,
  "type": "Personal Loan",
  "granted_amount": "50000.00",
  "granted_date": "2024-01-15",
  "period": 12,
  "closing_date": "2025-01-15",
  "total_deductions": "15000.00",
  "outstanding_balance": "35000.00",
  "companyId": "COMP001",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z",
  "EmployeeName": "John Doe",
  "EmployeeCode": "EMP001"
}
```

### 3. Create New Loan/Advance
**POST** `/api/loans-advances`

Creates a new loan or advance record.

**Request Body:**
```json
{
  "employee_id": 123,
  "type": "Personal Loan",
  "granted_amount": "50000.00",
  "granted_date": "2024-01-15",
  "period": 12,
  "closing_date": "2025-01-15",
  "total_deductions": "0.00",
  "outstanding_balance": "50000.00",
  "companyId": "COMP001"
}
```

**Response:**
```json
{
  "id": 1,
  "message": "Loan/Advance created successfully"
}
```

### 4. Update Loan/Advance
**PUT** `/api/loans-advances/:id`

Updates an existing loan or advance record.

**Request Body:**
```json
{
  "employee_id": 123,
  "type": "Personal Loan",
  "granted_amount": "55000.00",
  "granted_date": "2024-01-15",
  "period": 12,
  "closing_date": "2025-01-15",
  "total_deductions": "15000.00",
  "outstanding_balance": "40000.00",
  "companyId": "COMP001"
}
```

**Response:**
```json
{
  "message": "Loan/Advance updated successfully",
  "affectedRows": 1
}
```

### 5. Delete Loan/Advance
**DELETE** `/api/loans-advances/:id`

Deletes a loan or advance record.

**Response:**
```json
{
  "message": "Loan/Advance deleted successfully",
  "affectedRows": 1
}
```

### 6. Update Deductions
**PUT** `/api/loans-advances/:id/deductions`

Updates the deductions for a specific loan/advance. This automatically recalculates the outstanding balance.

**Request Body:**
```json
{
  "deductionAmount": "5000.00"
}
```

**Response:**
```json
{
  "message": "Deductions updated successfully",
  "affectedRows": 1,
  "newTotalDeductions": "20000.00",
  "newOutstandingBalance": "30000.00"
}
```

### 7. Get Loans/Advances by Employee
**GET** `/api/loans-advances/employee/:employeeId`

Returns all loans and advances for a specific employee.

**Response:**
```json
[
  {
    "id": 1,
    "employee_id": 123,
    "type": "Personal Loan",
    "granted_amount": "50000.00",
    "granted_date": "2024-01-15",
    "period": 12,
    "closing_date": "2025-01-15",
    "total_deductions": "15000.00",
    "outstanding_balance": "35000.00",
    "companyId": "COMP001",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "EmployeeName": "John Doe",
    "EmployeeCode": "EMP001"
  }
]
```

### 8. Get Loans/Advances by Type
**GET** `/api/loans-advances/type/:type`

Returns all loans and advances of a specific type (e.g., "Personal Loan", "Advance", "Housing Loan").

**Response:**
```json
[
  {
    "id": 1,
    "employee_id": 123,
    "type": "Personal Loan",
    "granted_amount": "50000.00",
    "granted_date": "2024-01-15",
    "period": 12,
    "closing_date": "2025-01-15",
    "total_deductions": "15000.00",
    "outstanding_balance": "35000.00",
    "companyId": "COMP001",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "EmployeeName": "John Doe",
    "EmployeeCode": "EMP001"
  }
]
```

### 9. Get Active Loans/Advances
**GET** `/api/loans-advances/active/all`

Returns all loans and advances with outstanding balance greater than 0.

**Response:**
```json
[
  {
    "id": 1,
    "employee_id": 123,
    "type": "Personal Loan",
    "granted_amount": "50000.00",
    "granted_date": "2024-01-15",
    "period": 12,
    "closing_date": "2025-01-15",
    "total_deductions": "15000.00",
    "outstanding_balance": "35000.00",
    "companyId": "COMP001",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "EmployeeName": "John Doe",
    "EmployeeCode": "EMP001"
  }
]
```

### 10. Get Loans/Advances by Company
**GET** `/api/loans-advances/company/:companyId`

Returns all loans and advances for a specific company.

**Response:**
```json
[
  {
    "id": 1,
    "employee_id": 123,
    "type": "Personal Loan",
    "granted_amount": "50000.00",
    "granted_date": "2024-01-15",
    "period": 12,
    "closing_date": "2025-01-15",
    "total_deductions": "15000.00",
    "outstanding_balance": "35000.00",
    "companyId": "COMP001",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "EmployeeName": "John Doe",
    "EmployeeCode": "EMP001"
  }
]
```

## Field Descriptions

- **id**: Unique identifier for the loan/advance record
- **employee_id**: Foreign key reference to the employee table
- **type**: Type of loan or advance (e.g., "Personal Loan", "Advance", "Housing Loan")
- **granted_amount**: Total amount granted for the loan/advance
- **granted_date**: Date when the loan/advance was granted
- **period**: Duration of the loan/advance in months
- **closing_date**: Expected closing date of the loan/advance
- **total_deductions**: Total amount deducted so far
- **outstanding_balance**: Remaining balance to be paid
- **companyId**: Company identifier for multi-tenant support
- **created_at**: Timestamp when the record was created
- **updated_at**: Timestamp when the record was last updated
- **EmployeeName**: Name of the employee (joined from employee table)
- **EmployeeCode**: Employee code (joined from employee table)

## Error Responses

### 404 Not Found
```json
{
  "message": "Loan/Advance not found"
}
```

### 400 Bad Request
```json
{
  "message": "Valid deduction amount is required"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message details"
}
```

## Usage Examples

### Creating a Personal Loan
```javascript
const response = await fetch('/api/loans-advances', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    employee_id: 123,
    type: "Personal Loan",
    granted_amount: "50000.00",
    granted_date: "2024-01-15",
    period: 12,
    closing_date: "2025-01-15",
    total_deductions: "0.00",
    outstanding_balance: "50000.00",
    companyId: "COMP001"
  })
});
```

### Updating Deductions
```javascript
const response = await fetch('/api/loans-advances/1/deductions', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    deductionAmount: "5000.00"
  })
});
```

### Getting Employee's Loans
```javascript
const response = await fetch('/api/loans-advances/employee/123');
const employeeLoans = await response.json();
```

## Notes

1. The `outstanding_balance` is automatically calculated when deductions are updated
2. All monetary values are stored as DECIMAL(10,2) for precision
3. The system supports multi-tenant architecture through the `companyId` field
4. Employee information is joined from the `hr_employee` table for display purposes
5. All timestamps are automatically managed by the database 
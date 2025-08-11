# Loan Types API Documentation

This document describes the API endpoints for managing loan types in the HR system.

## Database Schema

The loan types are stored in the `loan_types` table with the following structure:

```sql
CREATE TABLE IF NOT EXISTS loan_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    loan_type VARCHAR(255) NOT NULL,
    interest_rate DECIMAL(5, 2) DEFAULT 0.00,
    max_amount DECIMAL(10, 2) NOT NULL,
    max_tenure_months INT NOT NULL,
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    companyId VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### Base URL
```
/api/loan-types
```

### 1. Get All Loan Types
**GET** `/api/loan-types`

Returns all loan types.

**Response:**
```json
[
  {
    "id": 1,
    "loan_type": "Personal Loan",
    "interest_rate": "5.50",
    "max_amount": "100000.00",
    "max_tenure_months": 60,
    "is_active": 1,
    "created_at": "2024-01-15T10:30:00.000Z",
    "companyId": "COMP001",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### 2. Get Loan Type by ID
**GET** `/api/loan-types/:id`

Returns a specific loan type by its ID.

**Response:**
```json
{
  "id": 1,
  "loan_type": "Personal Loan",
  "interest_rate": "5.50",
  "max_amount": "100000.00",
  "max_tenure_months": 60,
  "is_active": 1,
  "created_at": "2024-01-15T10:30:00.000Z",
  "companyId": "COMP001",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

### 3. Create New Loan Type
**POST** `/api/loan-types`

Creates a new loan type.

**Request Body:**
```json
{
  "loan_type": "Personal Loan",
  "interest_rate": "5.50",
  "max_amount": "100000.00",
  "max_tenure_months": 60,
  "is_active": 1,
  "companyId": "COMP001"
}
```

**Response:**
```json
{
  "id": 1,
  "message": "Loan type created successfully"
}
```

### 4. Update Loan Type
**PUT** `/api/loan-types/:id`

Updates an existing loan type.

**Request Body:**
```json
{
  "loan_type": "Personal Loan",
  "interest_rate": "6.00",
  "max_amount": "120000.00",
  "max_tenure_months": 72,
  "is_active": 1,
  "companyId": "COMP001"
}
```

**Response:**
```json
{
  "message": "Loan type updated successfully",
  "affectedRows": 1
}
```

### 5. Delete Loan Type
**DELETE** `/api/loan-types/:id`

Deletes a loan type (only if not used by any existing loans).

**Response:**
```json
{
  "message": "Loan type deleted successfully",
  "affectedRows": 1
}
```

### 6. Get Active Loan Types
**GET** `/api/loan-types/active/all`

Returns all active loan types.

**Response:**
```json
[
  {
    "id": 1,
    "loan_type": "Personal Loan",
    "interest_rate": "5.50",
    "max_amount": "100000.00",
    "max_tenure_months": 60,
    "is_active": 1,
    "created_at": "2024-01-15T10:30:00.000Z",
    "companyId": "COMP001",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### 7. Get Loan Types by Company
**GET** `/api/loan-types/company/:companyId`

Returns all loan types for a specific company.

**Response:**
```json
[
  {
    "id": 1,
    "loan_type": "Personal Loan",
    "interest_rate": "5.50",
    "max_amount": "100000.00",
    "max_tenure_months": 60,
    "is_active": 1,
    "created_at": "2024-01-15T10:30:00.000Z",
    "companyId": "COMP001",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### 8. Toggle Loan Type Status
**PUT** `/api/loan-types/:id/toggle-status`

Activates or deactivates a loan type.

**Response:**
```json
{
  "message": "Loan type activated successfully",
  "affectedRows": 1,
  "newStatus": 1
}
```

### 9. Get Loan Type by Name
**GET** `/api/loan-types/name/:loanTypeName`

Returns a loan type by its name (with optional company filter).

**Query Parameters:**
- `companyId` (optional): Filter by company ID

**Response:**
```json
{
  "id": 1,
  "loan_type": "Personal Loan",
  "interest_rate": "5.50",
  "max_amount": "100000.00",
  "max_tenure_months": 60,
  "is_active": 1,
  "created_at": "2024-01-15T10:30:00.000Z",
  "companyId": "COMP001",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

## Field Descriptions

- **id**: Unique identifier for the loan type
- **loan_type**: Name of the loan type (e.g., "Personal Loan", "Housing Loan", "Vehicle Loan")
- **interest_rate**: Interest rate as a percentage (e.g., 5.50 for 5.5%)
- **max_amount**: Maximum loan amount allowed for this type
- **max_tenure_months**: Maximum tenure in months for this loan type
- **is_active**: Flag to indicate if the loan type is active (1 = active, 0 = inactive)
- **companyId**: Company identifier for multi-tenant support
- **created_at**: Timestamp when the record was created
- **updated_at**: Timestamp when the record was last updated

## Error Responses

### 404 Not Found
```json
{
  "message": "Loan type not found"
}
```

### 400 Bad Request
```json
{
  "error": "Cannot delete loan type as it is being used by existing loans"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message details"
}
```

## Usage Examples

### Creating a Personal Loan Type
```javascript
const response = await fetch('/api/loan-types', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    loan_type: "Personal Loan",
    interest_rate: "5.50",
    max_amount: "100000.00",
    max_tenure_months: 60,
    is_active: 1,
    companyId: "COMP001"
  })
});
```

### Creating a Housing Loan Type
```javascript
const response = await fetch('/api/loan-types', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    loan_type: "Housing Loan",
    interest_rate: "4.25",
    max_amount: "5000000.00",
    max_tenure_months: 240,
    is_active: 1,
    companyId: "COMP001"
  })
});
```

### Creating a Vehicle Loan Type
```javascript
const response = await fetch('/api/loan-types', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    loan_type: "Vehicle Loan",
    interest_rate: "6.75",
    max_amount: "2000000.00",
    max_tenure_months: 84,
    is_active: 1,
    companyId: "COMP001"
  })
});
```

### Creating an Advance Type (No Interest)
```javascript
const response = await fetch('/api/loan-types', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    loan_type: "Salary Advance",
    interest_rate: "0.00",
    max_amount: "50000.00",
    max_tenure_months: 12,
    is_active: 1,
    companyId: "COMP001"
  })
});
```

### Getting Active Loan Types
```javascript
const response = await fetch('/api/loan-types/active/all');
const activeLoanTypes = await response.json();
```

### Toggling Loan Type Status
```javascript
const response = await fetch('/api/loan-types/1/toggle-status', {
  method: 'PUT'
});
const result = await response.json();
```

## Common Loan Type Examples

Here are some common loan types you might want to create:

### 1. Personal Loan
- **Interest Rate**: 5.50% - 8.00%
- **Max Amount**: 100,000 - 500,000
- **Max Tenure**: 36 - 60 months

### 2. Housing Loan
- **Interest Rate**: 4.00% - 6.00%
- **Max Amount**: 5,000,000 - 50,000,000
- **Max Tenure**: 180 - 300 months

### 3. Vehicle Loan
- **Interest Rate**: 6.00% - 9.00%
- **Max Amount**: 1,000,000 - 5,000,000
- **Max Tenure**: 48 - 84 months

### 4. Education Loan
- **Interest Rate**: 3.50% - 5.50%
- **Max Amount**: 500,000 - 2,000,000
- **Max Tenure**: 60 - 120 months

### 5. Salary Advance
- **Interest Rate**: 0.00%
- **Max Amount**: 25,000 - 100,000
- **Max Tenure**: 6 - 12 months

### 6. Emergency Loan
- **Interest Rate**: 2.00% - 4.00%
- **Max Amount**: 50,000 - 200,000
- **Max Tenure**: 12 - 24 months

## Notes

1. Interest rates are stored as decimal values (e.g., 5.50 for 5.5%)
2. Maximum amounts should be realistic based on company policies
3. Tenure is specified in months for easier calculation
4. The `is_active` flag allows you to disable loan types without deleting them
5. Loan types cannot be deleted if they are being used by existing loans
6. The system supports multi-tenant architecture through the `companyId` field
7. All timestamps are automatically managed by the database 
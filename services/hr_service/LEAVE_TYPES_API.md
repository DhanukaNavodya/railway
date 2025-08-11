# Leave Types API Documentation

This document describes the API endpoints for managing leave types in the HR system.

## Base URL
```
http://localhost:5000/api/leave-types
```

## Database Schema
```sql
CREATE TABLE IF NOT EXISTS hr_leave_type (
    id INT PRIMARY KEY AUTO_INCREMENT,
    leave_type_name VARCHAR(255) NOT NULL,           
    days_allowed INT NOT NULL,                       
    payment_type VARCHAR(255), 
    carry_forward VARCHAR(255),     
    carry_forward_days INT DEFAULT 0,                 
    companyId VARCHAR(255),                           
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### 1. Get All Leave Types
**GET** `/api/leave-types`

Returns all leave types in the system.

**Response:**
```json
[
  {
    "id": 1,
    "leave_type_name": "Annual Leaves",
    "days_allowed": 21,
    "payment_type": "Paid",
    "carry_forward": "Yes",
    "carry_forward_days": 2,
    "companyId": "COMP001",
    "is_active": 1,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### 2. Get Active Leave Types Only
**GET** `/api/leave-types/active`

Returns only active leave types.

**Response:**
```json
[
  {
    "id": 1,
    "leave_type_name": "Annual Leaves",
    "days_allowed": 21,
    "payment_type": "Paid",
    "carry_forward": "Yes",
    "carry_forward_days": 2,
    "companyId": "COMP001",
    "is_active": 1,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### 3. Get Leave Types by Company
**GET** `/api/leave-types/company/:companyId`

Returns leave types for a specific company.

**Parameters:**
- `companyId` (string): Company identifier

**Response:**
```json
[
  {
    "id": 1,
    "leave_type_name": "Annual Leaves",
    "days_allowed": 21,
    "payment_type": "Paid",
    "carry_forward": "Yes",
    "carry_forward_days": 2,
    "companyId": "COMP001",
    "is_active": 1,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### 4. Get Leave Type by ID
**GET** `/api/leave-types/:id`

Returns a specific leave type by its ID.

**Parameters:**
- `id` (integer): Leave type ID

**Response:**
```json
{
  "id": 1,
  "leave_type_name": "Annual Leaves",
  "days_allowed": 21,
  "payment_type": "Paid",
  "carry_forward": "Yes",
  "carry_forward_days": 2,
  "companyId": "COMP001",
  "is_active": 1,
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

### 5. Create New Leave Type
**POST** `/api/leave-types`

Creates a new leave type.

**Request Body:**
```json
{
  "leave_type_name": "Annual Leaves",
  "days_allowed": 21,
  "payment_type": "Paid",
  "carry_forward": "Yes",
  "carry_forward_days": 2,
  "companyId": "COMP001",
  "is_active": 1
}
```

**Required Fields:**
- `leave_type_name` (string): Name of the leave type
- `days_allowed` (integer): Number of days allowed for this leave type

**Optional Fields:**
- `payment_type` (string): "Paid", "Unpaid", or "Partial"
- `carry_forward` (string): "Yes" or "No"
- `carry_forward_days` (integer): Number of days that can be carried forward (default: 0)
- `companyId` (string): Company identifier
- `is_active` (integer): 1 for active, 0 for inactive (default: 1)

**Response:**
```json
{
  "id": 1,
  "message": "Leave type created successfully"
}
```

### 6. Update Leave Type
**PUT** `/api/leave-types/:id`

Updates an existing leave type.

**Parameters:**
- `id` (integer): Leave type ID

**Request Body:**
```json
{
  "leave_type_name": "Annual Leaves Updated",
  "days_allowed": 25,
  "payment_type": "Paid",
  "carry_forward": "Yes",
  "carry_forward_days": 3,
  "companyId": "COMP001",
  "is_active": 1
}
```

**Response:**
```json
{
  "message": "Leave type updated successfully",
  "affectedRows": 1
}
```

### 7. Delete Leave Type
**DELETE** `/api/leave-types/:id`

Deletes a leave type.

**Parameters:**
- `id` (integer): Leave type ID

**Response:**
```json
{
  "message": "Leave type deleted successfully",
  "affectedRows": 1
}
```

### 8. Change Leave Type Status
**PUT** `/api/leave-types/status/:id`

Changes the active status of a leave type.

**Parameters:**
- `id` (integer): Leave type ID

**Request Body:**
```json
{
  "isActive": 0
}
```

**Response:**
```json
{
  "message": "Leave type status changed successfully",
  "affectedRows": 1
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Leave type name already exists"
}
```

### 404 Not Found
```json
{
  "message": "Leave type not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Database connection error"
}
```

## Frontend Integration Examples

### React/JavaScript Example

```javascript
// Get all leave types
const getLeaveTypes = async () => {
  try {
    const response = await fetch('/api/leave-types');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching leave types:', error);
  }
};

// Create new leave type
const createLeaveType = async (leaveTypeData) => {
  try {
    const response = await fetch('/api/leave-types', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leaveTypeData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating leave type:', error);
  }
};

// Update leave type
const updateLeaveType = async (id, leaveTypeData) => {
  try {
    const response = await fetch(`/api/leave-types/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leaveTypeData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating leave type:', error);
  }
};

// Delete leave type
const deleteLeaveType = async (id) => {
  try {
    const response = await fetch(`/api/leave-types/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting leave type:', error);
  }
};
```

## Usage Notes

1. **Payment Types**: Common values include "Paid", "Unpaid", "Partial"
2. **Carry Forward**: Use "Yes" or "No" as string values
3. **Company ID**: Use a consistent identifier for your company
4. **Active Status**: Use 1 for active, 0 for inactive
5. **Validation**: The API validates required fields and handles duplicate names
6. **Timestamps**: Created and updated timestamps are automatically managed

## Testing with cURL

```bash
# Get all leave types
curl -X GET http://localhost:5000/api/leave-types

# Create a new leave type
curl -X POST http://localhost:5000/api/leave-types \
  -H "Content-Type: application/json" \
  -d '{
    "leave_type_name": "Sick Leave",
    "days_allowed": 10,
    "payment_type": "Paid",
    "carry_forward": "No",
    "companyId": "COMP001"
  }'

# Update a leave type
curl -X PUT http://localhost:5000/api/leave-types/1 \
  -H "Content-Type: application/json" \
  -d '{
    "leave_type_name": "Annual Leave",
    "days_allowed": 25,
    "payment_type": "Paid",
    "carry_forward": "Yes",
    "carry_forward_days": 5,
    "companyId": "COMP001"
  }'

# Delete a leave type
curl -X DELETE http://localhost:5000/api/leave-types/1
``` 
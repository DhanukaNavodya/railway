# Leave Summary API Documentation

This document describes the new API endpoints for getting comprehensive leave summaries with employee details and leave counts.

## Base URL
```
http://localhost:5000/api/leave-types
```

## New Summary Endpoints

### 1. Get All Leave Types with Employee Leave Counts
**GET** `/api/leave-types/summary/employee-counts`

Returns all leave types along with detailed employee leave counts for each leave type.

**Query Parameters:**
- `companyId` (optional): Filter by company ID

**Response:**
```json
{
  "leave_types": [
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
  ],
  "employee_summary": [
    {
      "employee_id": 1,
      "employee_name": "John Smith",
      "employee_code": "EMP001",
      "department_name": "Management",
      "leave_types": [
        {
          "leave_type_id": 1,
          "leave_type_name": "Annual Leaves",
          "days_allowed": 21,
          "days_taken": 3,
          "days_remaining": 18,
          "payment_type": "Paid",
          "carry_forward": "Yes",
          "carry_forward_days": 2
        },
        {
          "leave_type_id": 2,
          "leave_type_name": "Sick Leaves",
          "days_allowed": 10,
          "days_taken": 2,
          "days_remaining": 8,
          "payment_type": "Paid",
          "carry_forward": "No",
          "carry_forward_days": 0
        }
      ]
    }
  ],
  "total_employees": 25,
  "total_leave_types": 4
}
```

### 2. Get Employee Leave Summary by Employee ID
**GET** `/api/leave-types/summary/employee/:employeeId`

Returns detailed leave summary for a specific employee.

**Parameters:**
- `employeeId` (integer): Employee ID

**Response:**
```json
{
  "employee": {
    "employee_id": 1,
    "employee_name": "John Smith",
    "employee_code": "EMP001",
    "department_name": "Management"
  },
  "leave_summary": [
    {
      "leave_type_id": 1,
      "leave_type_name": "Annual Leaves",
      "days_allowed": 21,
      "days_taken": 3,
      "days_remaining": 18,
      "payment_type": "Paid",
      "carry_forward": "Yes",
      "carry_forward_days": 2
    },
    {
      "leave_type_id": 2,
      "leave_type_name": "Sick Leaves",
      "days_allowed": 10,
      "days_taken": 2,
      "days_remaining": 8,
      "payment_type": "Paid",
      "carry_forward": "No",
      "carry_forward_days": 0
    }
  ]
}
```

### 3. Get Department-wise Leave Summary
**GET** `/api/leave-types/summary/department`

Returns leave summary grouped by departments.

**Query Parameters:**
- `companyId` (optional): Filter by company ID

**Response:**
```json
[
  {
    "department_id": 1,
    "department_name": "Management",
    "total_employees": 5,
    "leave_types": [
      {
        "leave_type_name": "Annual Leaves",
        "days_allowed": 21,
        "total_days_taken": 15,
        "average_days_per_employee": "3.00"
      },
      {
        "leave_type_name": "Sick Leaves",
        "days_allowed": 10,
        "total_days_taken": 8,
        "average_days_per_employee": "1.60"
      }
    ]
  },
  {
    "department_id": 2,
    "department_name": "Sales",
    "total_employees": 10,
    "leave_types": [
      {
        "leave_type_name": "Annual Leaves",
        "days_allowed": 21,
        "total_days_taken": 45,
        "average_days_per_employee": "4.50"
      }
    ]
  }
]
```

## Usage Examples

### Frontend Integration Example

```javascript
// Get comprehensive leave summary for all employees
const getLeaveSummary = async () => {
  try {
    const response = await fetch('/api/leave-types/summary/employee-counts');
    const data = await response.json();
    
    // Process the data for display
    data.employee_summary.forEach(employee => {
      console.log(`Employee: ${employee.employee_name}`);
      employee.leave_types.forEach(leaveType => {
        console.log(`  ${leaveType.leave_type_name}: ${leaveType.days_taken}/${leaveType.days_allowed}`);
      });
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching leave summary:', error);
  }
};

// Get leave summary for specific employee
const getEmployeeLeaveSummary = async (employeeId) => {
  try {
    const response = await fetch(`/api/leave-types/summary/employee/${employeeId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching employee leave summary:', error);
  }
};

// Get department-wise summary
const getDepartmentSummary = async () => {
  try {
    const response = await fetch('/api/leave-types/summary/department');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching department summary:', error);
  }
};
```

### React Component Example

```jsx
import React, { useState, useEffect } from 'react';

const LeaveSummaryTable = () => {
  const [leaveData, setLeaveData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveSummary();
  }, []);

  const fetchLeaveSummary = async () => {
    try {
      const response = await fetch('/api/leave-types/summary/employee-counts');
      const data = await response.json();
      setLeaveData(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!leaveData) return <div>No data available</div>;

  return (
    <div className="leave-summary-table">
      <h2>Employee Leave Summary</h2>
      <table>
        <thead>
          <tr>
            <th>EMPLOYEE</th>
            <th>DEPARTMENT</th>
            {leaveData.leave_types.map(leaveType => (
              <th key={leaveType.id}>{leaveType.leave_type_name.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leaveData.employee_summary.map(employee => (
            <tr key={employee.employee_id}>
              <td>{employee.employee_name}</td>
              <td>{employee.department_name}</td>
              {employee.leave_types.map(leaveType => (
                <td key={leaveType.leave_type_id}>
                  {leaveType.days_taken}/{leaveType.days_allowed}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveSummaryTable;
```

## Testing with Postman

### 1. Get All Leave Types with Employee Counts
```
GET http://localhost:5000/api/leave-types/summary/employee-counts
```

### 2. Get Employee Leave Summary
```
GET http://localhost:5000/api/leave-types/summary/employee/1
```

### 3. Get Department Summary
```
GET http://localhost:5000/api/leave-types/summary/department
```

### 4. With Company Filter
```
GET http://localhost:5000/api/leave-types/summary/employee-counts?companyId=COMP001
```

## Data Structure

### Employee Summary Object
```typescript
interface EmployeeSummary {
  employee_id: number;
  employee_name: string;
  employee_code: string;
  department_name: string;
  leave_types: LeaveTypeSummary[];
}

interface LeaveTypeSummary {
  leave_type_id: number;
  leave_type_name: string;
  days_allowed: number;
  days_taken: number;
  days_remaining: number;
  payment_type: string;
  carry_forward: string;
  carry_forward_days: number;
}
```

### Department Summary Object
```typescript
interface DepartmentSummary {
  department_id: number;
  department_name: string;
  total_employees: number;
  leave_types: DepartmentLeaveType[];
}

interface DepartmentLeaveType {
  leave_type_name: string;
  days_allowed: number;
  total_days_taken: number;
  average_days_per_employee: string;
}
```

## Performance Notes

- The employee counts endpoint may take longer to load with many employees
- Consider implementing pagination for large datasets
- Database indexes on `employee_id`, `leave_type`, and `status` fields are recommended
- Consider caching for frequently accessed data

## Error Handling

### 404 Not Found
```json
{
  "message": "Employee not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Database connection error"
}
```

## Business Logic

- Only **Approved** leaves are counted in the summary
- Only **Active** employees are included
- Only **Active** leave types are considered
- Days remaining = Days allowed - Days taken
- Department summary includes average days per employee 
# Leave Types Management System

This module provides a complete API for managing leave types in the HR system, matching the frontend interface shown in the image.

## Features

- ✅ Create, Read, Update, Delete (CRUD) operations for leave types
- ✅ Active/Inactive status management
- ✅ Company-specific leave types
- ✅ Carry forward functionality
- ✅ Payment type classification (Paid/Unpaid/Partial)
- ✅ Comprehensive API documentation
- ✅ Error handling and validation
- ✅ Test suite for API endpoints

## Database Setup

First, create the required database table:

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

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leave-types` | Get all leave types |
| GET | `/api/leave-types/active` | Get active leave types only |
| GET | `/api/leave-types/company/:companyId` | Get leave types by company |
| GET | `/api/leave-types/:id` | Get leave type by ID |
| POST | `/api/leave-types` | Create new leave type |
| PUT | `/api/leave-types/:id` | Update leave type |
| DELETE | `/api/leave-types/:id` | Delete leave type |
| PUT | `/api/leave-types/status/:id` | Change leave type status |

## Quick Start

### 1. Start the Server

```bash
npm start
# or
node index.js
```

### 2. Test the API

```bash
# Run the test suite
node test-leave-types.js
```

### 3. Create Sample Data

```bash
# Create Annual Leave
curl -X POST http://localhost:5000/api/leave-types \
  -H "Content-Type: application/json" \
  -d '{
    "leave_type_name": "Annual Leaves",
    "days_allowed": 21,
    "payment_type": "Paid",
    "carry_forward": "Yes",
    "carry_forward_days": 2,
    "companyId": "COMP001"
  }'

# Create Sick Leave
curl -X POST http://localhost:5000/api/leave-types \
  -H "Content-Type: application/json" \
  -d '{
    "leave_type_name": "Sick Leaves",
    "days_allowed": 10,
    "payment_type": "Paid",
    "carry_forward": "No",
    "companyId": "COMP001"
  }'

# Create Personal Leave
curl -X POST http://localhost:5000/api/leave-types \
  -H "Content-Type: application/json" \
  -d '{
    "leave_type_name": "Personal Leaves",
    "days_allowed": 5,
    "payment_type": "Unpaid",
    "carry_forward": "No",
    "companyId": "COMP001"
  }'
```

## Frontend Integration

### React Component Example

```jsx
import React, { useState, useEffect } from 'react';

const LeaveTypesManager = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    leave_type_name: '',
    days_allowed: '',
    payment_type: 'Paid',
    carry_forward: 'No',
    carry_forward_days: 0,
    companyId: 'COMP001'
  });

  // Fetch leave types
  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const response = await fetch('/api/leave-types');
      const data = await response.json();
      setLeaveTypes(data);
    } catch (error) {
      console.error('Error fetching leave types:', error);
    }
  };

  // Create leave type
  const createLeaveType = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/leave-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setShowModal(false);
        setFormData({
          leave_type_name: '',
          days_allowed: '',
          payment_type: 'Paid',
          carry_forward: 'No',
          carry_forward_days: 0,
          companyId: 'COMP001'
        });
        fetchLeaveTypes();
      }
    } catch (error) {
      console.error('Error creating leave type:', error);
    }
  };

  // Delete leave type
  const deleteLeaveType = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave type?')) {
      try {
        const response = await fetch(`/api/leave-types/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          fetchLeaveTypes();
        }
      } catch (error) {
        console.error('Error deleting leave type:', error);
      }
    }
  };

  return (
    <div className="leave-types-manager">
      <div className="header">
        <h2>Leave Types & Settings</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          + New Leave Type
        </button>
      </div>

      <div className="leave-types-list">
        <table>
          <thead>
            <tr>
              <th>LEAVE TYPE</th>
              <th>CARRY FORWARD</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {leaveTypes.map((leaveType) => (
              <tr key={leaveType.id}>
                <td>{leaveType.leave_type_name}</td>
                <td>
                  {leaveType.carry_forward === 'Yes' 
                    ? `Yes (< ${leaveType.carry_forward_days} Days)`
                    : 'No'
                  }
                </td>
                <td>
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(leaveType)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => deleteLeaveType(leaveType.id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Leave Type</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={createLeaveType}>
              <div className="form-group">
                <label>Leave Type Name*</label>
                <input
                  type="text"
                  placeholder="e.g., Annual Leave, Sick Leave"
                  value={formData.leave_type_name}
                  onChange={(e) => setFormData({
                    ...formData,
                    leave_type_name: e.target.value
                  })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Days Allowed*</label>
                <input
                  type="number"
                  placeholder="Enter number of days"
                  value={formData.days_allowed}
                  onChange={(e) => setFormData({
                    ...formData,
                    days_allowed: parseInt(e.target.value)
                  })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Payment Type</label>
                <select
                  value={formData.payment_type}
                  onChange={(e) => setFormData({
                    ...formData,
                    payment_type: e.target.value
                  })}
                >
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Carry Forward</label>
                <select
                  value={formData.carry_forward}
                  onChange={(e) => setFormData({
                    ...formData,
                    carry_forward: e.target.value
                  })}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              
              {formData.carry_forward === 'Yes' && (
                <div className="form-group">
                  <label>Carry Forward Days</label>
                  <input
                    type="number"
                    value={formData.carry_forward_days}
                    onChange={(e) => setFormData({
                      ...formData,
                      carry_forward_days: parseInt(e.target.value)
                    })}
                  />
                </div>
              )}
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Leave Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveTypesManager;
```

## File Structure

```
sparkle-hr-backend/
├── services/
│   └── leaveType.service.js      # Business logic for leave types
├── controllers/
│   └── leaveType.controller.js   # HTTP request handlers
├── routes/
│   └── leaveType.routes.js       # API route definitions
├── index.js                      # Main server file (updated)
├── LEAVE_TYPES_API.md           # Complete API documentation
├── test-leave-types.js          # Test suite
└── README_LEAVE_TYPES.md        # This file
```

## Configuration

The system uses the existing database configuration from `config/db.js`. Make sure your database connection is properly configured.

## Testing

Run the comprehensive test suite:

```bash
node test-leave-types.js
```

This will test all CRUD operations and verify the API is working correctly.

## Error Handling

The API includes comprehensive error handling for:

- Database connection errors
- Duplicate leave type names
- Invalid data formats
- Missing required fields
- Non-existent records

## Security Considerations

- Input validation for all fields
- SQL injection prevention through parameterized queries
- CORS configuration for frontend integration
- Error messages that don't expose sensitive information

## Performance

- Optimized database queries
- Proper indexing on frequently queried fields
- Efficient pagination support (can be extended)
- Connection pooling through the existing database configuration

## Future Enhancements

- Bulk operations for multiple leave types
- Advanced filtering and search capabilities
- Audit logging for changes
- Role-based access control
- API rate limiting
- Caching layer for frequently accessed data

## Support

For issues or questions about the leave types system, refer to:
- `LEAVE_TYPES_API.md` for detailed API documentation
- `test-leave-types.js` for usage examples
- Database schema in this README for data structure 
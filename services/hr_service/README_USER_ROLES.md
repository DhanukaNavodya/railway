# User Roles API - Setup and Usage Guide

This guide explains how to set up and use the User Roles API for managing permissions and access control in your HR system.

## 🚀 Quick Start

### 1. Database Setup

First, run the database setup script to create the required tables:

```sql
-- Run this in your MySQL database
source database_setup.sql
```

Or manually execute the SQL commands from `database_setup.sql`.

### 2. Start the Server

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev

# Or start the production server
npm start
```

The server will run on `http://localhost:5000`

### 3. Test the API

Run the test file to verify everything works:

```bash
# In browser console or Node.js
node test_user_roles.js
```

## 📋 API Endpoints

### Base URL: `http://localhost:5000/api/user-roles`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all user roles |
| GET | `/:id` | Get user role by ID |
| POST | `/` | Create new user role |
| PUT | `/:id` | Update user role |
| DELETE | `/:id` | Delete user role |
| PUT | `/status/:id` | Change role status |
| GET | `/permissions/all` | Get all permissions |
| GET | `/permissions/module/:moduleName` | Get permissions by module |

## 🔧 Frontend Integration

### Update your React component to use the real API:

```javascript
// Replace the TODO in your AddUserRole component
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.roleName.trim()) {
    toast.error('Please enter a role name');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/user-roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roleName: formData.roleName,
        description: formData.note,
        isActive: formData.isActive,
        otRate: formData.otRate,
        note: formData.note,
        permissions: formData.permissions,
        workingHours: formData.workingHours.map(shift => ({
          shift_name: `Shift ${shift.id}`,
          startTime: shift.startTime,
          endTime: shift.endTime
        }))
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create user role');
    }
    
    const result = await response.json();
    toast.success('User role created successfully!');
    navigate('/settings');
    
  } catch (error) {
    console.error('Error creating user role:', error);
    toast.error(error.message || 'Failed to create user role');
  }
};
```

### Example API calls:

```javascript
// Get all roles
const getAllRoles = async () => {
  const response = await fetch('http://localhost:5000/api/user-roles');
  return await response.json();
};

// Get role by ID
const getRoleById = async (id) => {
  const response = await fetch(`http://localhost:5000/api/user-roles/${id}`);
  return await response.json();
};

// Update role
const updateRole = async (id, roleData) => {
  const response = await fetch(`http://localhost:5000/api/user-roles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(roleData)
  });
  return await response.json();
};

// Delete role
const deleteRole = async (id) => {
  const response = await fetch(`http://localhost:5000/api/user-roles/${id}`, {
    method: 'DELETE'
  });
  return await response.json();
};
```

## 🗄️ Database Schema

### Tables Overview

1. **user_roles** - Main role information
2. **working_hours** - Shift schedules for each role
3. **permissions** - Available permissions in the system
4. **role_permissions** - Junction table linking roles to permissions

### Sample Data Structure

```json
{
  "id": 1,
  "role_name": "Manager",
  "description": "Department manager role",
  "is_active": true,
  "ot_rate": "150.00",
  "note": "Manager role with limited permissions",
  "permissions": [
    {
      "module_name": "employeesManagement",
      "permission_type": "view",
      "is_granted": true
    }
  ],
  "workingHours": [
    {
      "id": 1,
      "shift_name": "Morning Shift",
      "start_time": "08:00:00",
      "end_time": "17:00:00"
    }
  ]
}
```

## 🔐 Permission System

### Available Modules

1. **employeesManagement** - Employee management
2. **attendanceManagement** - Attendance tracking
3. **leavesManagement** - Leave management
4. **payrollManagement** - Payroll processing
5. **performanceManagement** - Performance reviews
6. **loanAdvancedManagement** - Loan and advance management
7. **reportManagement** - Report generation
8. **settings** - System settings

### Permission Types

- **view** - Can view data
- **create** - Can create new records
- **edit** - Can modify existing records
- **delete** - Can delete records
- **approve** - Can approve/reject requests

## 🧪 Testing

### Manual Testing

1. **Create a role:**
```bash
curl -X POST http://localhost:5000/api/user-roles \
  -H "Content-Type: application/json" \
  -d '{
    "roleName": "Test Role",
    "description": "Test description",
    "isActive": true,
    "otRate": "100.00",
    "permissions": {
      "employeesManagement": {
        "view": true,
        "create": true,
        "edit": false,
        "delete": false,
        "approve": false
      }
    },
    "workingHours": [
      {
        "shift_name": "Morning",
        "startTime": "08:00",
        "endTime": "17:00"
      }
    ]
  }'
```

2. **Get all roles:**
```bash
curl http://localhost:5000/api/user-roles
```

3. **Update a role:**
```bash
curl -X PUT http://localhost:5000/api/user-roles/1 \
  -H "Content-Type: application/json" \
  -d '{"roleName": "Updated Role"}'
```

### Automated Testing

Run the test suite:

```bash
node test_user_roles.js
```

## 🚨 Error Handling

### Common Errors

1. **Duplicate Role Name:**
```json
{
  "error": "Role name already exists"
}
```

2. **Role Not Found:**
```json
{
  "message": "User role not found"
}
```

3. **Database Error:**
```json
{
  "error": "Database connection failed"
}
```

### Error Handling in Frontend

```javascript
try {
  const response = await fetch('/api/user-roles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(roleData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Request failed');
  }
  
  const result = await response.json();
  // Handle success
  
} catch (error) {
  // Handle error
  console.error('API Error:', error.message);
  toast.error(error.message);
}
```

## 🔄 Data Flow

1. **Frontend** sends role data to API
2. **API** validates data and starts database transaction
3. **Database** creates role, permissions, and working hours
4. **API** returns success/error response
5. **Frontend** handles response and updates UI

## 📝 Notes

- All create/update operations use database transactions
- Role names must be unique
- Permissions are automatically created if they don't exist
- Working hours use 24-hour format (HH:MM)
- Cascade deletes remove related data when a role is deleted

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check your `.env` file configuration
   - Verify MySQL server is running
   - Check database credentials

2. **CORS Errors**
   - Ensure your frontend URL is in the allowed origins list
   - Check the CORS configuration in `index.js`

3. **Permission Denied**
   - Verify database user has proper permissions
   - Check table creation was successful

4. **Port Already in Use**
   - Change the port in `index.js` or kill the existing process
   - Use `lsof -i :5000` to find the process using port 5000

### Debug Mode

Enable debug logging by adding to your `.env`:

```env
DEBUG=true
NODE_ENV=development
```

## 📞 Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify database tables are created correctly
3. Test API endpoints manually with curl or Postman
4. Check the test file output for specific errors

## 🔄 Updates and Maintenance

- Regularly backup your database
- Monitor API performance
- Update permissions as new modules are added
- Review and clean up unused roles periodically 
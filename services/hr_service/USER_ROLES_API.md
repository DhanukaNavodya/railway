# User Roles API Documentation

This API provides endpoints for managing user roles, permissions, and working hours in the HR system.

## Base URL
```
http://localhost:5000/api/user-roles
```

## Database Schema

### Tables Structure

#### 1. user_roles
```sql
CREATE TABLE user_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    ot_rate DECIMAL(10,2) DEFAULT 100.00,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. working_hours
```sql
CREATE TABLE working_hours (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT NOT NULL,
    shift_name VARCHAR(50) DEFAULT 'Shift',
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE CASCADE
);
```

#### 3. permissions
```sql
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    module_name VARCHAR(100) NOT NULL,
    permission_type ENUM('view', 'create', 'edit', 'delete', 'approve') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_module_permission (module_name, permission_type)
);
```

#### 4. role_permissions
```sql
CREATE TABLE role_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    is_granted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_id, permission_id)
);
```

## API Endpoints

### 1. Get All User Roles
**GET** `/api/user-roles`

Returns all user roles with their permissions and working hours.

**Response:**
```json
[
  {
    "id": 1,
    "role_name": "Admin",
    "description": "Full system access",
    "is_active": true,
    "ot_rate": "100.00",
    "note": "Administrator role",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
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
        "role_id": 1,
        "shift_name": "Morning Shift",
        "start_time": "08:00:00",
        "end_time": "17:00:00",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
]
```

### 2. Get User Role by ID
**GET** `/api/user-roles/:id`

Returns a specific user role by ID.

**Response:**
```json
{
  "id": 1,
  "role_name": "Admin",
  "description": "Full system access",
  "is_active": true,
  "ot_rate": "100.00",
  "note": "Administrator role",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "permissions": [...],
  "workingHours": [...]
}
```

### 3. Create New User Role
**POST** `/api/user-roles`

Creates a new user role with permissions and working hours.

**Request Body:**
```json
{
  "roleName": "Manager",
  "description": "Department manager role",
  "isActive": true,
  "otRate": "150.00",
  "note": "Manager role with limited permissions",
  "permissions": {
    "employeesManagement": {
      "view": true,
      "create": true,
      "edit": true,
      "delete": false,
      "approve": true
    },
    "attendanceManagement": {
      "view": true,
      "create": false,
      "edit": false,
      "delete": false,
      "approve": true
    }
  },
  "workingHours": [
    {
      "shift_name": "Morning Shift",
      "startTime": "08:00",
      "endTime": "17:00"
    },
    {
      "shift_name": "Evening Shift",
      "startTime": "17:00",
      "endTime": "02:00"
    }
  ]
}
```

**Response:**
```json
{
  "id": 2,
  "message": "User role created successfully"
}
```

### 4. Update User Role
**PUT** `/api/user-roles/:id`

Updates an existing user role.

**Request Body:** (Same as create)

**Response:**
```json
{
  "message": "User role updated successfully",
  "affectedRows": 1
}
```

### 5. Delete User Role
**DELETE** `/api/user-roles/:id`

Deletes a user role and all associated permissions and working hours.

**Response:**
```json
{
  "message": "User role deleted successfully",
  "affectedRows": 1
}
```

### 6. Change User Role Status
**PUT** `/api/user-roles/status/:id`

Changes the active status of a user role.

**Request Body:**
```json
{
  "isActive": false
}
```

**Response:**
```json
{
  "message": "User role status changed successfully",
  "affectedRows": 1
}
```

### 7. Get All Permissions
**GET** `/api/user-roles/permissions/all`

Returns all available permissions in the system.

**Response:**
```json
[
  {
    "id": 1,
    "module_name": "employeesManagement",
    "permission_type": "view",
    "description": "view permission for employeesManagement",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### 8. Get Permissions by Module
**GET** `/api/user-roles/permissions/module/:moduleName`

Returns all permissions for a specific module.

**Response:**
```json
[
  {
    "id": 1,
    "module_name": "employeesManagement",
    "permission_type": "view",
    "description": "view permission for employeesManagement",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

## Available Modules

The system supports the following modules for permissions:

1. **employeesManagement** - Employee management
2. **attendanceManagement** - Attendance tracking
3. **leavesManagement** - Leave management
4. **payrollManagement** - Payroll processing
5. **performanceManagement** - Performance reviews
6. **loanAdvancedManagement** - Loan and advance management
7. **reportManagement** - Report generation
8. **settings** - System settings

## Available Permission Types

Each module supports these permission types:

- **view** - Can view data
- **create** - Can create new records
- **edit** - Can modify existing records
- **delete** - Can delete records
- **approve** - Can approve/reject requests

## Error Responses

### 400 Bad Request
```json
{
  "error": "Role name already exists"
}
```

### 404 Not Found
```json
{
  "message": "User role not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Database connection failed"
}
```

## Frontend Integration

### Example API Call (Create Role)
```javascript
const createUserRole = async (roleData) => {
  try {
    const response = await fetch('http://localhost:5000/api/user-roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user role');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating user role:', error);
    throw error;
  }
};
```

### Example API Call (Get All Roles)
```javascript
const getAllUserRoles = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/user-roles');
    
    if (!response.ok) {
      throw new Error('Failed to fetch user roles');
    }
    
    const roles = await response.json();
    return roles;
  } catch (error) {
    console.error('Error fetching user roles:', error);
    throw error;
  }
};
```

## Notes

1. **Transactions**: All create and update operations use database transactions to ensure data consistency.
2. **Cascade Deletes**: When a user role is deleted, all associated working hours and role permissions are automatically deleted.
3. **Unique Constraints**: Role names must be unique across the system.
4. **Permission Management**: Permissions are automatically created if they don't exist when assigned to a role.
5. **Time Format**: Working hours should be provided in 24-hour format (HH:MM). 
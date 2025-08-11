// User Management Controller - Handles user operations and role management

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    // Mock users data
    const users = [
      { id: 1, username: 'admin', email: 'admin@sparkle.com', role: 'admin', status: 'active', created_at: new Date().toISOString() },
      { id: 2, username: 'hr_manager', email: 'hr@sparkle.com', role: 'hr_manager', status: 'active', created_at: new Date().toISOString() },
      { id: 3, username: 'employee1', email: 'emp1@sparkle.com', role: 'employee', status: 'active', created_at: new Date().toISOString() }
    ];

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: users.length,
          pages: Math.ceil(users.length / parseInt(limit))
        }
      },
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users',
      message: error.message
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock user data
    const user = {
      id: parseInt(id),
      username: 'admin',
      email: 'admin@sparkle.com',
      role: 'admin',
      status: 'active',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      permissions: ['read', 'write', 'delete']
    };

    res.json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user',
      message: error.message
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const userData = req.body;
    
    // Mock user creation
    const newUser = {
      id: Date.now(),
      ...userData,
      status: 'active',
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      message: error.message
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Mock user update
    const updatedUser = {
      id: parseInt(id),
      ...updateData,
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error.message
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      message: `User with ID ${id} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      message: error.message
    });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const roles = [
      { id: 1, name: 'admin', description: 'System Administrator', permissions: ['all'] },
      { id: 2, name: 'hr_manager', description: 'HR Manager', permissions: ['hr_read', 'hr_write'] },
      { id: 3, name: 'employee', description: 'Regular Employee', permissions: ['self_read'] }
    ];

    res.json({
      success: true,
      data: roles,
      message: 'Roles retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting roles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve roles',
      message: error.message
    });
  }
};

export const createRole = async (req, res) => {
  try {
    const roleData = req.body;
    
    const newRole = {
      id: Date.now(),
      ...roleData,
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: newRole,
      message: 'Role created successfully'
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create role',
      message: error.message
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedRole = {
      id: parseInt(id),
      ...updateData,
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      data: updatedRole,
      message: 'Role updated successfully'
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update role',
      message: error.message
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      message: `Role with ID ${id} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete role',
      message: error.message
    });
  }
};

export const getAllPermissions = async (req, res) => {
  try {
    const permissions = [
      { id: 1, name: 'read', description: 'Read permission' },
      { id: 2, name: 'write', description: 'Write permission' },
      { id: 3, name: 'delete', description: 'Delete permission' },
      { id: 4, name: 'hr_read', description: 'HR read permission' },
      { id: 5, name: 'hr_write', description: 'HR write permission' }
    ];

    res.json({
      success: true,
      data: permissions,
      message: 'Permissions retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting permissions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve permissions',
      message: error.message
    });
  }
};

export const createPermission = async (req, res) => {
  try {
    const permissionData = req.body;
    
    const newPermission = {
      id: Date.now(),
      ...permissionData,
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: newPermission,
      message: 'Permission created successfully'
    });
  } catch (error) {
    console.error('Error creating permission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create permission',
      message: error.message
    });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedPermission = {
      id: parseInt(id),
      ...updateData,
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      data: updatedPermission,
      message: 'Permission updated successfully'
    });
  } catch (error) {
    console.error('Error updating permission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update permission',
      message: error.message
    });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      message: `Permission with ID ${id} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting permission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete permission',
      message: error.message
    });
  }
};

export const activateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      message: `User with ID ${id} activated successfully`
    });
  } catch (error) {
    console.error('Error activating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to activate user',
      message: error.message
    });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      message: `User with ID ${id} deactivated successfully`
    });
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to deactivate user',
      message: error.message
    });
  }
};

export const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      message: `Password reset email sent to user with ID ${id}`
    });
  } catch (error) {
    console.error('Error resetting user password:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset user password',
      message: error.message
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
  getAllPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  activateUser,
  deactivateUser,
  resetUserPassword
};

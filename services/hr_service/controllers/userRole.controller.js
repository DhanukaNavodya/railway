import { 
  getAllUserRolesService, 
  getUserRoleByIdService, 
  createUserRoleService,
  updateUserRoleService,
  deleteUserRoleService,
  changeUserRoleStatusService,
  getAllPermissionsService,
  getPermissionsByModuleService
} from '../services/userRole.service.js';

// Get all user roles
export const getAllUserRoles = async (req, res) => {
  try {
    const roles = await getAllUserRolesService();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user role by ID
export const getUserRoleById = async (req, res) => {
  try {
    const role = await getUserRoleByIdService(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'User role not found' });
    }
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new user role
export const createUserRole = async (req, res) => {
  try {
    const result = await createUserRoleService(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Role name already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const result = await updateUserRoleService(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User role not found' });
    }
    res.json(result);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Role name already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

// Delete user role
export const deleteUserRole = async (req, res) => {
  try {
    const result = await deleteUserRoleService(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User role not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Change user role status
export const changeUserRoleStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const result = await changeUserRoleStatusService(req.params.id, isActive);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all permissions (for reference)
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await getAllPermissionsService();
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get permissions by module
export const getPermissionsByModule = async (req, res) => {
  try {
    const permissions = await getPermissionsByModuleService(req.params.moduleName);
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 
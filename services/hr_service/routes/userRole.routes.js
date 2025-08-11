import express from 'express';
import { 
  getAllUserRoles, 
  getUserRoleById, 
  createUserRole, 
  updateUserRole, 
  deleteUserRole,
  changeUserRoleStatus,
  getAllPermissions,
  getPermissionsByModule
} from '../controllers/userRole.controller.js';

const router = express.Router();

// User Roles routes
router.get('/', getAllUserRoles);
router.get('/:id', getUserRoleById);
router.post('/', createUserRole);
router.put('/:id', updateUserRole);
router.delete('/:id', deleteUserRole);
router.put('/status/:id', changeUserRoleStatus);

// Permissions routes
router.get('/permissions/all', getAllPermissions);
router.get('/permissions/module/:moduleName', getPermissionsByModule);

export default router; 
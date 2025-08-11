import express from 'express';
import userManagementController from '../controllers/userManagement.controller.js';

const router = express.Router();

// User management
router.get('/users', userManagementController.getAllUsers);
router.get('/users/:id', userManagementController.getUserById);
router.post('/users', userManagementController.createUser);
router.put('/users/:id', userManagementController.updateUser);
router.delete('/users/:id', userManagementController.deleteUser);

// User roles and permissions
router.get('/roles', userManagementController.getAllRoles);
router.post('/roles', userManagementController.createRole);
router.put('/roles/:id', userManagementController.updateRole);
router.delete('/roles/:id', userManagementController.deleteRole);

// User permissions
router.get('/permissions', userManagementController.getAllPermissions);
router.post('/permissions', userManagementController.createPermission);
router.put('/permissions/:id', userManagementController.updatePermission);
router.delete('/permissions/:id', userManagementController.deletePermission);

// User status management
router.post('/users/:id/activate', userManagementController.activateUser);
router.post('/users/:id/deactivate', userManagementController.deactivateUser);
router.post('/users/:id/reset-password', userManagementController.resetUserPassword);

export default router;

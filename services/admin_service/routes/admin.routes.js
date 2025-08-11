import express from 'express';
import adminController from '../controllers/admin.controller.js';

const router = express.Router();

// Admin dashboard and overview
router.get('/dashboard', adminController.getDashboard);
router.get('/overview', adminController.getSystemOverview);

// System status and monitoring
router.get('/system-status', adminController.getSystemStatus);
router.get('/service-health', adminController.getServiceHealth);

// Admin actions
router.post('/maintenance-mode', adminController.toggleMaintenanceMode);
router.post('/backup', adminController.createBackup);
router.get('/logs', adminController.getSystemLogs);

// Admin settings
router.get('/settings', adminController.getAdminSettings);
router.put('/settings', adminController.updateAdminSettings);

export default router;

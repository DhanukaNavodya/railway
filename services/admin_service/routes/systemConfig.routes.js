import express from 'express';
import systemConfigController from '../controllers/systemConfig.controller.js';

const router = express.Router();

// System configuration
router.get('/config', systemConfigController.getSystemConfig);
router.put('/config', systemConfigController.updateSystemConfig);

// Database configuration
router.get('/database', systemConfigController.getDatabaseConfig);
router.put('/database', systemConfigController.updateDatabaseConfig);

// Email configuration
router.get('/email', systemConfigController.getEmailConfig);
router.put('/email', systemConfigController.updateEmailConfig);

// Security configuration
router.get('/security', systemConfigController.getSecurityConfig);
router.put('/security', systemConfigController.updateSecurityConfig);

// Backup configuration
router.get('/backup', systemConfigController.getBackupConfig);
router.put('/backup', systemConfigController.updateBackupConfig);

// Cache configuration
router.get('/cache', systemConfigController.getCacheConfig);
router.put('/cache', systemConfigController.updateCacheConfig);

export default router;

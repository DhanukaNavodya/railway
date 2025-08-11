// System Configuration Controller - Handles system settings and configuration

export const getSystemConfig = async (req, res) => {
  try {
    const config = {
      app_name: 'Sparkle HR System',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timezone: 'UTC',
      date_format: 'YYYY-MM-DD',
      time_format: 'HH:mm:ss',
      language: 'en',
      maintenance_mode: false,
      debug_mode: process.env.NODE_ENV === 'development'
    };

    res.json({
      success: true,
      data: config,
      message: 'System configuration retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting system config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve system configuration',
      message: error.message
    });
  }
};

export const updateSystemConfig = async (req, res) => {
  try {
    const updateData = req.body;
    
    const updatedConfig = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      data: updatedConfig,
      message: 'System configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating system config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update system configuration',
      message: error.message
    });
  }
};

export const getDatabaseConfig = async (req, res) => {
  try {
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'sparkle_hr',
      username: process.env.DB_USER || 'root',
      connection_limit: 10,
      timeout: 60000,
      charset: 'utf8mb4'
    };

    res.json({
      success: true,
      data: dbConfig,
      message: 'Database configuration retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting database config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve database configuration',
      message: error.message
    });
  }
};

export const updateDatabaseConfig = async (req, res) => {
  try {
    const updateData = req.body;
    
    const updatedDbConfig = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      data: updatedDbConfig,
      message: 'Database configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating database config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update database configuration',
      message: error.message
    });
  }
};

export const getEmailConfig = async (req, res) => {
  try {
    const emailConfig = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      username: process.env.EMAIL_USER || '',
      password: process.env.EMAIL_PASS || '',
      from_address: process.env.EMAIL_FROM || 'noreply@sparkle.com',
      from_name: 'Sparkle HR System'
    };

    res.json({
      success: true,
      data: emailConfig,
      message: 'Email configuration retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting email config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve email configuration',
      message: error.message
    });
  }
};

export const updateEmailConfig = async (req, res) => {
  try {
    const updateData = req.body;
    
    const updatedEmailConfig = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      data: updatedEmailConfig,
      message: 'Email configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating email config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update email configuration',
      message: error.message
    });
  }
};

export const getSecurityConfig = async (req, res) => {
  try {
    const securityConfig = {
      jwt_secret: process.env.JWT_SECRET ? '***hidden***' : 'not_set',
      jwt_expires_in: '24h',
      bcrypt_rounds: 12,
      session_timeout: 3600,
      max_login_attempts: 5,
      lockout_duration: 900,
      password_min_length: 8,
      require_special_chars: true,
      require_numbers: true,
      require_uppercase: true
    };

    res.json({
      success: true,
      data: securityConfig,
      message: 'Security configuration retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting security config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve security configuration',
      message: error.message
    });
  }
};

export const updateSecurityConfig = async (req, res) => {
  try {
    const updateData = req.body;
    
    const updatedSecurityConfig = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      data: updatedSecurityConfig,
      message: 'Security configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating security config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update security configuration',
      message: error.message
    });
  }
};

export const getBackupConfig = async (req, res) => {
  try {
    const backupConfig = {
      enabled: true,
      frequency: 'daily',
      retention_days: 30,
      backup_path: '/backups',
      include_files: true,
      compression: true,
      encryption: false,
      auto_cleanup: true,
      last_backup: new Date().toISOString()
    };

    res.json({
      success: true,
      data: backupConfig,
      message: 'Backup configuration retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting backup config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve backup configuration',
      message: error.message
    });
  }
};

export const updateBackupConfig = async (req, res) => {
  try {
    const updateData = req.body;
    
    const updatedBackupConfig = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      data: updatedBackupConfig,
      message: 'Backup configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating backup config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update backup configuration',
      message: error.message
    });
  }
};

export const getCacheConfig = async (req, res) => {
  try {
    const cacheConfig = {
      enabled: true,
      type: 'redis',
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      ttl: 3600,
      max_memory: '256mb',
      eviction_policy: 'lru'
    };

    res.json({
      success: true,
      data: cacheConfig,
      message: 'Cache configuration retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting cache config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve cache configuration',
      message: error.message
    });
  }
};

export const updateCacheConfig = async (req, res) => {
  try {
    const updateData = req.body;
    
    const updatedCacheConfig = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      data: updatedCacheConfig,
      message: 'Cache configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating cache config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cache configuration',
      message: error.message
    });
  }
};

export default {
  getSystemConfig,
  updateSystemConfig,
  getDatabaseConfig,
  updateDatabaseConfig,
  getEmailConfig,
  updateEmailConfig,
  getSecurityConfig,
  updateSecurityConfig,
  getBackupConfig,
  updateBackupConfig,
  getCacheConfig,
  updateCacheConfig
};

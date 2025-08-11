import db from '../config/db.js';

// Get all user roles with their permissions and working hours
export const getAllUserRolesService = async () => {
  const [roles] = await db.query(`
    SELECT * FROM user_roles ORDER BY created_at DESC
  `);
  
  // Get permissions for each role
  for (let role of roles) {
    const [permissions] = await db.query(`
      SELECT p.module_name, p.permission_type, rp.is_granted
      FROM role_permissions rp
      JOIN permissions p ON rp.permission_id = p.id
      WHERE rp.role_id = ?
    `, [role.id]);
    
    // Get working hours for each role
    const [workingHours] = await db.query(`
      SELECT * FROM working_hours WHERE role_id = ?
    `, [role.id]);
    
    role.permissions = permissions;
    role.workingHours = workingHours;
  }
  
  return roles;
};

// Get user role by ID with permissions and working hours
export const getUserRoleByIdService = async (id) => {
  const [roles] = await db.query(`
    SELECT * FROM user_roles WHERE id = ?
  `, [id]);
  
  if (roles.length === 0) return null;
  
  const role = roles[0];
  
  // Get permissions
  const [permissions] = await db.query(`
    SELECT p.module_name, p.permission_type, rp.is_granted
    FROM role_permissions rp
    JOIN permissions p ON rp.permission_id = p.id
    WHERE rp.role_id = ?
  `, [id]);
  
  // Get working hours
  const [workingHours] = await db.query(`
    SELECT * FROM working_hours WHERE role_id = ?
  `, [id]);
  
  role.permissions = permissions;
  role.workingHours = workingHours;
  
  return role;
};

// Create user role with permissions and working hours
export const createUserRoleService = async (roleData) => {
  const {
    roleName,
    description,
    isActive,
    otRate,
    note,
    permissions,
    workingHours
  } = roleData;

  // Start transaction
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // Insert user role
    const [roleResult] = await connection.query(`
      INSERT INTO user_roles (role_name, description, is_active, ot_rate, note)
      VALUES (?, ?, ?, ?, ?)
    `, [roleName, description, isActive, otRate, note]);

    const roleId = roleResult.insertId;

    // Insert working hours
    if (workingHours && workingHours.length > 0) {
      for (const shift of workingHours) {
        await connection.query(`
          INSERT INTO working_hours (role_id, shift_name, start_time, end_time)
          VALUES (?, ?, ?, ?)
        `, [roleId, shift.shift_name || 'Shift', shift.startTime, shift.endTime]);
      }
    }

    // Insert permissions
    if (permissions) {
      for (const [moduleName, modulePermissions] of Object.entries(permissions)) {
        for (const [permissionType, isGranted] of Object.entries(modulePermissions)) {
          if (isGranted) {
            // Get or create permission
            let [permissionRows] = await connection.query(`
              SELECT id FROM permissions 
              WHERE module_name = ? AND permission_type = ?
            `, [moduleName, permissionType]);

            let permissionId;
            if (permissionRows.length === 0) {
              // Create new permission
              const [permissionResult] = await connection.query(`
                INSERT INTO permissions (module_name, permission_type, description)
                VALUES (?, ?, ?)
              `, [moduleName, permissionType, `${permissionType} permission for ${moduleName}`]);
              permissionId = permissionResult.insertId;
            } else {
              permissionId = permissionRows[0].id;
            }

            // Grant permission to role
            await connection.query(`
              INSERT INTO role_permissions (role_id, permission_id, is_granted)
              VALUES (?, ?, ?)
              ON DUPLICATE KEY UPDATE is_granted = ?
            `, [roleId, permissionId, true, true]);
          }
        }
      }
    }

    await connection.commit();
    connection.release();

    return { id: roleId, message: 'User role created successfully' };
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
};

// Update user role with permissions and working hours
export const updateUserRoleService = async (id, roleData) => {
  const {
    roleName,
    description,
    isActive,
    otRate,
    note,
    permissions,
    workingHours
  } = roleData;

  // Start transaction
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // Update user role
    const [roleResult] = await connection.query(`
      UPDATE user_roles 
      SET role_name = ?, description = ?, is_active = ?, ot_rate = ?, note = ?
      WHERE id = ?
    `, [roleName, description, isActive, otRate, note, id]);

    if (roleResult.affectedRows === 0) {
      throw new Error('User role not found');
    }

    // Delete existing working hours
    await connection.query('DELETE FROM working_hours WHERE role_id = ?', [id]);

    // Insert new working hours
    if (workingHours && workingHours.length > 0) {
      for (const shift of workingHours) {
        await connection.query(`
          INSERT INTO working_hours (role_id, shift_name, start_time, end_time)
          VALUES (?, ?, ?, ?)
        `, [id, shift.shift_name || 'Shift', shift.startTime, shift.endTime]);
      }
    }

    // Delete existing role permissions
    await connection.query('DELETE FROM role_permissions WHERE role_id = ?', [id]);

    // Insert new permissions
    if (permissions) {
      for (const [moduleName, modulePermissions] of Object.entries(permissions)) {
        for (const [permissionType, isGranted] of Object.entries(modulePermissions)) {
          if (isGranted) {
            // Get or create permission
            let [permissionRows] = await connection.query(`
              SELECT id FROM permissions 
              WHERE module_name = ? AND permission_type = ?
            `, [moduleName, permissionType]);

            let permissionId;
            if (permissionRows.length === 0) {
              // Create new permission
              const [permissionResult] = await connection.query(`
                INSERT INTO permissions (module_name, permission_type, description)
                VALUES (?, ?, ?)
              `, [moduleName, permissionType, `${permissionType} permission for ${moduleName}`]);
              permissionId = permissionResult.insertId;
            } else {
              permissionId = permissionRows[0].id;
            }

            // Grant permission to role
            await connection.query(`
              INSERT INTO role_permissions (role_id, permission_id, is_granted)
              VALUES (?, ?, ?)
            `, [id, permissionId, true]);
          }
        }
      }
    }

    await connection.commit();
    connection.release();

    return { message: 'User role updated successfully', affectedRows: roleResult.affectedRows };
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
};

// Delete user role
export const deleteUserRoleService = async (id) => {
  const [result] = await db.query('DELETE FROM user_roles WHERE id = ?', [id]);
  return { message: 'User role deleted successfully', affectedRows: result.affectedRows };
};

// Change user role status
export const changeUserRoleStatusService = async (id, isActive) => {
  const [result] = await db.query(`
    UPDATE user_roles SET is_active = ? WHERE id = ?
  `, [isActive, id]);
  return { message: 'User role status changed successfully', affectedRows: result.affectedRows };
};

// Get all permissions (for reference)
export const getAllPermissionsService = async () => {
  const [permissions] = await db.query(`
    SELECT * FROM permissions ORDER BY module_name, permission_type
  `);
  return permissions;
};

// Get permissions by module
export const getPermissionsByModuleService = async (moduleName) => {
  const [permissions] = await db.query(`
    SELECT * FROM permissions WHERE module_name = ?
  `, [moduleName]);
  return permissions;
}; 
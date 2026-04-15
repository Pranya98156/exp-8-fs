// Role definitions
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

// Permission definitions
export const PERMISSIONS = {
  // User management
  CREATE_USER: "create:user",
  READ_USER: "read:user",
  UPDATE_USER: "update:user",
  DELETE_USER: "delete:user",

  // Admin actions
  MANAGE_ROLES: "manage:roles",
  VIEW_ANALYTICS: "view:analytics",

  // Self actions
  READ_SELF: "read:self",
  UPDATE_SELF: "update:self",
};

// Role-to-permissions mapping
export const rolePermissions = {
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.READ_USER,
    PERMISSIONS.UPDATE_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.READ_SELF,
    PERMISSIONS.UPDATE_SELF,
  ],
  [ROLES.USER]: [PERMISSIONS.READ_SELF, PERMISSIONS.UPDATE_SELF],
};

// Helper function to get permissions for a role
export const getPermissionsForRole = (role) => {
  return rolePermissions[role] || [];
};

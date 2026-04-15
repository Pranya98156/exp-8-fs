import { ApiError } from "../utils/apiError.js";
import { getPermissionsForRole } from "../constants/roles.js";

/**
 * Middleware to require specific roles
 * @param {...string} allowedRoles - Roles that are allowed to proceed
 * @returns {Function} Express middleware
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden: Insufficient role privileges"));
    }

    return next();
  };
};

/**
 * Middleware to require specific permissions
 * @param {...string} requiredPermissions - Permissions required to proceed
 * @returns {Function} Express middleware
 */
export const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    const userPermissions = getPermissionsForRole(req.user.role);

    const hasPermission = requiredPermissions.every((perm) =>
      userPermissions.includes(perm),
    );

    if (!hasPermission) {
      return next(new ApiError(403, "Forbidden: Missing required permissions"));
    }

    return next();
  };
};

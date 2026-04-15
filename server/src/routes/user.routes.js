import { Router } from "express";
import {
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getDashboardStats,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  requireRole,
  requirePermission,
} from "../middlewares/authorization.middleware.js";
import { ROLES, PERMISSIONS } from "../constants/roles.js";

const userRouter = Router();

// Protected routes - require authentication
userRouter.get("/me", requireAuth, getCurrentUser);

// Admin routes - require admin role
userRouter.get("/", requireAuth, requireRole(ROLES.ADMIN), getAllUsers);

userRouter.get(
  "/admin/stats",
  requireAuth,
  requireRole(ROLES.ADMIN),
  getDashboardStats,
);

userRouter.get("/:userId", requireAuth, requireRole(ROLES.ADMIN), getUserById);

userRouter.patch(
  "/:userId/role",
  requireAuth,
  requireRole(ROLES.ADMIN),
  updateUserRole,
);

userRouter.delete(
  "/:userId",
  requireAuth,
  requireRole(ROLES.ADMIN),
  deleteUser,
);

export default userRouter;

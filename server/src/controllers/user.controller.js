import { asyncHandler } from "../utils/asyncHandler.js";
import { users } from "../data/user.store.js";
import { ApiError } from "../utils/apiError.js";
import { ROLES } from "../constants/roles.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = users.find((u) => u.id === req.user.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// Admin: Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }));

  res.status(200).json({ users: allUsers });
});

// Admin: Get user by ID
export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = users.find((u) => u.id === userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// Admin: Update user role
export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!role || !Object.values(ROLES).includes(role)) {
    throw new ApiError(
      400,
      `Invalid role. Must be one of: ${Object.values(ROLES).join(", ")}`,
    );
  }

  const user = users.find((u) => u.id === userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Prevent self-demotion from admin
  if (user.id === req.user.id && role !== ROLES.ADMIN) {
    throw new ApiError(400, "Cannot demote yourself from admin role");
  }

  user.role = role;

  res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// Admin: Delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId === req.user.id) {
    throw new ApiError(400, "Cannot delete your own account");
  }

  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    throw new ApiError(404, "User not found");
  }

  users.splice(index, 1);

  res.status(200).json({ message: "User deleted successfully" });
});

// Admin: Get dashboard statistics
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === ROLES.ADMIN).length;
  const userCount = users.filter((u) => u.role === ROLES.USER).length;

  res.status(200).json({
    stats: {
      totalUsers,
      adminCount,
      userCount,
      breakdown: {
        [ROLES.ADMIN]: adminCount,
        [ROLES.USER]: userCount,
      },
    },
  });
});

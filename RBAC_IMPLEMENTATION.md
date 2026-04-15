# RBAC Implementation Guide

## Overview

This project implements a complete **Role-Based Access Control (RBAC)** system with:

- **Admin and User roles** with distinct permissions
- **API-level authorization** using middleware
- **Frontend route guards** based on user roles
- **Admin dashboard** for user management
- **Role-based UI** that adapts based on user permissions

## Architecture

### Backend Components

#### 1. **Role & Permission Definitions** (`server/src/constants/roles.js`)

```
ROLES: { ADMIN, USER }
PERMISSIONS: Fine-grained permissions for different operations
Role-to-Permission Mapping: Defines which permissions each role has
```

#### 2. **Authorization Middleware** (`server/src/middlewares/authorization.middleware.js`)

- `requireRole(...roles)` - Ensures user has one of the specified roles
- `requirePermission(...permissions)` - Ensures user has all required permissions

#### 3. **Enhanced Authentication**

- User model now includes `role` field
- Roles are embedded in JWT tokens
- Default new users get `USER` role
- Demo admin account available for testing

#### 4. **Admin Routes** (`server/src/routes/user.routes.js`)

```
GET  /api/users              - List all users (admin only)
GET  /api/users/:userId      - Get specific user (admin only)
PATCH /api/users/:userId/role - Update user role (admin only)
DELETE /api/users/:userId    - Delete user (admin only)
GET  /api/users/admin/stats  - Get dashboard statistics (admin only)
```

### Frontend Components

#### 1. **Enhanced AuthContext** (`client/src/features/auth/AuthContext.jsx`)

- Now includes user role information
- Provides `isAdmin` computed property for easy role checking
- Persists role in JWT token

#### 2. **Role-Based Route Guards**

- `<RequireAuth>` - Requires authentication
- `<RequireAdmin>` - Requires admin role (redirects to 403 if insufficient)

#### 3. **Role-Based Navigation** (`client/src/components/RoleBasedNav.jsx`)

- Navigation menu adapts based on user role
- Admin-only menu items appear for admin users
- Shows user role badge

#### 4. **Admin Dashboard** (`client/src/features/admin/AdminDashboard.jsx`)

- View all users and their roles
- Update user roles
- Delete users
- View system statistics (total users, admin count, etc.)

## Usage Guide

### For Users

#### Registration

1. Click "Register" on the home page
2. Create account with name, email, password
3. Automatically assigned `USER` role
4. Redirected to dashboard

#### User Dashboard

- View personal profile
- See your assigned role
- Access only permitted features

### For Admins

#### Admin Panel Access

1. Log in with admin account (or promoted admin)
2. Click "Admin Panel" in navigation
3. Access user management interface

#### Managing Users

- **View Users**: See all registered users
- **Update Roles**: Click "Edit Role" to change user role
- **Delete Users**: Remove users from system
- **View Stats**: See breakdown of admins vs regular users

#### Demo Admin Account

```
Email: admin@example.com
Password: admin123
```

## API Reference

### Authentication Endpoints

```
POST /api/auth/register
- Register new user
- Returns: { token, user: { id, name, email, role } }

POST /api/auth/login
- Login with credentials
- Returns: { token, user: { id, name, email, role } }
```

### User Endpoints

```
GET /api/users/me
- Get current user profile
- Auth: Required
- Returns: { user: { id, name, email, role, createdAt } }

GET /api/users
- List all users
- Auth: Required (Admin only)
- Returns: { users: [...] }

GET /api/users/:userId
- Get specific user
- Auth: Required (Admin only)
- Returns: { user: {...} }

PATCH /api/users/:userId/role
- Update user role
- Auth: Required (Admin only)
- Body: { role: "admin" | "user" }
- Returns: { user: {...} }

DELETE /api/users/:userId
- Delete user
- Auth: Required (Admin only)
- Returns: { message: "User deleted successfully" }

GET /api/users/admin/stats
- Get admin statistics
- Auth: Required (Admin only)
- Returns: { stats: { totalUsers, adminCount, userCount, breakdown } }
```

## Frontend Routes

```
/              - Home page (public)
/login         - Login page (public, redirects if authenticated)
/register      - Registration page (public, redirects if authenticated)
/dashboard     - User dashboard (requires authentication)
/admin         - Admin panel (requires admin role)
```

## Permission Model

### Admin Permissions

- `create:user` - Create new users
- `read:user` - Read user data
- `update:user` - Update user data
- `delete:user` - Delete users
- `manage:roles` - Manage user roles
- `view:analytics` - View system analytics
- `read:self` - Read own profile
- `update:self` - Update own profile

### User Permissions

- `read:self` - Read own profile
- `update:self` - Update own profile

## Development Setup

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Key Features

### 1. **Role Hierarchy**

- Admin role has all permissions
- User role has limited self-management permissions
- Extensible pattern for adding more roles

### 2. **JWT Token Storage**

```javascript
// Token payload includes role
{
  id: string,
  email: string,
  name: string,
  role: "admin" | "user"
}
```

### 3. **Frontend Protection**

- Routes check user role before rendering
- Unauthorized access shows 403 error
- Navigation automatically hides restricted items

### 4. **API Protection**

- All admin routes require role middleware
- Middleware checks JWT and validates permissions
- Returns 403 Forbidden for insufficient privileges

### 5. **User Management**

- Admins cannot demote themselves
- Admins cannot delete their own account
- Audit trail via timestamps

## Security Considerations

1. **Token Security**
   - JWT tokens signed with secret key
   - Tokens expire after configured time
   - Tokens stored in localStorage (not HttpOnly for this demo)

2. **API Security**
   - All privileged routes checked on backend
   - Role validation before any action
   - Input validation on all endpoints

3. **Frontend Security**
   - Route guards prevent unauthorized access
   - Role-based UI prevents confusion
   - Proper error handling

## Extending the System

### Add New Role

1. Update `server/src/constants/roles.js`:

```javascript
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator", // New role
};

export const rolePermissions = {
  [ROLES.MODERATOR]: [PERMISSIONS.READ_USER, PERMISSIONS.VIEW_ANALYTICS],
};
```

2. Update frontend auth context if needed
3. Create new route guard if specific behavior needed

### Add New Permission

1. Add to `PERMISSIONS` object
2. Add to appropriate role in `rolePermissions`
3. Use with `requirePermission` middleware:

```javascript
router.get(
  "/reports",
  requireAuth,
  requirePermission(PERMISSIONS.VIEW_ANALYTICS),
  getReports,
);
```

## Testing

### Test Admin Functions

1. Log in with admin account
2. Navigate to Admin Panel
3. Verify you can:
   - See all users
   - Update roles
   - Delete users (except self)
   - View statistics

### Test User Functions

1. Register new account
2. Verify you can:
   - View own profile
   - See your role as "user"
   - Cannot access /admin route

### Test Route Guards

1. Try accessing `/admin` without admin role
2. Should show 403 error page
3. Navigation should not show Admin Panel link

## File Structure

```
server/
├── src/
│   ├── constants/
│   │   └── roles.js              # Role & permission definitions
│   ├── middlewares/
│   │   ├── auth.middleware.js     # Authentication middleware
│   │   └── authorization.middleware.js  # Role/permission checks
│   ├── controllers/
│   │   ├── auth.controller.js     # Auth with roles
│   │   └── user.controller.js     # User management endpoints
│   └── routes/
│       └── user.routes.js         # Protected admin routes

client/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── AuthContext.jsx    # Enhanced with roles
│   │   │   └── RequireAuth.jsx    # Role-based guards
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx # User management UI
│   │   │   └── AdminDashboard.css # Styling
│   │   ├── dashboard/
│   │   │   └── DashboardPage.jsx  # User profile with role
│   │   └── home/
│   │       └── HomePage.jsx       # Role-aware home page
│   ├── components/
│   │   ├── RoleBasedNav.jsx       # Dynamic navigation
│   │   └── RoleBasedNav.css       # Navigation styling
│   ├── app/
│   │   └── router.jsx             # Routes with guards
│   └── styles.css                 # RBAC styles
```

## Troubleshooting

### "Cannot read property 'role' of null"

- Ensure user is authenticated before accessing role
- Use `user?.role` optional chaining

### Admin panel not showing

- Verify logged-in user has admin role
- Check `isAdmin` in browser dev tools
- Verify JWT token contains correct role

### API returning 403 Forbidden

- Check user role in token
- Verify middleware is applied to route
- Check permission requirements

### Role not updating

- Refresh page to fetch latest user data
- Check browser network tab for API response
- Verify admin is making the request

## Future Enhancements

1. **Database Integration** - Replace in-memory store with MongoDB
2. **Advanced Roles** - Add moderator, editor, viewer roles
3. **Granular Permissions** - Per-resource permissions
4. **Audit Logging** - Track all admin actions
5. **Invite System** - Admins invite users with specific roles
6. **Role Templates** - Predefined permission sets
7. **Time-Limited Roles** - Roles that expire
8. **IP Whitelist** - Restrict admin access by IP

## License

MIT

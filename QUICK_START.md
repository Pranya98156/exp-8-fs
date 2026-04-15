# Quick Start Guide - RBAC System

## Setup & Launch

### 1. Backend Setup

```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
# App runs on http://localhost:5173
```

### 3. Access Application

Open http://localhost:5173 in your browser

## Quick Test Scenarios

### Scenario 1: Register & Login as Regular User

1. **Register**
   - Click "Register" button
   - Fill in: Name, Email, Password
   - Submit form
   - Auto-logged in as USER role

2. **Explore User Dashboard**
   - See your profile info
   - Notice role shows as "user"
   - Cannot access Admin Panel (blocked by route guard)

3. **Try Admin Access**
   - Try navigating to `/admin` directly in URL
   - See 403 Forbidden message
   - Notice Admin Panel not in navigation menu

### Scenario 2: Login as Admin

1. **Login with Demo Admin**
   - Email: `admin@example.com`
   - Password: `admin123`
   - Click "Sign In"

2. **Access Admin Panel**
   - Click "Admin Panel" in navigation (now visible!)
   - See user management dashboard
   - View system statistics

3. **Manage Users**
   - **View Users**: See all registered users
   - **Update Roles**:
     - Click "Edit Role" on a user
     - Select new role dropdown
     - Click "Update"
     - User role changes immediately
   - **Delete Users**: Click "Delete" to remove user
   - **View Stats**: See admin count, user count, total users

### Scenario 3: Role Promotion

1. **Login as Admin**
   - Access Admin Panel
   - Find a regular user

2. **Promote User to Admin**
   - Click "Edit Role" on the user
   - Select "admin" from dropdown
   - Click "Update"
   - User shows as admin in table

3. **Verify User Has Access**
   - Log out
   - Login with promoted user account
   - Admin Panel now visible and accessible

### Scenario 4: Test Permission Restrictions

1. **Login as Regular User**
2. **Try API calls in Browser Console**

```javascript
// This will fail - trying to get all users
fetch("http://localhost:5000/api/users", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
  },
});
// Error: 403 Forbidden

// This will succeed - getting own user
fetch("http://localhost:5000/api/users/me", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
  },
});
// Success: Returns current user data
```

3. **Login as Admin**
4. **Try same API calls**

```javascript
// Now succeeds - admin can get all users
fetch("http://localhost:5000/api/users", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
  },
});
// Success: Returns all users
```

## Key Test Cases

### Authentication

- ✅ Register new user - assigned USER role
- ✅ Login with credentials - returns JWT with role
- ✅ Token persistence across page refresh
- ✅ Logout clears token

### Authorization - Routes

- ✅ Unauthenticated → redirects to login
- ✅ USER role → can access /dashboard
- ✅ USER role → cannot access /admin (403)
- ✅ ADMIN role → can access /admin
- ✅ ADMIN role → can access /dashboard

### Authorization - APIs

- ✅ USER → GET /users/me ✓
- ✅ USER → GET /users ✗ (403)
- ✅ ADMIN → GET /users ✓
- ✅ ADMIN → PATCH /users/:id/role ✓
- ✅ ADMIN → DELETE /users/:id ✓

### UI Adaptation

- ✅ Navigation shows Admin Panel only for admins
- ✅ User info shows correct role badge
- ✅ Homepage shows role-appropriate buttons
- ✅ Dashboard shows admin notice for admins

### Admin Features

- ✅ View all users and their roles
- ✅ Update user roles (role changes immediately)
- ✅ Delete users
- ✅ View dashboard statistics
- ✅ Cannot demote self from admin
- ✅ Cannot delete own account

## API Testing with cURL

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Get All Users (requires admin token)

```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update User Role (requires admin token)

```bash
curl -X PATCH http://localhost:5000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "role": "admin"
  }'
```

### Get Dashboard Stats (requires admin token)

```bash
curl -X GET http://localhost:5000/api/users/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Component Overview

### Frontend Hierarchy

```
App
├── AuthProvider
│   └── RouterProvider
│       ├── AppLayout
│       │   ├── RoleBasedNav (adapts based on role)
│       │   └── Outlet (route content)
│       ├── HomePage (role-aware)
│       ├── LoginPage
│       ├── RegisterPage
│       ├── RequireAuth
│       │   └── DashboardPage (shows role)
│       └── RequireAdmin
│           └── AdminDashboard (user management)
```

### Backend Hierarchy

```
express app
├── /api/health (public)
├── /api/auth
│   ├── POST /register (with role assignment)
│   └── POST /login (with role in token)
└── /api/users
    ├── GET /me (auth required)
    ├── GET / (auth + admin required)
    ├── GET /:id (auth + admin required)
    ├── PATCH /:id/role (auth + admin required)
    ├── DELETE /:id (auth + admin required)
    └── GET /admin/stats (auth + admin required)
```

## Common Issues & Solutions

### Issue: Role not updating in UI

**Solution:** Refresh the page or log out and log back in to fetch fresh data

### Issue: Cannot access admin panel

**Solution:** Verify user role is "admin" in dashboard tile or browser console

### Issue: 403 Forbidden on admin routes

**Solution:** Check token in localStorage - ensure it has correct role

### Issue: Navigation not showing Admin Panel

**Solution:** Clear cache and refresh, verify role is propagated in AuthContext

## Performance Tips

1. **Token caching**: JWT tokens stored in localStorage
2. **Lazy loading**: Admin dashboard loads user data on demand
3. **Batch operations**: Stats fetched with single API call
4. **Memoization**: AuthContext uses useMemo for performance

## Security Checklist

- ✅ Tokens validated on every protected route
- ✅ Roles checked on backend before any admin action
- ✅ Frontend guards prevent navigation to restricted routes
- ✅ API returns 403 for insufficient permissions
- ✅ Admin cannot demote themselves
- ✅ Passwords hashed with bcrypt

## Next Steps

### To Extend This System:

1. **Add Database** - Replace `user.store.js` with MongoDB/Mongoose
2. **Add More Roles** - Follow pattern in `roles.js`
3. **Add Permissions** - Create granular permission checks
4. **Add Audit Logging** - Log all admin actions
5. **Add Email Verification** - Verify emails on registration
6. **Add Password Reset** - Recovery flow for users
7. **Add Two-Factor Auth** - Additional security layer
8. **Add User Sessions** - Manage multiple simultaneous logins

## Support

For issues or questions:

1. Check the main RBAC_IMPLEMENTATION.md
2. Review file structure and component organization
3. Check browser console for errors
4. Check server logs for API issues

Happy testing! 🚀

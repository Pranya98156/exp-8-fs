# RBAC Backend API - For Custom Frontend

Your RBAC backend is ready! Here's how to use the APIs with your custom frontend.

## Available Endpoints

### Authentication

```javascript
// Register User
POST /api/auth/register
Body: { name, email, password }
Response: { token, user: { id, name, email, role } }

// Login User
POST /api/auth/login
Body: { email, password }
Response: { token, user: { id, name, email, role } }
```

### User Endpoints

```javascript
// Get Current User Profile
GET /api/users/me
Auth: Required (Bearer token)
Response: { user: { id, name, email, role, createdAt } }

// Get All Users (Admin Only)
GET /api/users
Auth: Required (Bearer token + Admin role)
Response: { users: [...] }

// Get Specific User (Admin Only)
GET /api/users/:userId
Auth: Required (Bearer token + Admin role)
Response: { user: {...} }

// Update User Role (Admin Only)
PATCH /api/users/:userId/role
Auth: Required (Bearer token + Admin role)
Body: { role: "admin" | "user" }
Response: { user: {...} }

// Delete User (Admin Only)
DELETE /api/users/:userId
Auth: Required (Bearer token + Admin role)
Response: { message: "User deleted successfully" }

// Get Dashboard Stats (Admin Only)
GET /api/users/admin/stats
Auth: Required (Bearer token + Admin role)
Response: { stats: { totalUsers, adminCount, userCount, breakdown } }
```

## Authentication in Frontend

### 1. Setup AuthContext (Already Done)

The `AuthContext.jsx` handles:

- User registration
- User login
- Automatic token storage
- User state management
- Logout functionality

```javascript
const { user, isAuthenticated, login, register, logout } = useAuth();
```

### 2. Protect Routes

Use `RequireAuth` to protect routes:

```javascript
import { RequireAuth } from "../features/auth/RequireAuth";

<RequireAuth>
  <YourProtectedPage />
</RequireAuth>

// For admin-only routes:
<RequireAuth requiredRole="admin">
  <AdminPanel />
</RequireAuth>
```

### 3. Make API Calls

The axios instance is pre-configured with auth tokens:

```javascript
import { api } from "../lib/api";

// It automatically includes Bearer token in headers
const { data } = await api.get("/users/me");

// Works for all requests
await api.post("/users", {...});
await api.patch("/users/123/role", {...});
```

## Test Demo Admin Account

```
Email: admin@example.com
Password: admin123
```

## Build Your Custom Frontend

Now you can create:

- **Custom dashboard pages**
- **Custom user management interface**
- **Custom navigation and menus**
- **Custom styling and layout**

All protected by the RBAC backend!

## Example: Build a Custom Admin Panel

```javascript
import { useAuth } from "../features/auth/AuthContext";
import { api } from "../lib/api";
import { RequireAuth } from "../features/auth/RequireAuth";

const MyAdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await api.get("/users");
      setUsers(data.users);
    };
    fetchUsers();
  }, []);

  return (
    <RequireAuth requiredRole="admin">
      <div>
        <h1>User Management</h1>
        {users.map((u) => (
          <div key={u.id}>
            <p>
              {u.name} - {u.role}
            </p>
            <button onClick={() => updateRole(u.id)}>Change Role</button>
          </div>
        ))}
      </div>
    </RequireAuth>
  );
};
```

## Authentication Flow

1. **Register** → User created with USER role
2. **Login** → JWT token returned
3. **Token stored** → In localStorage
4. **API requests** → Token automatically included in headers
5. **Protected pages** → Route guards check authentication
6. **Admin routes** → Check both auth + role

## Backend Files Reference

### Core RBAC Files (Don't modify unless needed)

- `server/src/constants/roles.js` - Role & permission definitions
- `server/src/middlewares/authorization.middleware.js` - Role/permission middleware
- `server/src/controllers/auth.controller.js` - Auth logic with roles
- `server/src/controllers/user.controller.js` - User management with RBAC
- `server/src/routes/user.routes.js` - Protected API routes

### Frontend Auth Files (Use as-is)

- `client/src/features/auth/AuthContext.jsx` - Auth state management
- `client/src/features/auth/RequireAuth.jsx` - Route guards
- `client/src/lib/api.js` - Axios with auth headers

## Common Frontend Patterns

### Check if User is Admin

```javascript
const { user } = useAuth();
if (user?.role === "admin") {
  // Show admin features
}
```

### Get Current User Info

```javascript
const { user, isAuthenticated } = useAuth();
if (isAuthenticated) {
  console.log(user.name, user.role, user.email);
}
```

### Protected Component

```javascript
<RequireAuth requiredRole="admin">
  <div>This is only visible to admins</div>
</RequireAuth>
```

### API Call with Error Handling

```javascript
try {
  const { data } = await api.get("/users");
  setUsers(data.users);
} catch (error) {
  if (error.response?.status === 403) {
    console.log("Insufficient permissions");
  }
}
```

## Extending the System

### Add New Role

1. Edit `server/src/constants/roles.js`
2. Add role to `ROLES` object
3. Define permissions in `rolePermissions`
4. Add middleware to routes

### Add New Permission

1. Add to `PERMISSIONS` in `roles.js`
2. Add to appropriate role in `rolePermissions`
3. Use in routes: `requirePermission(PERMISSIONS.YOUR_PERMISSION)`

## Server Status

✅ Backend running on http://localhost:5001  
✅ Frontend running on http://localhost:5173  
✅ All RBAC APIs ready to use  
✅ JWT authentication configured  
✅ Role-based access control active

Happy building! 🚀

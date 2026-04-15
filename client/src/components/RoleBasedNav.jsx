import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import "./RoleBasedNav.css";

const RoleBasedNav = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            RBAC App
          </Link>
          <div className="navbar-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          SecureFlow
        </Link>

        <div className="navbar-menu">
          <div className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>

            {user?.role === "admin" && (
              <Link to="/admin" className="admin-link">
                Admin Panel
              </Link>
            )}
          </div>

          <div className="navbar-user">
            <span className="user-info">
              {user?.name}
              <span className="user-role">{user?.role}</span>
            </span>
            <button className="btn-logout" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default RoleBasedNav;

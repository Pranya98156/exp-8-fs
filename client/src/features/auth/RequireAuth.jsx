import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const RequireAuth = ({ children, requiredRole }) => {
  const { isAuthenticated, isInitializing, user } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return <p className="card">Checking auth session...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
        <h1>403 - Forbidden</h1>
        <p>You don't have permission to access this page.</p>
        <p>
          Required role: <strong>{requiredRole}</strong>
        </p>
        <p>
          Your role: <strong>{user?.role}</strong>
        </p>
      </div>
    );
  }

  return children;
};

export const RequireAdmin = ({ children }) => {
  return <RequireAuth requiredRole="admin">{children}</RequireAuth>;
};

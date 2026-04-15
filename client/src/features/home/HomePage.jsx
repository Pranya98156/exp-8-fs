import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export const HomePage = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <>
      <section className="hero card fade-in">
        <p className="kicker">SecureFlow</p>
        <h1>Modern role-based access for small teams.</h1>
        <p className="hero-subtext">
          Build trust with admin controls, protected dashboards, and conditional
          UI for users and admins. Start your personal RBAC experiment in one
          place.
        </p>

        <div className="hero-actions">
          <Link to="/login" className="btn primary">
            Sign in securely
          </Link>
          <Link to="/register" className="btn secondary">
            Create account
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="btn ghost">
              Go to dashboard
            </Link>
          )}
        </div>
      </section>

      <section className="features-section">
        <h2>What this app gives you</h2>

        <div className="features-grid">
          <article className="feature-card">
            <h3>Admin controls</h3>
            <p>
              Manage users, assign roles, and enforce permissions across the
              platform from one secure admin screen.
            </p>
          </article>
          <article className="feature-card">
            <h3>Protected routes</h3>
            <p>
              Only authenticated users can reach the dashboard, and only admins
              can access admin tools.
            </p>
          </article>
          <article className="feature-card">
            <h3>Real role awareness</h3>
            <p>
              The UI updates automatically for each role. Admins see more options
              while users stay focused on their own workspace.
            </p>
          </article>
        </div>
      </section>

      <section className="info-box">
        <p>
          {isAuthenticated ? (
            <>
              Welcome back, <strong>{user?.name}</strong>. You are signed in as{' '}
              <strong>{user?.role}</strong>.
            </>
          ) : (
            "Sign in today and discover how to build a secure role-based web app."
          )}
        </p>
        {isAuthenticated && (
          <div className="hero-actions" style={{ marginTop: "1rem" }}>
            <button onClick={logout} className="btn secondary">
              Logout
            </button>
          </div>
        )}
      </section>
    </>
  );
};

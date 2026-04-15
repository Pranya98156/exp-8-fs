import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("user");

  const redirectPath = location.state?.from?.pathname || "/";

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginUser = await login(form);

      // Validate role matches the tab user is on
      if (activeTab === "admin" && loginUser.role !== "admin") {
        logout();
        setError(
          "This account is not an admin account. Please use the User Login tab.",
        );
        return;
      }

      if (activeTab === "user" && loginUser.role === "admin") {
        logout();
        setError("Admin account detected. Please use the Admin Login tab.");
        return;
      }

      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = {
    user: { email: "user@example.com", password: "password123" },
    admin: { email: "admin@example.com", password: "admin123" },
  };

  const fillDemoCredentials = () => {
    setForm(demoCredentials[activeTab]);
    setError("");
  };

  return (
    <section className="auth-wrap card fade-in">
      <div className="auth-head">
        <p className="kicker">Welcome Back</p>
        <h2>Secure login to your portal</h2>
        <p className="subtle">
          Choose your access mode and sign in with the right account.
        </p>
      </div>

      <div className="login-tabs">
        <button
          type="button"
          className={`tab-button ${activeTab === "user" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("user");
            setForm({ email: "", password: "" });
            setError("");
          }}
        >
          👤 User
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === "admin" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("admin");
            setForm({ email: "", password: "" });
            setError("");
          }}
        >
          🔑 Admin
        </button>
      </div>

      <form className="stack" onSubmit={onSubmit}>
        <label>
          Email
          <input
            name="email"
            type="email"
            placeholder="hello@example.com"
            onChange={onChange}
            value={form.email}
            required
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            onChange={onChange}
            value={form.password}
            required
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <button
          type="button"
          className="btn secondary"
          onClick={fillDemoCredentials}
          style={{ marginTop: "0.75rem" }}
        >
          {activeTab === "admin"
            ? "Use Admin Demo"
            : "Use User Demo"}
        </button>
      </form>

      <p className="auth-footnote">
        New here? <Link to="/register">Create an account</Link>
      </p>

      <div className="demo-info">
        <p>
          <strong>Demo accounts</strong>
          <br />
          User: user@example.com / password123
          <br />
          Admin: admin@example.com / admin123
        </p>
      </div>
    </section>
  );
};

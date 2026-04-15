import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-wrap card fade-in">
      <div className="auth-head">
        <p className="kicker">Join SecureFlow</p>
        <h2>Create your access key</h2>
        <p className="subtle">
          Register once and start testing protected routes, admin tools, and role-aware features.
        </p>
      </div>
      <form className="stack" onSubmit={onSubmit}>
        <label>
          Full name
          <input
            name="name"
            type="text"
            placeholder="Jane Doe"
            onChange={onChange}
            value={form.name}
            required
          />
        </label>
        <label>
          Work email
          <input
            name="email"
            type="email"
            placeholder="name@company.com"
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
            placeholder="Create a strong password"
            onChange={onChange}
            value={form.password}
            minLength={6}
            required
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="auth-footnote">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </section>
  );
};

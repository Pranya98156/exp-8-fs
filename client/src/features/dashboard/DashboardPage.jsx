import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.get("/users/me");
        setMe(data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return (
    <section className="card fade-in">
      <p className="kicker">User Dashboard</p>
      <h2>Your Profile</h2>
      <p className="subtle">
        Only authenticated users can access this profile data.
      </p>

      {loading ? <p className="subtle">Loading secure data...</p> : null}
      {!loading && error ? <p className="error">{error}</p> : null}
      {!loading && me ? (
        <div className="dashboard-grid">
          <article className="dashboard-tile">
            <h3>Account ID</h3>
            <p>{me.id}</p>
          </article>
          <article className="dashboard-tile">
            <h3>Display Name</h3>
            <p>{me.name}</p>
          </article>
          <article className="dashboard-tile">
            <h3>Email</h3>
            <p>{me.email}</p>
          </article>
          <article className="dashboard-tile">
            <h3>Role</h3>
            <p>
              <span className={`role-badge role-${me.role}`}>
                {me.role?.toUpperCase()}
              </span>
            </p>
          </article>
          <article className="dashboard-tile">
            <h3>Member Since</h3>
            <p>{new Date(me.createdAt).toLocaleDateString()}</p>
          </article>
        </div>
      ) : null}

      {!loading && me?.role === "admin" && (
        <div className="admin-notice">
          <p>
            ✨ You are an admin. Access the <a href="/admin">Admin Panel</a> to
            manage users.
          </p>
        </div>
      )}
    </section>
  );
};

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../auth/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newRole, setNewRole] = useState("user");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, statsRes] = await Promise.all([
          api.get("/users"),
          api.get("/users/admin/stats"),
        ]);
        setUsers(usersRes.data.users);
        setStats(statsRes.data.stats);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateRole = async (userId) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
      setSelectedUserId(null);
      setNewRole("user");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) {
    return <div className="card">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      {/* Stats Section */}
      {stats && (
        <div className="stats-section">
          <h2>Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Admins</h3>
              <p className="stat-number">{stats.adminCount}</p>
            </div>
            <div className="stat-card">
              <h3>Regular Users</h3>
              <p className="stat-number">{stats.userCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Users Management Section */}
      <div className="users-section">
        <h2>User Management</h2>
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge role-${u.role}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.id !== user.id && (
                      <div className="action-buttons">
                        {selectedUserId === u.id ? (
                          <div className="role-selector">
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button
                              className="btn-ok"
                              onClick={() => handleUpdateRole(u.id)}
                            >
                              Update
                            </button>
                            <button
                              className="btn-cancel"
                              onClick={() => setSelectedUserId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              className="btn-edit"
                              onClick={() => {
                                setSelectedUserId(u.id);
                                setNewRole(u.role);
                              }}
                            >
                              Edit Role
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    )}
                    {u.id === user.id && (
                      <span className="self-indicator">(You)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

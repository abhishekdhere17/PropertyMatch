
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/users")
      .then((response) => {
        setUsers(response.data);
        setError("");
      })
      .catch((err) => {
        console.error("Manage users error:", err.response?.data || err);
        setError(
          err.response?.data?.error ||
          "Unable to load users. Check admin API access."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="dashboard-page">
      <h1>Manage Users</h1>
      <p>Review registered accounts and their current roles.</p>

      {loading && <p>Loading users...</p>}

      {error && <p className="dashboard-error">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p>No registered users found.</p>
      )}

      <div className="admin-list">
        {users.map((user) => (
          <article className="admin-list-item" key={user.id}>
            <div>
              <h3>{user.fullName}</h3>
              <p>{user.email}</p>
              <p>Phone: {user.phone || "Not provided"}</p>
              <span>Role: {user.role}</span>
              <p>Status: {user.enabled ? "Active" : "Disabled"}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

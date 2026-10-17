
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin/users")
      .then((response) => setUsers(response.data))
      .catch(() => setError("Unable to load users. Check admin API access."));
  }, []);

  return (
    <main className="dashboard-page">
      <h1>Manage Users</h1>
      <p>Review registered accounts and their current roles.</p>

      {error && <p className="dashboard-error">{error}</p>}

      <div className="admin-list">
        {users.map((user) => (
          <article className="admin-list-item" key={user.id}>
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <span>Role: {user.role}</span>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

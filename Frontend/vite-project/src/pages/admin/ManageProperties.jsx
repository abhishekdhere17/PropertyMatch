
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ManageProperties() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  async function loadProperties() {
    try {
      const response = await api.get("/admin/properties");
      setItems(response.data);
      setError("");
    } catch {
      setError("Unable to load listings. Check the backend and admin permissions.");
    }
  }

  useEffect(() => {
    loadProperties();
  }, []);

  async function updateStatus(id, status) {
    try {
      await api.patch(`/admin/properties/${id}/status`, { status });
      await loadProperties();
    } catch {
      setError("Could not update the listing status.");
    }
  }

  return (
    <main className="dashboard-page">
      <h1>Manage Properties</h1>
      <p>Review, approve, or reject submitted listings.</p>

      {error && <p className="dashboard-error">{error}</p>}

      <div className="admin-list">
        {items.map((item) => (
          <article className="admin-list-item" key={item.id}>
            <div>
              <h3>{item.title}</h3>
              <p>{item.city} · ₹{Number(item.price).toLocaleString("en-IN")}</p>
              <span>Status: {item.status}</span>
            </div>

            <div className="admin-list-actions">
              <button onClick={() => updateStatus(item.id, "APPROVED")}>
                Approve
              </button>
              <button onClick={() => updateStatus(item.id, "REJECTED")}>
                Reject
              </button>
            </div>
          </article>
        ))}

        {!items.length && !error && <p>No listings to display.</p>}
      </div>
    </main>
  );
}

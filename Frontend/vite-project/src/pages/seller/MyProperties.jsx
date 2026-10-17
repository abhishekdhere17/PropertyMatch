
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");

  async function loadProperties() {
    try {
      const response = await api.get("/users/me/properties");
      setProperties(response.data);
      setError("");
    } catch {
      setError("Unable to load your properties. Check your login and backend.");
    }
  }

  useEffect(() => {
    loadProperties();
  }, []);

  async function deleteProperty(id) {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      await api.delete(`/properties/${id}`);
      await loadProperties();
    } catch {
      setError("Could not delete this property.");
    }
  }

  return (
    <main className="dashboard-page">
      <h1>My Properties</h1>
      <p>Manage your submitted sale and rental listings.</p>

      <Link className="dashboard-primary-link" to="/seller/add-property">
        + Add Property
      </Link>

      {error && <p className="dashboard-error">{error}</p>}

      <div className="admin-list">
        {properties.map((property) => (
          <article className="admin-list-item" key={property.id}>
            <div>
              <h3>{property.title}</h3>
              <p>
                {property.city} · ₹
                {Number(property.price).toLocaleString("en-IN")}
              </p>
              <span>Status: {property.status}</span>
            </div>

            <button onClick={() => deleteProperty(property.id)}>
              Delete
            </button>
          </article>
        ))}

        {!properties.length && !error && (
          <p>You have not added any properties yet.</p>
        )}
      </div>
    </main>
  );
}


import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ManageProperties() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  async function loadProperties() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/properties");
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Load properties error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load listings. Check the backend and admin permissions."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProperties();
  }, []);

  async function updateStatus(id, status) {
    setBusyId(id);
    setError("");

    try {
      // Backend expects ?status=APPROVED or ?status=REJECTED.
      await api.patch(`/admin/properties/${id}/status`, null, {
        params: { status },
      });

      await loadProperties();
    } catch (err) {
      console.error("Update status error:", err);
      setError(
        err.response?.data?.message ||
          "Could not update the listing status."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function deleteProperty(item) {
    const confirmed = window.confirm(
      `Permanently delete "${item.title || "this property"}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setBusyId(item.id);
    setError("");

    try {
      await api.delete(`/admin/properties/${item.id}`);

      // Remove it from the UI only after the API confirms success.
      setItems((current) =>
        current.filter((property) => property.id !== item.id)
      );
    } catch (err) {
      console.error("Delete property error:", err);
      setError(
        err.response?.data?.message ||
          "Could not delete the property. Check the backend logs."
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="dashboard-page">
      <span className="eyebrow">Administration</span>
      <h1>Manage Properties</h1>
      <p>Review, approve, reject, and remove property listings.</p>

      <div className="admin-properties-toolbar">
        <span>Total listings: {items.length}</span>
        <button
          type="button"
          className=""
          style={{padding:"5px 15px",marginLeft:"10px",borderRadius:"5px",border:"none",backgroundColor:"#427846",color:"white" ,boxShadow:"4px 4px 5px gray"}}
          onClick={loadProperties}
          disabled={loading || busyId !== null}
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="dashboard-error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading properties...</p>
      ) : items.length === 0 ? (
        <p>No listings to display.</p>
      ) : (
        <div className="admin-list">
          {items.map((item) => {
            const isBusy = busyId === item.id;

            return (
              <article className="admin-list-item" key={item.id}>
                <div>
                  <h3>{item.title || "Untitled property"}</h3>
                  <p>
                    {item.city || "Location not specified"} · ₹
                    {Number(item.price || 0).toLocaleString("en-IN")}
                  </p>
                  <span>Status: {item.status || "UNKNOWN"}</span>
                </div>

                <div className="admin-list-actions">
                  <button
                    type="button"
                    onClick={() => updateStatus(item.id, "APPROVED")}
                    disabled={isBusy || item.status === "APPROVED"}
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStatus(item.id, "REJECTED")}
                    disabled={isBusy || item.status === "REJECTED"}
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteProperty(item)}
                    disabled={isBusy}
                    aria-label={`Delete ${item.title || "property"}`}
                  >
                    {isBusy ? "Working..." : "Delete"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

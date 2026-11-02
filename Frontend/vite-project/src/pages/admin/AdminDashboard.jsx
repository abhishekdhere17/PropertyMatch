
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Users, PlusCircle, Clock } from "lucide-react";
import api from "../../services/api";

export default function AdminDashboard() {
  const [totalProperties, setTotalProperties] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [allResponse, pendingResponse] = await Promise.all([
          api.get("/admin/properties"),
          api.get("/admin/properties/pending"),
        ]);

        const all = Array.isArray(allResponse.data)
          ? allResponse.data
          : [];
        const pending = Array.isArray(pendingResponse.data)
          ? pendingResponse.data
          : [];

        setTotalProperties(all.length);
        setPendingCount(pending.length);
        setError("");
      } catch (err) {
        console.error("Load admin dashboard error:", err);
        setError("Unable to load dashboard statistics.");
      }
    }

    loadDashboard();
  }, []);

  return (
    <main className="dashboard-page">
      <span className="eyebrow">Administration</span>
      <h1>Admin Dashboard</h1>
      <p>Manage the platform and its property listings.</p>

      {error && <p className="dashboard-error" role="alert">{error}</p>}

      <div className="dashboard-grid">
        <Link to="/admin/properties" className="dashboard-card">
          <Building2 size={28} />
          <h2>Manage Properties</h2>
          <p>Review, approve, reject, or delete listings.</p>
          <strong>{totalProperties} total properties</strong>
        </Link>

        <Link to="/admin/properties" className="dashboard-card">
          <Clock size={28} />
          <h2>Approval Requests</h2>
          <p>Properties waiting for admin review.</p>
          <strong>{pendingCount} pending requests</strong>
        </Link>

        <Link to="/admin/users" className="dashboard-card">
          <Users size={28} />
          <h2>Manage Users</h2>
          <p>Review user accounts and access privileges.</p>
        </Link>

        <Link to="/seller/add-property" className="dashboard-card">
          <PlusCircle size={28} />
          <h2>Add Property</h2>
          <p>Open the property listing form.</p>
        </Link>
      </div>
    </main>
  );
}

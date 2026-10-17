
import { Link } from "react-router-dom";
import { Building2, Users, PlusCircle } from "lucide-react";

export default function AdminDashboard() {
  return (
    <main className="dashboard-page">
      <span className="eyebrow">Administration</span>
      <h1>Admin Dashboard</h1>
      <p>Manage the platform and its property listings.</p>

      <div className="dashboard-grid">
        <Link to="/admin/properties" className="dashboard-card">
          <Building2 size={28} />
          <h2>Manage Properties</h2>
          <p>Review listings and manage property records.</p>
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

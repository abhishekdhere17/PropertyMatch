
import { Link } from "react-router-dom";
import { Building2, PlusCircle, List } from "lucide-react";

export default function SellerDashboard() {
  return (
    <main className="dashboard-page">
      <span className="eyebrow">Seller workspace</span>
      <h1>Seller Dashboard</h1>
      <p>Manage your property listings from one place.</p>

      <div className="dashboard-grid">
        <Link to="/seller/add-property" className="dashboard-card">
          <PlusCircle size={28} />
          <h2>Add Property</h2>
          <p>Create a new sale or rental listing.</p>
        </Link>

        <Link to="/seller/my-properties" className="dashboard-card">
          <List size={28} />
          <h2>My Properties</h2>
          <p>View and manage your existing listings.</p>
        </Link>
      </div>
    </main>
  );
}


import { Link } from "react-router-dom";
import { Building2, ShieldCheck, TrendingUp } from "lucide-react";

export default function Sell() {
  return (
    <main className="listing-page">
      <section className="smart-match-intro">
        <Building2 size={38} />
        <span className="eyebrow">List your property</span>
        <h1>Ready to sell or rent your property?</h1>
        <p>
          Create a property listing, upload multiple photos,
          share the details, and connect with interested buyers or tenants.
        </p>
        <Link className="sell-primary-button" to="/seller/add-property">
          Start Listing
        </Link>
      </section>

      <section className="sell-benefits">
        <article>
          <Building2 size={27} />
          <h2>Complete property details</h2>
          <p>Add your price, location, area, BHK, facilities, and photos.</p>
        </article>

        <article>
          <ShieldCheck size={27} />
          <h2>Listing approval</h2>
          <p>Listings can be reviewed before they appear publicly.</p>
        </article>

        <article>
          <TrendingUp size={27} />
          <h2>Manage your listings</h2>
          <p>Track and update your own property listings in one place.</p>
        </article>
      </section>
    </main>
  );
}

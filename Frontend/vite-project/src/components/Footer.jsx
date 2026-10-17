
import { Link } from "react-router-dom";
import { Building2, Heart } from "lucide-react";
import "./../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-about">
          <Link to="/" className="footer-brand">
            <Building2 size={25} />
            <span>
              Property<span className="footer-highlight">Match</span>
            </span>
          </Link>

          <p>
            Find a property that fits your budget, lifestyle,
            and requirements with intelligent property matching.
          </p>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <Link to="/buy">Buy Property</Link>
          <Link to="/rent">Rent Property</Link>
          <Link to="/smart-match">Smart Match</Link>
          <Link to="/sell">List a Property</Link>
        </div>

        <div className="footer-column">
          <h3>Account</h3>
          <Link to="/login">Login</Link>
          <Link to="/register">Create Account</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} PropertyMatch. All rights reserved.</p>
        <p className="footer-made">
          Made with <Heart size={15} fill="currentColor" /> for better home finding.
        </p>
      </div>
    </footer>
  );
}

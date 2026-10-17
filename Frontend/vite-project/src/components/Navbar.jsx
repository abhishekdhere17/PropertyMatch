
import { Link, NavLink } from "react-router-dom";
import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";
import "./../styles/Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-icon">
            <Building2 size={25} />
          </span>
          <span>
            Property<span className="brand-highlight">Match</span>
          </span>
        </Link>

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <NavLink to="/buy" onClick={closeMenu}>Buy</NavLink>
          <NavLink to="/rent" onClick={closeMenu}>Rent</NavLink>
          <NavLink to="/sell" onClick={closeMenu}>Sell</NavLink>
          <NavLink to="/smart-match" onClick={closeMenu}>
            Smart Match
          </NavLink>

          <div className="nav-actions">
            <Link
              to="/login"
              className="nav-login"
              onClick={closeMenu}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="nav-register"
              onClick={closeMenu}
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

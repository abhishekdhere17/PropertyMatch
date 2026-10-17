
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Target,
  ShieldCheck,
  Search,
} from "lucide-react";

import SearchBar from "../components/SearchBar";
import PropertyCard from "../components/PropertyCard";
import { properties } from "../data/properties";

import "../styles/Home.css";
import "../styles/PropertyCard.css";

export default function Home() {
  const navigate = useNavigate();

  function handleSearch(filters) {
    navigate("/buy", {
      state: { filters },
    });
  }

  const featured = properties.slice(0, 3);

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="eyebrow hero-eyebrow">
            <Target size={16} />
            Real estate, made personal
          </span>

          <h1>
            Don't just find a property.
            <span> Find the right one.</span>
          </h1>

          <p className="hero-description">
            Discover homes for sale and rent with intelligent
            property matching based on your budget, location,
            space, and lifestyle.
          </p>

          <div className="hero-trust">
            <span>
              <ShieldCheck size={17} />
              Personalized matches
            </span>

            <span>
              <Search size={17} />
              Smarter property search
            </span>
          </div>
        </div>

        {/* Search Card */}
        <div className="hero-search">
          <h2>Find your next home</h2>
          <p>Tell us what you are looking for.</p>

          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Featured Properties */}
      <section className="page-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              Handpicked for you
            </span>

            <h2>Featured properties</h2>

            <p>
              Explore homes that match different lifestyles.
            </p>
          </div>

          <button
            type="button"
            className="text-link"
            onClick={() => navigate("/buy")}
          >
            View all
            <ArrowRight size={17} />
          </button>
        </div>

        <div className="property-grid">
          {featured.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>

        {featured.length === 0 && (
          <div className="empty-properties">
            <Search size={32} />
            <h3>No featured properties yet</h3>
            <p>
              Properties will appear here when they are available.
            </p>
          </div>
        )}
      </section>

      {/* Smart Match Banner */}
      <section className="smart-banner">
        <div className="smart-banner-icon">
          <Target size={34} />
        </div>

        <div className="smart-banner-content">
          <span className="eyebrow">
            Our unique feature
          </span>

          <h2>Meet your perfect property match.</h2>

          <p>
            Compare properties using a score out of 100 based
            on your own preferences.
          </p>
        </div>

        <button
          type="button"
          className="smart-banner-button"
          onClick={() => navigate("/smart-match")}
        >
          Try Smart Match
          <ArrowRight size={17} />
        </button>
      </section>
    </main>
  );
}

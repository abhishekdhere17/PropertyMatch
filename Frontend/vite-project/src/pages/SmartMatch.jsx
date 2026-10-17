
import { useState } from "react";
import { Target, SlidersHorizontal } from "lucide-react";
import PropertyCard from "../components/PropertyCard";
import { properties } from "../data/properties";
import "../styles/Properties.css";

export default function SmartMatch() {
  const [city, setCity] = useState("Pune");
  const [purpose, setPurpose] = useState("BUY");
  const [budget, setBudget] = useState("7500000");
  const [bhk, setBhk] = useState("2");
  const [area, setArea] = useState("900");
  const [parking, setParking] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);

  function calculateMatches(event) {
    event.preventDefault();

    const matched = properties
      .filter((p) => p.purpose === purpose)
      .filter((p) =>
        `${p.city} ${p.locality}`
          .toLowerCase()
          .includes(city.toLowerCase().trim())
      )
      .filter((p) => p.price <= Number(budget))
      .filter((p) => p.bhk === Number(bhk))
      .filter((p) => p.area >= Number(area))
      .filter((p) => !parking || p.parking)
      .map((p) => {
        let score = 0;

        score += p.price <= Number(budget) ? 30 : 0;
        score += p.city.toLowerCase() === city.toLowerCase() ? 25 : 15;
        score += p.area >= Number(area) ? 20 : 0;
        score += p.bhk === Number(bhk) ? 15 : 0;
        score += parking && p.parking ? 10 : 5;

        return { ...p, matchScore: score };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    setResults(matched);
    setSearched(true);
  }

  return (
    <main className="smart-match-page">
      <section className="smart-match-intro">
        <Target size={36} />
        <span className="eyebrow">PropertyMatch exclusive</span>
        <h1>Find your perfect match</h1>
        <p>
          Tell us what matters to you. Compare properties
          according to your requirements.
        </p>
      </section>

      <form className="match-form" onSubmit={calculateMatches}>
        <h2><SlidersHorizontal size={21} /> Your requirements</h2>

        <div className="match-form-grid">
          <label>
            Purpose
            <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
              <option value="BUY">Buy</option>
              <option value="RENT">Rent</option>
            </select>
          </label>

          <label>
            City
            <input value={city} onChange={(e) => setCity(e.target.value)} required />
          </label>

          <label>
            Maximum {purpose === "BUY" ? "price (₹)" : "monthly rent (₹)"}
            <input
              type="number"
              min="1"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </label>

          <label>
            Bedrooms
            <select value={bhk} onChange={(e) => setBhk(e.target.value)}>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
            </select>
          </label>

          <label>
            Minimum area (sq.ft.)
            <input
              type="number"
              min="1"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
          </label>

          <label className="match-checkbox">
            <input
              type="checkbox"
              checked={parking}
              onChange={(e) => setParking(e.target.checked)}
            />
            Parking required
          </label>
        </div>

        <button className="match-submit" type="submit">
          <Target size={18} /> Find My Matches
        </button>
      </form>

      {searched && (
        <section className="match-results">
          <h2>Your matching properties</h2>
          <p>{results.length} properties meet your selected filters.</p>

          {results.length ? (
            <div className="property-grid">
              {results.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No exact matches yet</h3>
              <p>Try a larger budget or a smaller minimum area.</p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

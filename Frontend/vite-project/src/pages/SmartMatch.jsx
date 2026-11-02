
import { useState } from "react";
import { Target, SlidersHorizontal } from "lucide-react";
import PropertyCard from "../components/PropertyCard";
import api from "../services/api";
import "../styles/SmartMatch.css";

export default function SmartMatch() {
  const [city, setCity] = useState("Pune");
  const [purpose, setPurpose] = useState("BUY");
  const [budget, setBudget] = useState("7500000");
  const [bhk, setBhk] = useState("2");
  const [area, setArea] = useState("900");
  const [parking, setParking] = useState(false);

  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function calculateMatches(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResults([]);
    setSearched(false);

    try {
      // Fetch approved properties from the Spring Boot backend.
      const response = await api.get("/properties", {
        params: {
          listingType: purpose,
          city: city.trim()
        }
      });

      const properties = response.data || [];

      // Apply Smart Match requirements to database properties.
      const matched = properties
        .filter((property) => {
          const propertyPrice = Number(property.price);
          const propertyBedrooms = Number(property.bedrooms);
          const propertyArea = Number(property.areaSqft);

          return (
            propertyPrice <= Number(budget) &&
            propertyBedrooms === Number(bhk) &&
            propertyArea >= Number(area)
          );
        })
        .map((property) => {
          let score = 0;

          const propertyPrice = Number(property.price);
          const propertyBedrooms = Number(property.bedrooms);
          const propertyArea = Number(property.areaSqft);

          // Budget match: 30 points.
          if (propertyPrice <= Number(budget)) {
            score += 30;
          }

          // Exact city match: 25 points.
          if (
            property.city?.toLowerCase() === city.trim().toLowerCase()
          ) {
            score += 25;
          } else {
            score += 15;
          }

          // Area match: 20 points.
          if (propertyArea >= Number(area)) {
            score += 20;
          }

          // Bedroom match: 15 points.
          if (propertyBedrooms === Number(bhk)) {
            score += 15;
          }

          // Parking is not currently available in the backend Property entity.
          // Do not award points for an unverified parking match.

          return {
            ...property,
            matchScore: score
          };
        })
        .sort((a, b) => b.matchScore - a.matchScore);

      setResults(matched);
      setSearched(true);

    } catch (err) {
      console.error(
        "Smart Match API error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.error ||
        "Unable to load properties. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="smart-match-page">

      <section className="smart-match-intro">
        <Target size={36} />

        <span className="eyebrow">
          PropertyMatch exclusive
        </span>

        <h1>Find your perfect match</h1>

        <p>
          Tell us what matters to you. Compare properties
          according to your requirements.
        </p>
      </section>

      <form className="match-form" onSubmit={calculateMatches}>

        <h2>
          <SlidersHorizontal size={21} />
          Your requirements
        </h2>

        <div className="match-form-grid">

          <label>
            Purpose

            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            >
              <option value="BUY">Buy</option>
              <option value="RENT">Rent</option>
            </select>
          </label>

          <label>
            City

            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
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

            <select
              value={bhk}
              onChange={(e) => setBhk(e.target.value)}
            >
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

        <button
          className="match-submit"
          type="submit"
          disabled={loading}
        >
          <Target size={18} />

          {loading ? "Finding matches..." : "Find My Matches"}
        </button>

      </form>

      {parking && (
        <p>
          Note: Parking information is not currently stored in the
          backend, so this preference cannot yet be verified.
        </p>
      )}

      {error && (
        <div className="empty-state">
          <h3>Something went wrong</h3>
          <p>{error}</p>
        </div>
      )}

      {searched && !error && (
        <section className="match-results">

          <h2>Your matching properties</h2>

          <p>
            {results.length} properties meet your selected filters.
          </p>

          {results.length > 0 ? (
            <div className="property-grid">
              {results.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No exact matches yet</h3>

              <p>
                Try increasing your budget, reducing your minimum
                area, or changing your bedroom requirement.
              </p>
            </div>
          )}

        </section>
      )}

    </main>
  );
}

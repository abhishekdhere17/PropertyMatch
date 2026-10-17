
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import { properties } from "../data/properties";
import "../styles/Properties.css";

export default function Properties({ purpose }) {
  const location = useLocation();
  const initialFilters = location.state?.filters || {};

  const [city, setCity] = useState(initialFilters.city || "");
  const [maxPrice, setMaxPrice] = useState(
    initialFilters.maxPrice?.toString() || ""
  );
  const [bedrooms, setBedrooms] = useState("");
  const [minArea, setMinArea] = useState("");
  const [sort, setSort] = useState("match");

  const results = useMemo(() => {
    let filtered = properties.filter(
      (property) => property.purpose === purpose
    );

    if (city.trim()) {
      filtered = filtered.filter((property) =>
        `${property.city} ${property.locality}`
          .toLowerCase()
          .includes(city.trim().toLowerCase())
      );
    }

    if (maxPrice !== "") {
      filtered = filtered.filter(
        (property) => property.price <= Number(maxPrice)
      );
    }

    if (bedrooms) {
      filtered = filtered.filter(
        (property) => property.bhk === Number(bedrooms)
      );
    }

    if (minArea) {
      filtered = filtered.filter(
        (property) => property.area >= Number(minArea)
      );
    }

    if (sort === "match") {
      filtered.sort(
        (a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0)
      );
    } else if (sort === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [purpose, city, maxPrice, bedrooms, minArea, sort]);

  return (
    <main className="listing-page">
      <div className="listing-heading">
        <span className="eyebrow">Explore properties</span>
        <h1>{purpose === "BUY" ? "Properties for Sale" : "Properties for Rent"}</h1>
        <p>
          Find a property that matches your needs and budget.
        </p>
      </div>

      <section className="listing-filters">
        <label>
          City or locality
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Pune, Wakad"
          />
        </label>

        <label>
          Maximum {purpose === "BUY" ? "price (₹)" : "rent (₹/month)"}
          <input
            type="number"
            min="1"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Maximum budget"
          />
        </label>

        <label>
          Bedrooms
          <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
            <option value="">Any BHK</option>
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
            value={minArea}
            onChange={(e) => setMinArea(e.target.value)}
            placeholder="e.g. 1000"
          />
        </label>

        <label>
          Sort results
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="match">Best match</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </section>

      <div className="listing-results-heading">
        <p><strong>{results.length}</strong> properties found</p>
        <span>Demo data · API integration pending</span>
      </div>

      {results.length > 0 ? (
        <div className="property-grid">
          {results.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No matching properties found</h2>
          <p>Try changing your budget, location, or bedroom filters.</p>
          <button
            onClick={() => {
              setCity("");
              setMaxPrice("");
              setBedrooms("");
              setMinArea("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}

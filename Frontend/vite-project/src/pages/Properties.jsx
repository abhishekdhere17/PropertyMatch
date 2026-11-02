
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import api from "../services/api";
import "../styles/Properties.css";
import "../styles/PropertyCard.css";

export default function Properties({ purpose }) {
  const location = useLocation();
  const initialFilters = location.state?.filters || {};

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [city, setCity] = useState(initialFilters.city || "");
  const [maxPrice, setMaxPrice] = useState(
    initialFilters.maxPrice?.toString() || ""
  );
  const [bedrooms, setBedrooms] = useState("");
  const [minArea, setMinArea] = useState("");
  const [sort, setSort] = useState("match");

  useEffect(() => {
    let active = true;

    async function loadProperties() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/properties", {
          params: { listingType: purpose },
        });

        if (!active) return;

        const data = Array.isArray(response.data) ? response.data : [];

        // Map backend fields to the names used by the existing UI.
        // const mappedProperties = data.map((property) => ({
        //   ...property,
        //   purpose: property.listingType,
        //   bhk: property.bedrooms,
        //   area: property.areaSqft,
        //   locality: property.locality || property.address || "",
        //   image: property.imageUrl || property.image || "",
        // }));
        const mappedProperties = data.map((property) => ({
          ...property,
          purpose: property.listingType,
          bhk: property.bedrooms,
          area: property.areaSqft,
          locality: property.locality || property.address || "",
          image: property.imageUrl || property.image || "",
          images: property.imageUrl
            ? [property.imageUrl]
            : property.images || [],
        }));

        setProperties(mappedProperties);
      } catch (err) {
        console.error("Load properties error:", err);

        if (active) {
          setError(
            err.response?.status === 401
              ? "Please log in to view properties."
              : err.response?.status === 403
              ? "You do not have permission to view these properties."
              : "Unable to load properties. Please check the backend and try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProperties();

    return () => {
      active = false;
    };
  }, [purpose]);

  const results = useMemo(() => {
    let filtered = properties.filter(
      (property) => property.purpose === purpose
    );

    if (city.trim()) {
      filtered = filtered.filter((property) =>
        `${property.city || ""} ${property.locality || ""}`
          .toLowerCase()
          .includes(city.trim().toLowerCase())
      );
    }

    if (maxPrice !== "") {
      filtered = filtered.filter(
        (property) => Number(property.price) <= Number(maxPrice)
      );
    }

    if (bedrooms) {
      filtered = filtered.filter(
        (property) => Number(property.bhk) === Number(bedrooms)
      );
    }

    if (minArea) {
      filtered = filtered.filter(
        (property) => Number(property.area) >= Number(minArea)
      );
    }

    if (sort === "match") {
      filtered.sort(
        (a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0)
      );
    } else if (sort === "price-low") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price-high") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return filtered;
  }, [properties, purpose, city, maxPrice, bedrooms, minArea, sort]);

  function clearFilters() {
    setCity("");
    setMaxPrice("");
    setBedrooms("");
    setMinArea("");
  }

  return (
    <main className="listing-page">
      <div className="listing-heading">
        <span className="eyebrow">Explore properties</span>
        <h1>
          {purpose === "BUY"
            ? "Properties for Sale"
            : "Properties for Rent"}
        </h1>
        <p>Find a property that matches your needs and budget.</p>
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
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
          >
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
        <p>
          <strong>{loading ? "…" : results.length}</strong> properties found
        </p>
        <span>Live property listings</span>
      </div>

      {loading ? (
        <p>Loading properties...</p>
      ) : error ? (
        <div className="empty-state">
          <h2>Could not load properties</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      ) : results.length > 0 ? (
        <div className="property-grid">
          {results.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No matching properties found</h2>
          <p>
            Try changing your budget, location, or bedroom filters.
          </p>
          <button onClick={clearFilters}>Clear filters</button>
        </div>
      )}
    </main>
  );
}


import { useState } from "react";
import { Search, MapPin } from "lucide-react";

export default function SearchBar({ onSearch }) {
  const [purpose, setPurpose] = useState("BUY");
  const [city, setCity] = useState("Pune");
  const [budget, setBudget] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    onSearch?.({
      purpose,
      city: city.trim(),
      maxPrice: budget ? Number(budget) : null,
    });
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <label className="search-field">
        <span>Looking to</span>
        <select
          value={purpose}
          onChange={(event) => setPurpose(event.target.value)}
        >
          <option value="BUY">Buy</option>
          <option value="RENT">Rent</option>
        </select>
      </label>

      <label className="search-field">
        <span>Location</span>
        <div className="search-location-input">
          <MapPin size={18} />
          <input
            type="text"
            placeholder="Enter city or locality"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            required
          />
        </div>
      </label>

      <label className="search-field">
        <span>Maximum budget (₹)</span>
        <input
          type="number"
          min="1"
          placeholder="e.g. 7500000"
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
        />
      </label>

      <button type="submit" className="search-submit">
        <Search size={18} />
        Search
      </button>
    </form>
  );
}

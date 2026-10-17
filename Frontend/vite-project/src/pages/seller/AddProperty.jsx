
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const initialForm = {
  title: "",
  description: "",
  purpose: "BUY",
  propertyType: "APARTMENT",
  price: "",
  city: "Pune",
  locality: "",
  bhk: "2",
  bathrooms: "2",
  area: "",
  parking: false,
};

export default function AddProperty() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const body = new FormData();

      const property = {
        ...form,
        price: Number(form.price),
        bhk: Number(form.bhk),
        bathrooms: Number(form.bathrooms),
        area: Number(form.area),
      };

      body.append(
        "property",
        new Blob([JSON.stringify(property)], {
          type: "application/json",
        })
      );

      images.forEach((image) => body.append("images", image));

      await api.post("/properties", body);
      navigate("/seller/my-properties");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not submit the listing. Check the backend connection."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="dashboard-page">
      <h1>Add a Property</h1>
      <p>Provide accurate property details and upload clear photos.</p>

      <form className="property-form" onSubmit={handleSubmit}>
        <label>
          Property title
          <input name="title" value={form.title} onChange={updateField} required />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            rows={4}
            required
          />
        </label>

        <div className="form-grid">
          <label>
            Listing purpose
            <select name="purpose" value={form.purpose} onChange={updateField}>
              <option value="BUY">For Sale</option>
              <option value="RENT">For Rent</option>
            </select>
          </label>

          <label>
            Property type
            <select
              name="propertyType"
              value={form.propertyType}
              onChange={updateField}
            >
              <option value="APARTMENT">Apartment</option>
              <option value="HOUSE">Independent House</option>
              <option value="VILLA">Villa</option>
              <option value="PLOT">Plot / Land</option>
              <option value="COMMERCIAL">Commercial</option>
            </select>
          </label>

          <label>
            Price / monthly rent (₹)
            <input
              name="price"
              type="number"
              min="1"
              value={form.price}
              onChange={updateField}
              required
            />
          </label>

          <label>
            City
            <input name="city" value={form.city} onChange={updateField} required />
          </label>

          <label>
            Locality
            <input
              name="locality"
              value={form.locality}
              onChange={updateField}
              required
            />
          </label>

          <label>
            Bedrooms
            <select name="bhk" value={form.bhk} onChange={updateField}>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
            </select>
          </label>

          <label>
            Bathrooms
            <input
              name="bathrooms"
              type="number"
              min="0"
              value={form.bathrooms}
              onChange={updateField}
              required
            />
          </label>

          <label>
            Area (sq. ft.)
            <input
              name="area"
              type="number"
              min="1"
              value={form.area}
              onChange={updateField}
              required
            />
          </label>
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="parking"
            checked={form.parking}
            onChange={updateField}
          />
          Parking available
        </label>

        <label>
          Property photos (multiple)
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) =>
              setImages(Array.from(event.target.files || []))
            }
          />
        </label>

        <p>{images.length} photo(s) selected</p>

        {error && <p className="dashboard-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Property for Review"}
        </button>
      </form>
    </main>
  );
}

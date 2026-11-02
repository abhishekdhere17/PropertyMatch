
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

const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

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

  function handleImageSelection(event) {
    setError("");

    const selected = Array.from(event.target.files || []);
    event.target.value = "";

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (images.length + selected.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    for (const file of selected) {
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPG, PNG and WebP images are allowed.");
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setError(`${file.name} is larger than 5 MB.`);
        return;
      }
    }

    setImages((previous) => [...previous, ...selected]);
  }

  function removeImage(index) {
    setImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const propertyData = {
      title: form.title.trim(),
      description: form.description.trim(),
      propertyType: form.propertyType,
      city: form.city.trim(),
      address: `${form.locality.trim()}, ${form.city.trim()}`,
      listingType: form.purpose,
      price: Number(form.price),
      bedrooms: Number(form.bhk),
      bathrooms: Number(form.bathrooms),
      areaSqft: Number(form.area),
    };

    if (
      !propertyData.title ||
      !propertyData.description ||
      !propertyData.city ||
      !form.locality.trim() ||
      !propertyData.price ||
      propertyData.price <= 0 ||
      !propertyData.areaSqft ||
      propertyData.areaSqft <= 0
    ) {
      setError("Please fill in all required property details.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "property",
        new Blob([JSON.stringify(propertyData)], {
          type: "application/json",
        })
      );

      images.forEach((image) => {
        formData.append("images", image);
      });

      await api.post("/properties", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Property submitted successfully for admin approval!");

      navigate("/seller/my-properties");
    } catch (err) {
      console.error("Add property error:", err.response?.data || err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Could not submit the listing. Please try again."
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
          <input
            name="title"
            value={form.title}
            onChange={updateField}
            required
          />
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
            <select
              name="purpose"
              value={form.purpose}
              onChange={updateField}
            >
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
            <input
              name="city"
              value={form.city}
              onChange={updateField}
              required
            />
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
            <select
              name="bhk"
              value={form.bhk}
              onChange={updateField}
            >
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

        <label className="photo-upload-label">
          Property photos (maximum 8)

          <input
            className="property-file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImageSelection}
          />
        </label>

        <p>{images.length} / {MAX_IMAGES} photo(s) selected</p>

        {images.length > 0 && (
          <div className="selected-property-images">
            {images.map((image, index) => (
              <div className="selected-property-image" key={`${image.name}-${index}`}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Selected property ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label={`Remove image ${index + 1}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="dashboard-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Uploading and submitting..." : "Submit Property for Review"}
        </button>
      </form>
    </main>
  );
}

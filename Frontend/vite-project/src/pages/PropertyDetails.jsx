
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Ruler, Phone } from "lucide-react";
import { properties } from "../data/properties";
import "../styles/PropertyDetails.css";

export default function PropertyDetails() {
  const { id } = useParams();
  const property = properties.find((p) => p.id === Number(id));
  const [activeImage, setActiveImage] = useState(0);

  if (!property) {
    return (
      <main className="listing-page">
        <h1>Property not found</h1>
        <p>This listing may have been removed or is unavailable.</p>
        <Link to="/buy">Browse properties</Link>
      </main>
    );
  }

  return (
    <main className="property-details-page">
      <div className="details-heading">
        <div>
          <span className="eyebrow">
            {property.purpose === "RENT" ? "For Rent" : "For Sale"}
          </span>
          <h1>{property.title}</h1>
          <p><MapPin size={17} /> {property.locality}, {property.city}</p>
        </div>

        <div className="details-price">
          <strong>₹{property.price.toLocaleString("en-IN")}</strong>
          {property.purpose === "RENT" && <span>per month</span>}
        </div>
      </div>

      <div className="details-gallery">
        <img
          className="details-main-image"
          src={property.images[activeImage]}
          alt={property.title}
        />

        <div className="details-thumbnails">
          {property.images.map((image, index) => (
            <button
              key={image}
              className={activeImage === index ? "thumbnail active" : "thumbnail"}
              onClick={() => setActiveImage(index)}
              type="button"
            >
              <img src={image} alt={`${property.title} photo ${index + 1}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="details-layout">
        <section className="details-main">
          <h2>Property overview</h2>

          <div className="details-features">
            <span><BedDouble /> {property.bhk} BHK</span>
            <span><Bath /> {property.bathrooms} Bathrooms</span>
            <span><Ruler /> {property.area} sq.ft.</span>
          </div>

          <h2>Description</h2>
          <p>{property.description}</p>

          <h2>Amenities</h2>
          <div className="details-amenities">
            {property.amenities.map((amenity) => (
              <span key={amenity}>{amenity}</span>
            ))}
          </div>
        </section>

        <aside className="owner-contact-panel">
          <h2>Contact owner</h2>
          <p>Listed by {property.owner?.name || "Property Owner"}</p>

          {property.owner?.phone ? (
            <a href={`tel:${property.owner.phone}`} className="contact-owner">
              <Phone size={18} /> Call owner
            </a>
          ) : (
            <p className="contact-note">
              Owner contact will be available when the listing is verified.
            </p>
          )}

          <p className="contact-note">
            Confirm property availability and details directly with the owner.
          </p>
        </aside>
      </div>
    </main>
  );
}

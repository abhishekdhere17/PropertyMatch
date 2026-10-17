
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  CarFront,
  Images,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import "./../styles/PropertyCard.css";

export default function PropertyCard({ property }) {
  const [saved, setSaved] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  if (!property) return null;

  const images = property.images?.length
    ? property.images
    : ["https://placehold.co/800x550?text=Property+Image"];

  const formatPrice = (price) => {
    if (property.purpose === "RENT") {
      return `₹${Number(price).toLocaleString("en-IN")}/month`;
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const score = property.matchScore;
  const hasScore = Number.isFinite(score);

  return (
    <article className="property-card">
      <div className="property-image-wrap">
        <img
          src={images[imageIndex]}
          alt={property.title}
          className="property-image"
          onError={(event) => {
            event.currentTarget.src =
              "https://placehold.co/800x550?text=Image+Unavailable";
          }}
        />

        <span className="property-purpose">
          {property.purpose === "RENT" ? "For Rent" : "For Sale"}
        </span>

        <button
          type="button"
          className={`save-property ${saved ? "is-saved" : ""}`}
          onClick={() => setSaved(!saved)}
          aria-label={saved ? "Unsave property" : "Save property"}
        >
          <Heart size={19} fill={saved ? "currentColor" : "none"} />
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="image-nav image-prev"
              onClick={() =>
                setImageIndex(
                  (imageIndex - 1 + images.length) % images.length
                )
              }
              aria-label="Previous photo"
            >
              ‹
            </button>

            <button
              type="button"
              className="image-nav image-next"
              onClick={() =>
                setImageIndex((imageIndex + 1) % images.length)
              }
              aria-label="Next photo"
            >
              ›
            </button>

            <span className="image-count">
              <Images size={14} />
              {imageIndex + 1}/{images.length}
            </span>
          </>
        )}
      </div>

      <div className="property-card-body">
        <div className="property-heading">
          <div>
            <h3>{property.title}</h3>
            <p className="property-location">
              <MapPin size={15} />
              {property.locality}, {property.city}
            </p>
          </div>

          {hasScore && (
            <div
              className={`match-score ${
                score >= 85 ? "score-high" : "score-normal"
              }`}
              title="Calculated from the selected search preferences"
            >
              <strong>{score}</strong>
              <span>/100 match</span>
            </div>
          )}
        </div>

        <div className="property-price">
          {formatPrice(property.price)}
        </div>

        <div className="property-features">
          <span>
            <BedDouble size={17} />
            {property.bhk} BHK
          </span>

          <span>
            <Bath size={17} />
            {property.bathrooms ?? "—"} Bath
          </span>

          <span>
            <Ruler size={17} />
            {Number(property.area).toLocaleString("en-IN")} sq.ft.
          </span>

          {property.parking && (
            <span>
              <CarFront size={17} />
              Parking
            </span>
          )}
        </div>

        {property.amenities?.length > 0 && (
          <div className="property-amenities">
            {property.amenities.slice(0, 3).map((amenity) => (
              <span key={amenity}>{amenity}</span>
            ))}
            {property.amenities.length > 3 && (
              <span>+{property.amenities.length - 3}</span>
            )}
          </div>
        )}

        <div className="property-owner">
          <div className="owner-avatar">
            {(property.owner?.name || "O").charAt(0).toUpperCase()}
          </div>

          <div className="owner-details">
            <strong>{property.owner?.name || "Property Owner"}</strong>
            <span>Listed by owner</span>
          </div>

          {property.owner?.phone && (
            <a
              className="owner-phone"
              href={`tel:${property.owner.phone}`}
              aria-label="Call property owner"
            >
              <Phone size={17} />
            </a>
          )}
        </div>

        <div className="property-card-actions">
          <Link
            to={`/property/${property.id}`}
            className="property-details-link"
          >
            View Details
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}

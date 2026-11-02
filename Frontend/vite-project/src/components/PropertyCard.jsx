
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Phone,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getImageUrl } from "../services/api";

export default function PropertyCard({ property }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const images =
    property.images?.length > 0
      ? property.images
      : property.imageUrl
        ? [property.imageUrl]
        : [];

  const image = images[activeImage];

  const price = Number(property.price || 0).toLocaleString("en-IN");

  const location = [
    property.locality || property.address,
    property.city,
  ]
    .filter(Boolean)
    .join(", ");

  const bedrooms = property.bhk ?? property.bedrooms;
  const area = property.area ?? property.areaSqft;

  const ownerName = property.owner?.name || "Property Owner";
  const ownerPhone = property.owner?.phone || "";

  const isRent =
    property.purpose === "RENT" ||
    property.listingType === "RENT";

  function changeImage(direction) {
    setImageFailed(false);

    setActiveImage((current) =>
      direction === "next"
        ? (current + 1) % images.length
        : current === 0
          ? images.length - 1
          : current - 1
    );
  }

  return (
    <article className="property-card">
      <div className="property-image-wrap">
        {image && !imageFailed ? (
          <img
            key={image}
            className="property-image"
            src={getImageUrl(image)}
            alt={property.title || "Property"}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="property-image-placeholder">
            Property image unavailable
          </div>
        )}

        <span className="property-purpose">
          {isRent ? "For Rent" : "For Sale"}
        </span>

        <button
          type="button"
          className={`save-property ${isSaved ? "is-saved" : ""}`}
          onClick={() => setIsSaved((saved) => !saved)}
          aria-label={isSaved ? "Unsave property" : "Save property"}
        >
          <Heart size={19} fill={isSaved ? "currentColor" : "none"} />
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="image-nav image-prev"
              aria-label="Previous image"
              onClick={() => changeImage("previous")}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              className="image-nav image-next"
              aria-label="Next image"
              onClick={() => changeImage("next")}
            >
              <ChevronRight size={20} />
            </button>

            <span className="image-count">
              {activeImage + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      <div className="property-card-body">
        <div className="property-heading">
          <div>
            <h3>{property.title || "Property listing"}</h3>

            <p className="property-location">
              <MapPin size={15} />
              {location || "Location not specified"}
            </p>
          </div>

          {property.matchScore != null && (
            <div
              className={`match-score ${
                property.matchScore >= 85
                  ? "score-high"
                  : "score-normal"
              }`}
            >
              <strong>{property.matchScore}</strong>
              <span>Match</span>
            </div>
          )}
        </div>

        <p className="property-price">
          ₹{price}
          {isRent && <span> / month</span>}
        </p>

        <div className="property-features">
          {bedrooms != null && (
            <span>
              <BedDouble size={16} />
              {bedrooms} BHK
            </span>
          )}

          {property.bathrooms != null && (
            <span>
              <Bath size={16} />
              {property.bathrooms} Baths
            </span>
          )}

          {area != null && (
            <span>
              <Ruler size={16} />
              {area} sq.ft.
            </span>
          )}
        </div>

        {property.amenities?.length > 0 && (
          <div className="property-amenities">
            {property.amenities.slice(0, 4).map((amenity) => (
              <span key={amenity}>{amenity}</span>
            ))}
          </div>
        )}

        <div className="property-owner">
          <div className="owner-avatar">
            {ownerName.charAt(0).toUpperCase()}
          </div>

          <div className="owner-details">
            <strong>{ownerName}</strong>
            <span>Property owner</span>
          </div>

          {ownerPhone && (
            <a
              className="owner-phone"
              href={`tel:${ownerPhone}`}
              aria-label={`Call ${ownerName}`}
            >
              <Phone size={17} />
            </a>
          )}
        </div>

        <div className="property-card-actions">
          <Link
            className="property-details-link"
            to={`/property/${property.id}`}
          >
            View Property Details
          </Link>
        </div>
      </div>
    </article>
  );
}

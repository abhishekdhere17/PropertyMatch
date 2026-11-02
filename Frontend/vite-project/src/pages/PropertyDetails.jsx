
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Phone,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import api, { getImageUrl } from "../services/api";
import "../styles/PropertyDetails.css";

export default function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadProperty() {
      setLoading(true);
      setError("");
      setProperty(null);
      setActiveImage(0);

      try {
        const response = await api.get(`/properties/${id}`);

        if (!cancelled) {
          setProperty(response.data);
        }
      } catch (err) {
        console.error("Property details error:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            "Unable to load this property. It may be unavailable."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadProperty();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="listing-page">
        <p>Loading property details...</p>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="listing-page">
        <h1>Property not found</h1>
        <p>
          {error ||
            "This listing may have been removed or is unavailable."}
        </p>
        <Link to="/buy">Browse properties</Link>
      </main>
    );
  }

  // Support both the new images array and older imageUrl field.
  const propertyImages =
    Array.isArray(property.images) && property.images.length > 0
      ? property.images
      : property.imageUrl
        ? [property.imageUrl]
        : [];

  // Convert backend image paths into complete browser URLs.
  const images = propertyImages.map((image) => getImageUrl(image));

  const listingType = property.listingType || property.purpose;
  const bedrooms = property.bedrooms ?? property.bhk;
  const area = property.areaSqft ?? property.area;

  const location = [
    property.address,
    property.city
  ].filter(Boolean).join(", ");

  const ownerName = property.owner?.name || "Property Owner";
  const ownerPhone = property.owner?.phone || "";

  const cleanPhone = ownerPhone.replace(/\D/g, "");

  const whatsappNumber =
    cleanPhone.length === 10
      ? `91${cleanPhone}`
      : cleanPhone;

  const showPreviousImage = () => {
    setActiveImage((previous) =>
      previous === 0 ? images.length - 1 : previous - 1
    );
  };

  const showNextImage = () => {
    setActiveImage((previous) =>
      previous === images.length - 1 ? 0 : previous + 1
    );
  };

  return (
    <main className="property-details-page">

      {/* Property heading */}
      <div className="details-heading">
        <div>
          <span className="eyebrow">
            {listingType === "RENT" ? "For Rent" : "For Sale"}
          </span>

          <h1>{property.title}</h1>

          <p>
            <MapPin size={17} /> {location}
          </p>
        </div>

        <div className="details-price">
          <strong>
            ₹{Number(property.price || 0).toLocaleString("en-IN")}
          </strong>

          {listingType === "RENT" && <span>per month</span>}
        </div>
      </div>

      {/* Property image gallery */}
      <div className="details-gallery">
        {images.length > 0 ? (
          <>
            <div className="details-main-image-wrapper">

              <img
                key={activeImage}
                className="details-main-image"
                src={images[activeImage]}
                alt={`${property.title} photo ${activeImage + 1}`}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="gallery-arrow gallery-prev"
                    onClick={showPreviousImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    type="button"
                    className="gallery-arrow gallery-next"
                    onClick={showNextImage}
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>

                  <span className="gallery-counter">
                    {activeImage + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="details-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={
                      activeImage === index
                        ? "thumbnail active"
                        : "thumbnail"
                    }
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${property.title} photo ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="property-image-placeholder">
            Property image unavailable
          </div>
        )}
      </div>

      {/* Property information */}
      <div className="details-layout">

        <section className="details-main">

          <h2>Property overview</h2>

          <div className="details-features">
            {bedrooms != null && (
              <span>
                <BedDouble /> {bedrooms} BHK
              </span>
            )}

            {property.bathrooms != null && (
              <span>
                <Bath /> {property.bathrooms} Bathrooms
              </span>
            )}

            {area != null && (
              <span>
                <Ruler /> {area} sq.ft.
              </span>
            )}
          </div>

          <h2>Description</h2>
          <p>{property.description}</p>

          <h2>Property information</h2>
          <p>
            Property type: {property.propertyType || "Not specified"}
          </p>
          <p>Listing ID: {property.id}</p>

        </section>

        {/* Owner contact */}

        {/* Owner contact */}
        <aside className="owner-contact-panel">

          <h2>Contact owner</h2>

          <p>Listed by {ownerName}</p>

          {ownerPhone ? (
            <>
              <a
                href={`tel:${ownerPhone}`}
                className="contact-owner"
              >
                <Phone size={18} />
                Call owner
              </a>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hello ${ownerName}, I am interested in your property "${property.title}" listed on PropertyMatch. Is it still available?`
                )}`}
                className="contact-owner whatsapp-owner"
                target="_blank"
                rel="noopener noreferrer"
              >
                Message on WhatsApp
              </a>

              <p className="contact-note">
                Contact the owner to confirm property availability
                and schedule a visit.
              </p>
            </>
          ) : (
            <p className="contact-note">
              Owner contact details are not available yet.
            </p>
          )}

        </aside>

      </div>
    </main>
  );
}

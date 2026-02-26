// src/components/hotelCard/HotelCard.jsx
// Reused in: Hotels.jsx, FeaturedSection.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HotelCard.css";

const getRatingLabel = (r) => {
  if (r >= 4.5) return "Exceptional";
  if (r >= 4.0) return "Excellent";
  if (r >= 3.5) return "Very Good";
  return "Good";
};

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const image =
    !imgError && hotel.photos?.length > 0
      ? hotel.photos[0]
      : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80";

  return (
    <div className="hotel-card" onClick={() => navigate(`/hotels/${hotel._id}`)}>

      {/* Image */}
      <div className="hotel-card__image-wrapper">
        <img
          src={image}
          alt={hotel.name}
          className="hotel-card__image"
          onError={() => setImgError(true)}
        />
        {hotel.featured && (
          <span className="hotel-card__badge hotel-card__badge--featured">★ Featured</span>
        )}
        <span className="hotel-card__badge hotel-card__badge--type">{hotel.type}</span>
      </div>

      {/* Info */}
      <div className="hotel-card__body">
        <div className="hotel-card__top">
          <div>
            <h3 className="hotel-card__name">{hotel.name}</h3>
            <p className="hotel-card__location">
              📍 {hotel.city} · {hotel.distance} from centre
            </p>
          </div>
          {hotel.rating && (
            <div className="hotel-card__rating">
              <span className="hotel-card__rating-label">{getRatingLabel(hotel.rating)}</span>
              <span className="hotel-card__rating-score">{hotel.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <p className="hotel-card__title">{hotel.title}</p>
        <p className="hotel-card__desc">{hotel.description}</p>

        <div className="hotel-card__footer">
          <div className="hotel-card__price">
            <span className="hotel-card__price-from">Starting from</span>
            <span className="hotel-card__price-amount">
              ₹{hotel.cheapestPrice.toLocaleString("en-IN")}
            </span>
            <span className="hotel-card__price-night">/night</span>
          </div>
          <button
            className="btn--outline"
            onClick={(e) => { e.stopPropagation(); navigate(`/hotels/${hotel._id}`); }}
          >
            See Availability
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;

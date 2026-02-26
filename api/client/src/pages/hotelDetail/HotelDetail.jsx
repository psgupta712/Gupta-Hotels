// src/pages/hotelDetail/HotelDetail.jsx

import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import Navbar            from "../../components/navbar/Navbar";
import Footer            from "../../components/footer/Footer";
import AvailabilityModal from "./components/AvailabilityModal";
import { getRatingLabel, getNights } from "../../utils/bookingHelpers";
import "./HotelDetail.css";

// ── Fallback photos ──────────────────────────────────────────
const FALLBACKS = [
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
];

// ── RoomCard ─────────────────────────────────────────────────
const RoomCard = ({ roomId, checkIn, checkOut, guests, onReserve }) => {
  const { data: room, loading } = useFetch(`/room/${roomId}`);

  if (loading) return <div className="room-card skeleton" style={{ height: 120 }} />;
  if (!room)   return null;

  const fitsGuests  = room.maxPeople >= guests;
  const datesChosen = !!(checkIn && checkOut);
  const canReserve  = fitsGuests && datesChosen;

  const availableCount = datesChosen
    ? room.roomNumbers.filter((rn) => !rn.unavailableDates?.some((d) => {
        const bd = new Date(d);
        return bd >= new Date(checkIn) && bd <= new Date(checkOut);
      })).length
    : room.roomNumbers.length;

  return (
    <div className={`room-card ${!fitsGuests ? "room-card--disabled" : ""}`}>
      <div className="room-card__info">
        <div className="room-card__top">
          <div>
            <h3 className="room-card__title">{room.title}</h3>
            <p className="room-card__desc">{room.desc}</p>
          </div>
          <div className="room-card__pricing">
            <span className="room-card__price">₹{room.price.toLocaleString("en-IN")}</span>
            <span className="room-card__per">/night</span>
          </div>
        </div>

        <div className="room-card__meta">
          <span className="room-card__meta-item">👥 Max {room.maxPeople} guests</span>
          <span className="room-card__meta-item">🚪 {room.roomNumbers.length} units</span>
          {datesChosen && (
            <span className={`room-card__meta-item ${availableCount === 0 ? "room-card__meta-item--none" : "room-card__meta-item--avail"}`}>
              {availableCount === 0 ? "❌ Fully booked" : `✓ ${availableCount} available`}
            </span>
          )}
          {!fitsGuests && (
            <span className="room-card__meta-item room-card__meta-item--warn">⚠ Too small for {guests} guests</span>
          )}
        </div>
      </div>

      <button
        className={`room-card__reserve-btn ${!canReserve ? "room-card__reserve-btn--disabled" : ""}`}
        disabled={!canReserve || availableCount === 0}
        onClick={() => canReserve && onReserve(room)}
        title={!datesChosen ? "Select dates first" : !fitsGuests ? "Room too small" : "Reserve this room"}
      >
        {!datesChosen ? "Select Dates First" : availableCount === 0 ? "Fully Booked" : "Reserve →"}
      </button>
    </div>
  );
};

// ── Main HotelDetail ─────────────────────────────────────────
const HotelDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // ✅ auth check

  const [checkIn,  setCheckIn]  = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests,   setGuests]   = useState(1);
  const [modal,    setModal]    = useState(null);
  const [success,  setSuccess]  = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const { data: hotel, loading, error } = useFetch(`/hotel/find/${id}`);
  const today  = new Date().toISOString().split("T")[0];
  const nights = getNights(checkIn, checkOut);
  const photos = hotel?.photos?.length > 0 ? hotel.photos : FALLBACKS;

  const handleSuccess = () => {
    setModal(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  if (loading) return (
    <div className="detail-page">
      <Navbar />
      <div className="detail-loading">
        <div className="detail-loading__hero skeleton" />
        <div className="detail-loading__body">
          {[1,2,3].map((i) => <div key={i} className="detail-loading__row skeleton" />)}
        </div>
      </div>
    </div>
  );

  if (error || !hotel) return (
    <div className="detail-page">
      <Navbar />
      <div className="detail-error-state">
        <span>⚠</span>
        <h2>Hotel not found</h2>
        <p>This property may no longer be available.</p>
        <button className="btn--outline" onClick={() => navigate("/hotels")}>← Back to Hotels</button>
      </div>
    </div>
  );

  return (
    <div className="detail-page">
      <Navbar />

      {/* ── Breadcrumb ── */}
      <div className="detail-breadcrumb">
        <span onClick={() => navigate("/")}>Home</span>
        <span className="detail-breadcrumb__sep">/</span>
        <span onClick={() => navigate("/hotels")}>Hotels</span>
        <span className="detail-breadcrumb__sep">/</span>
        <span className="detail-breadcrumb__current">{hotel.name}</span>
      </div>

      {/* ── Photo Gallery ── */}
      <div className="detail-gallery">
        <div className="detail-gallery__main" onClick={() => setLightbox(0)}>
          <img src={photos[0]} alt={hotel.name} className="detail-gallery__img" />
          <div className="detail-gallery__overlay">
            <span className="detail-gallery__view-btn">🖼 View All Photos</span>
          </div>
        </div>
        <div className="detail-gallery__side">
          {photos.slice(1, 5).map((photo, i) => (
            <div key={i} className="detail-gallery__thumb" onClick={() => setLightbox(i + 1)}>
              <img src={photo} alt="" className="detail-gallery__img" />
              {i === 3 && photos.length > 5 && (
                <div className="detail-gallery__more">+{photos.length - 5}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox__close" onClick={() => setLightbox(null)}>×</button>
            <button className="lightbox__arrow lightbox__arrow--left"
              onClick={() => setLightbox((i) => (i - 1 + photos.length) % photos.length)}>‹</button>
            <img src={photos[lightbox]} alt="" className="lightbox__img" />
            <button className="lightbox__arrow lightbox__arrow--right"
              onClick={() => setLightbox((i) => (i + 1) % photos.length)}>›</button>
            <span className="lightbox__counter">{lightbox + 1} / {photos.length}</span>
          </div>
        </div>
      )}

      {/* ── Success Banner ── */}
      {success && (
        <div className="detail-success-banner">
          ✓ Booking confirmed! Your room has been reserved successfully.
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="detail-body">

        {/* ── LEFT: hotel info + rooms ── */}
        <div className="detail-main">

          {/* Hotel header */}
          <div className="detail-hotel-header">
            <div>
              <span className="detail-type-badge">{hotel.type}</span>
              {hotel.featured && <span className="detail-featured-badge">★ Featured</span>}
              <h1 className="detail-hotel-name">{hotel.name}</h1>
              <p className="detail-hotel-tagline">{hotel.title}</p>
              <div className="detail-hotel-location">
                <span>📍 {hotel.address}</span>
                <span className="detail-hotel-location__sep">·</span>
                <span>🚶 {hotel.distance} from city centre</span>
              </div>
            </div>
            {hotel.rating && (
              <div className="detail-rating">
                <span className="detail-rating__label">{getRatingLabel(hotel.rating)}</span>
                <span className="detail-rating__score">{hotel.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="divider" />

          {/* About */}
          <div className="detail-section">
            <h2 className="detail-section__title">About This Property</h2>
            <p className="detail-section__text">{hotel.description}</p>
          </div>

          <div className="divider" />

          {/* Highlights */}
          <div className="detail-section">
            <h2 className="detail-section__title">Property Highlights</h2>
            <div className="detail-highlights">
              {[
                { icon: "🏆", label: "Luxury Rating",  value: getRatingLabel(hotel.rating) || "—" },
                { icon: "📍", label: "Location",        value: hotel.city },
                { icon: "🛏",  label: "Room Types",      value: `${hotel.rooms?.length || 0} Available` },
                { icon: "💰", label: "Starting Price",  value: `₹${hotel.cheapestPrice?.toLocaleString("en-IN")}/night` },
              ].map((h) => (
                <div key={h.label} className="detail-highlight-card">
                  <span className="detail-highlight-card__icon">{h.icon}</span>
                  <span className="detail-highlight-card__label">{h.label}</span>
                  <span className="detail-highlight-card__value">{h.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* ── Rooms section ── */}
          <div className="detail-section" id="rooms">
            <div className="detail-section__rooms-header">
              <div>
                <h2 className="detail-section__title">Rooms & Availability</h2>
                <p className="detail-section__subtitle">
                  {checkIn && checkOut
                    ? `Showing availability · ${nights} night${nights !== 1 ? "s" : ""} · ${guests} guest${guests !== 1 ? "s" : ""}`
                    : "Select your dates above to check availability and reserve a room"}
                </p>
              </div>
            </div>

            <div className="rooms-list">
              {hotel.rooms?.length > 0
                ? hotel.rooms.map((roomId) => (
                    <RoomCard
                      key={roomId}
                      roomId={roomId}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      guests={guests}
                      onReserve={(room) => {
                        if (!user) { navigate("/login"); return; } // ✅ redirect if not logged in
                        setModal(room);
                      }}
                    />
                  ))
                : <p className="rooms-list__empty">No rooms have been added to this property yet.</p>}
            </div>
          </div>
        </div>

        {/* ── RIGHT: sticky booking panel ── */}
        <div className="detail-sidebar">
          <div className="booking-panel">
            <div className="booking-panel__price">
              <span className="booking-panel__from">Starting from</span>
              <div className="booking-panel__amount">
                ₹{hotel.cheapestPrice?.toLocaleString("en-IN")}
                <span className="booking-panel__per">/night</span>
              </div>
            </div>

            <div className="divider" style={{ margin: "16px 0" }} />

            <div className="booking-panel__field">
              <label className="booking-panel__label">CHECK IN</label>
              <input
                type="date"
                className="booking-panel__input"
                value={checkIn}
                min={today}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className="booking-panel__field">
              <label className="booking-panel__label">CHECK OUT</label>
              <input
                type="date"
                className="booking-panel__input"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            <div className="booking-panel__field">
              <label className="booking-panel__label">GUESTS</label>
              <div className="booking-panel__guests">
                <button className="booking-panel__guest-btn"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}>−</button>
                <span className="booking-panel__guest-count">{guests}</span>
                <button className="booking-panel__guest-btn"
                  onClick={() => setGuests((g) => Math.min(20, g + 1))}>+</button>
              </div>
            </div>

            {nights > 0 && (
              <div className="booking-panel__breakdown">
                <div className="booking-panel__breakdown-row">
                  <span>₹{hotel.cheapestPrice?.toLocaleString("en-IN")} × {nights} nights</span>
                  <span>₹{(hotel.cheapestPrice * nights).toLocaleString("en-IN")}</span>
                </div>
                <div className="booking-panel__breakdown-row booking-panel__breakdown-row--total">
                  <span>Estimated Total</span>
                  <span>₹{(hotel.cheapestPrice * nights).toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}

            <button
              className="booking-panel__cta"
              onClick={() => document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" })}
            >
              {checkIn && checkOut ? "View Available Rooms ↓" : "Select Dates to Book"}
            </button>

            <p className="booking-panel__note">No charge until you confirm a room below</p>
          </div>
        </div>
      </div>

      {/* ── Availability Modal ── */}
      {modal && (
        <AvailabilityModal
          hotel={hotel}
          room={modal}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          onClose={() => setModal(null)}
          onSuccess={handleSuccess}
        />
      )}

      <Footer />
    </div>
  );
};

export default HotelDetail;
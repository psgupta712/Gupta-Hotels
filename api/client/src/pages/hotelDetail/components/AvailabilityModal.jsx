// src/pages/hotelDetail/components/AvailabilityModal.jsx
//
// Opens when user clicks "Reserve" on a room card
// Shows all room numbers as checkboxes:
//   ✅ Available   → checkbox enabled, user can select
//   ❌ Booked      → checkbox disabled, strikethrough
// User selects one or more rooms → clicks "Confirm Booking"
// Calls: PUT /api/room/availability/:roomNumberId

import { useState } from "react";
import axiosInstance from "../../../api/axios";
import { getDatesBetween, getNights, formatDate } from "../../../utils/bookingHelpers";
import "./AvailabilityModal.css";

const AvailabilityModal = ({ hotel, room, checkIn, checkOut, guests, onClose, onSuccess }) => {
  const [selectedRooms, setSelectedRooms] = useState([]); // array of roomNumber objects
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);

  const nights = getNights(checkIn, checkOut);
  const total  = nights * room.price * (selectedRooms.length || 1);

  // Check if a room number is booked for selected dates
  const isBooked = (roomNumber) => {
    if (!checkIn || !checkOut) return false;
    return roomNumber.unavailableDates?.some((d) => {
      const bookedDate = new Date(d);
      return bookedDate >= new Date(checkIn) && bookedDate <= new Date(checkOut);
    });
  };

  const toggleRoom = (rn) => {
    setSelectedRooms((prev) =>
      prev.find((r) => r._id === rn._id)
        ? prev.filter((r) => r._id !== rn._id)
        : [...prev, rn]
    );
  };

  const handleConfirm = async () => {
    if (selectedRooms.length === 0) {
      setError("Please select at least one room.");
      return;
    }
    setLoading(true); setError(null);
    try {
      const dates = getDatesBetween(checkIn, checkOut);
      // Book all selected rooms in parallel
      await Promise.all(
        selectedRooms.map((rn) =>
          axiosInstance.put(`/room/availability/${rn._id}`, { dates })
        )
      );
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const availableCount = room.roomNumbers.filter((rn) => !isBooked(rn)).length;

  return (
    <div className="avail-backdrop" onClick={onClose}>
      <div className="avail-modal" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="avail-modal__header">
          <div>
            <span className="avail-modal__eyebrow">RESERVE YOUR ROOM</span>
            <h2 className="avail-modal__title">{room.title}</h2>
            <p className="avail-modal__hotel">{hotel.name}</p>
          </div>
          <button className="avail-modal__close" onClick={onClose}>×</button>
        </div>

        {/* ── Stay summary ── */}
        <div className="avail-stay">
          <div className="avail-stay__item">
            <span className="avail-stay__label">CHECK IN</span>
            <span className="avail-stay__value">{formatDate(checkIn)}</span>
          </div>
          <div className="avail-stay__arrow">→</div>
          <div className="avail-stay__item">
            <span className="avail-stay__label">CHECK OUT</span>
            <span className="avail-stay__value">{formatDate(checkOut)}</span>
          </div>
          <div className="avail-stay__divider" />
          <div className="avail-stay__item">
            <span className="avail-stay__label">DURATION</span>
            <span className="avail-stay__value">{nights} night{nights !== 1 ? "s" : ""}</span>
          </div>
          <div className="avail-stay__item">
            <span className="avail-stay__label">GUESTS</span>
            <span className="avail-stay__value">{guests} guest{guests !== 1 ? "s" : ""}</span>
          </div>
          <div className="avail-stay__item">
            <span className="avail-stay__label">PRICE/NIGHT</span>
            <span className="avail-stay__value avail-stay__value--gold">₹{room.price.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="avail-legend">
          <span className="avail-legend__item">
            <span className="avail-legend__dot avail-legend__dot--available" />
            Available ({availableCount})
          </span>
          <span className="avail-legend__item">
            <span className="avail-legend__dot avail-legend__dot--booked" />
            Booked ({room.roomNumbers.length - availableCount})
          </span>
          {selectedRooms.length > 0 && (
            <span className="avail-legend__item avail-legend__item--selected">
              ✓ {selectedRooms.length} selected
            </span>
          )}
        </div>

        {/* ── Room checkboxes ── */}
        <div className="avail-rooms">
          <p className="avail-rooms__label">SELECT ROOM NUMBER(S)</p>
          <div className="avail-rooms__grid">
            {room.roomNumbers.map((rn) => {
              const booked   = isBooked(rn);
              const selected = selectedRooms.some((r) => r._id === rn._id);
              return (
                <label
                  key={rn._id}
                  className={`avail-room-item
                    ${booked   ? "avail-room-item--booked"   : ""}
                    ${selected ? "avail-room-item--selected" : ""}
                  `}
                >
                  <input
                    type="checkbox"
                    className="avail-room-item__checkbox"
                    checked={selected}
                    disabled={booked}
                    onChange={() => !booked && toggleRoom(rn)}
                  />
                  <div className="avail-room-item__body">
                    <span className="avail-room-item__number">
                      {booked ? "🔒" : selected ? "✓" : "○"} {rn.number}
                    </span>
                    <span className="avail-room-item__status">
                      {booked ? "Unavailable" : "Available"}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* ── Price total ── */}
        {selectedRooms.length > 0 && (
          <div className="avail-total">
            <span className="avail-total__label">
              ₹{room.price.toLocaleString("en-IN")} × {nights} nights × {selectedRooms.length} room{selectedRooms.length > 1 ? "s" : ""}
            </span>
            <span className="avail-total__amount">₹{total.toLocaleString("en-IN")}</span>
          </div>
        )}

        {/* ── Error ── */}
        {error && <p className="avail-error">⚠ {error}</p>}

        {/* ── Actions ── */}
        <div className="avail-actions">
          <button className="avail-actions__cancel" onClick={onClose}>Cancel</button>
          <button
            className="avail-actions__confirm"
            onClick={handleConfirm}
            disabled={loading || selectedRooms.length === 0}
          >
            {loading
              ? "Confirming..."
              : selectedRooms.length === 0
              ? "Select a Room"
              : `Confirm Booking →`}
          </button>
        </div>

        <p className="avail-policy">
          ✓ Free cancellation up to 24 hours before check-in · No charge until confirmed
        </p>

      </div>
    </div>
  );
};

export default AvailabilityModal;
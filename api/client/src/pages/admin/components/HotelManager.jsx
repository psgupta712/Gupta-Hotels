// src/pages/admin/components/HotelManager.jsx
//
// Calls:
//   GET    /api/hotel           → list all hotels
//   POST   /api/hotel           → create new hotel
//   PUT    /api/hotel/:id       → update hotel
//   DELETE /api/hotel/:id       → delete hotel

import { useState } from "react";
import axiosInstance from "../../../api/axios";
import useFetch from "../../../hooks/useFetch.jsx";

// Empty form template matching your Hotel model
const EMPTY_HOTEL = {
  name: "", type: "hotel", city: "", address: "",
  distance: "", title: "", description: "",
  cheapestPrice: "", rating: "", featured: false,
  photos: "",  // comma-separated URLs — split on save
};

const HotelManager = () => {
  const { data: hotels, loading, error } = useFetch("/hotel");

  const [form,      setForm]      = useState(EMPTY_HOTEL);
  const [editingId, setEditingId] = useState(null);  // null = creating new
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState(null);
  const [showForm,  setShowForm]  = useState(false);

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [field]: value }));
  };

  // Open form to CREATE a new hotel
  const openCreate = () => {
    setForm(EMPTY_HOTEL);
    setEditingId(null);
    setFormError(null);
    setShowForm(true);
  };

  // Open form to EDIT an existing hotel
  const openEdit = (hotel) => {
    setForm({
      ...hotel,
      photos: hotel.photos?.join(", ") || "",   // array → comma string for input
    });
    setEditingId(hotel._id);
    setFormError(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.city || !form.cheapestPrice) {
      setFormError("Name, city and price are required.");
      return;
    }
    setSaving(true); setFormError(null);
    try {
      const payload = {
        ...form,
        cheapestPrice: Number(form.cheapestPrice),
        rating:        Number(form.rating) || 0,
        // Split comma-separated photo URLs into an array
        photos: form.photos ? form.photos.split(",").map((p) => p.trim()).filter(Boolean) : [],
      };

      if (editingId) {
        await axiosInstance.put(`/hotel/${editingId}`, payload);
      } else {
        await axiosInstance.post("/hotel", payload);
      }

      setShowForm(false);
      window.location.reload(); // refresh list
    } catch (err) {
      setFormError(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hotel? This cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/hotel/${id}`);
      window.location.reload();
    } catch {
      alert("Failed to delete hotel.");
    }
  };

  return (
    <div className="manager">

      {/* Header */}
      <div className="manager__header">
        <h2 className="manager__title">Hotels</h2>
        <button className="btn--gold" onClick={openCreate}>+ Add Hotel</button>
      </div>

      {/* Hotel list */}
      {loading && <div className="skeleton" style={{ height: 200 }} />}
      {error   && <p className="manager__error">Could not load hotels.</p>}

      {!loading && hotels && (
        <div className="manager-table">
          <div className="manager-table__head">
            <span>Name</span>
            <span>City</span>
            <span>Type</span>
            <span>Price</span>
            <span>Rating</span>
            <span>Featured</span>
            <span>Actions</span>
          </div>

          {hotels.length === 0 && (
            <p className="manager-table__empty">No hotels yet. Click "+ Add Hotel" to create one.</p>
          )}

          {hotels.map((hotel) => (
            <div key={hotel._id} className="manager-table__row">
              <span className="manager-table__name">{hotel.name}</span>
              <span>{hotel.city}</span>
              <span className="manager-table__type">{hotel.type}</span>
              <span>₹{hotel.cheapestPrice?.toLocaleString("en-IN")}</span>
              <span>{hotel.rating?.toFixed(1) || "—"}</span>
              <span>{hotel.featured ? "✓" : "—"}</span>
              <div className="manager-table__actions">
                <button className="manager-btn manager-btn--edit"   onClick={() => openEdit(hotel)}>Edit</button>
                <button className="manager-btn manager-btn--delete" onClick={() => handleDelete(hotel._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit form modal */}
      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>

            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editingId ? "Edit Hotel" : "New Hotel"}</h3>
              <button className="modal__close" onClick={() => setShowForm(false)}>×</button>
            </div>

            <div className="admin-form">
              <div className="admin-form__row">
                <div className="admin-field">
                  <label className="admin-field__label">NAME</label>
                  <input className="admin-field__input" value={form.name} onChange={update("name")} placeholder="Hotel name" />
                </div>
                <div className="admin-field">
                  <label className="admin-field__label">TYPE</label>
                  <select className="admin-field__input" value={form.type} onChange={update("type")}>
                    {["hotel","apartment","resort","villa","cabin"].map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form__row">
                <div className="admin-field">
                  <label className="admin-field__label">CITY</label>
                  <input className="admin-field__input" value={form.city} onChange={update("city")} placeholder="e.g. New Delhi" />
                </div>
                <div className="admin-field">
                  <label className="admin-field__label">ADDRESS</label>
                  <input className="admin-field__input" value={form.address} onChange={update("address")} placeholder="Full address" />
                </div>
              </div>

              <div className="admin-form__row">
                <div className="admin-field">
                  <label className="admin-field__label">DISTANCE FROM CENTRE</label>
                  <input className="admin-field__input" value={form.distance} onChange={update("distance")} placeholder="e.g. 500m" />
                </div>
                <div className="admin-field">
                  <label className="admin-field__label">CHEAPEST PRICE (₹)</label>
                  <input className="admin-field__input" type="number" value={form.cheapestPrice} onChange={update("cheapestPrice")} placeholder="e.g. 5000" />
                </div>
              </div>

              <div className="admin-form__row">
                <div className="admin-field">
                  <label className="admin-field__label">RATING (0–5)</label>
                  <input className="admin-field__input" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={update("rating")} placeholder="e.g. 4.5" />
                </div>
                <div className="admin-field admin-field--checkbox">
                  <label className="admin-field__label">FEATURED</label>
                  <input type="checkbox" checked={form.featured} onChange={update("featured")} className="admin-field__checkbox" />
                  <span className="admin-field__checkbox-label">Show on homepage</span>
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-field__label">TAGLINE (TITLE)</label>
                <input className="admin-field__input" value={form.title} onChange={update("title")} placeholder="Short tagline shown on card" />
              </div>

              <div className="admin-field">
                <label className="admin-field__label">DESCRIPTION</label>
                <textarea className="admin-field__input admin-field__textarea" rows={3}
                  value={form.description} onChange={update("description")}
                  placeholder="Full hotel description" />
              </div>

              <div className="admin-field">
                <label className="admin-field__label">PHOTOS (comma-separated URLs)</label>
                <textarea className="admin-field__input admin-field__textarea" rows={2}
                  value={form.photos} onChange={update("photos")}
                  placeholder="https://..., https://..." />
              </div>

              {formError && <p className="manager__error">{formError}</p>}

              <button className="btn--gold admin-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Hotel" : "Create Hotel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelManager;

// src/pages/admin/components/RoomManager.jsx
//
// Calls:
//   GET    /api/hotel           → for hotel dropdown
//   GET    /api/room/:id        → load room to edit
//   POST   /api/room/:hotelId   → create room and attach to hotel
//   PUT    /api/room/:id        → update room
//   DELETE /api/room/:id?hotelId=:hotelId → delete room + remove from hotel

import { useState } from "react";
import axiosInstance from "../../../api/axios";
import useFetch from "../../../hooks/useFetch.jsx";

const EMPTY_ROOM = {
  title: "", price: "", maxPeople: "", desc: "",
  roomNumbers: "", // comma-separated numbers e.g. "101, 102, 103"
};

const RoomManager = () => {
  const { data: hotels, loading: hotelsLoading } = useFetch("/hotel");

  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [form,      setForm]      = useState(EMPTY_ROOM);
  const [editingId, setEditingId] = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState(null);
  const [showForm,  setShowForm]  = useState(false);

  // Get rooms for the selected hotel
  const { data: rooms, loading: roomsLoading } = useFetch(
    selectedHotelId ? `/hotel/room/${selectedHotelId}` : null
  );

  const update = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const openCreate = () => {
    if (!selectedHotelId) { alert("Please select a hotel first."); return; }
    setForm(EMPTY_ROOM);
    setEditingId(null);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (room) => {
    setForm({
      title:       room.title,
      price:       room.price,
      maxPeople:   room.maxPeople,
      desc:        room.desc,
      // Show just the room numbers as comma-separated string
      roomNumbers: room.roomNumbers?.map((rn) => rn.number).join(", ") || "",
    });
    setEditingId(room._id);
    setFormError(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.price || !form.maxPeople) {
      setFormError("Title, price and max people are required.");
      return;
    }
    setSaving(true); setFormError(null);
    try {
      const payload = {
        title:     form.title,
        price:     Number(form.price),
        maxPeople: Number(form.maxPeople),
        desc:      form.desc,
        // Convert "101, 102, 103" → [{ number: 101 }, { number: 102 }, ...]
        roomNumbers: form.roomNumbers
          ? form.roomNumbers.split(",").map((n) => ({ number: Number(n.trim()) })).filter((rn) => rn.number)
          : [],
      };

      if (editingId) {
        await axiosInstance.put(`/room/${editingId}`, payload);
      } else {
        // POST /api/room/:hotelId — backend attaches room to the hotel
        await axiosInstance.post(`/room/${selectedHotelId}`, payload);
      }

      setShowForm(false);
      window.location.reload();
    } catch (err) {
      setFormError(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm("Delete this room?")) return;
    try {
      await axiosInstance.delete(`/room/${roomId}?hotelId=${selectedHotelId}`);
      window.location.reload();
    } catch {
      alert("Failed to delete room.");
    }
  };

  return (
    <div className="manager">

      {/* Header */}
      <div className="manager__header">
        <h2 className="manager__title">Rooms</h2>
        <button className="btn--gold" onClick={openCreate}>+ Add Room</button>
      </div>

      {/* Hotel selector */}
      <div className="admin-field" style={{ maxWidth: 360, marginBottom: 28 }}>
        <label className="admin-field__label">SELECT HOTEL</label>
        <select className="admin-field__input" value={selectedHotelId}
          onChange={(e) => setSelectedHotelId(e.target.value)}>
          <option value="">— Choose a hotel —</option>
          {hotels?.map((h) => (
            <option key={h._id} value={h._id}>{h.name} ({h.city})</option>
          ))}
        </select>
      </div>

      {/* Rooms list */}
      {!selectedHotelId && (
        <p className="manager-table__empty">Select a hotel above to see its rooms.</p>
      )}

      {selectedHotelId && roomsLoading && (
        <div className="skeleton" style={{ height: 160 }} />
      )}

      {selectedHotelId && !roomsLoading && rooms && (
        <div className="manager-table">
          <div className="manager-table__head">
            <span>Title</span>
            <span>Price/night</span>
            <span>Max People</span>
            <span>Room Numbers</span>
            <span>Actions</span>
          </div>

          {rooms.length === 0 && (
            <p className="manager-table__empty">No rooms for this hotel yet.</p>
          )}

          {rooms.map((room) => (
            <div key={room._id} className="manager-table__row">
              <span className="manager-table__name">{room.title}</span>
              <span>₹{room.price?.toLocaleString("en-IN")}</span>
              <span>{room.maxPeople}</span>
              <span className="manager-table__rooms">
                {room.roomNumbers?.map((rn) => rn.number).join(", ")}
              </span>
              <div className="manager-table__actions">
                <button className="manager-btn manager-btn--edit"   onClick={() => openEdit(room)}>Edit</button>
                <button className="manager-btn manager-btn--delete" onClick={() => handleDelete(room._id)}>Delete</button>
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
              <h3 className="admin-modal__title">{editingId ? "Edit Room" : "New Room"}</h3>
              <button className="modal__close" onClick={() => setShowForm(false)}>×</button>
            </div>

            <div className="admin-form">
              <div className="admin-field">
                <label className="admin-field__label">ROOM TITLE</label>
                <input className="admin-field__input" value={form.title}
                  onChange={update("title")} placeholder="e.g. Deluxe King Room" />
              </div>

              <div className="admin-form__row">
                <div className="admin-field">
                  <label className="admin-field__label">PRICE PER NIGHT (₹)</label>
                  <input className="admin-field__input" type="number" value={form.price}
                    onChange={update("price")} placeholder="e.g. 8000" />
                </div>
                <div className="admin-field">
                  <label className="admin-field__label">MAX PEOPLE</label>
                  <input className="admin-field__input" type="number" min="1" value={form.maxPeople}
                    onChange={update("maxPeople")} placeholder="e.g. 2" />
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-field__label">DESCRIPTION</label>
                <textarea className="admin-field__input admin-field__textarea" rows={3}
                  value={form.desc} onChange={update("desc")}
                  placeholder="Describe the room…" />
              </div>

              <div className="admin-field">
                <label className="admin-field__label">ROOM NUMBERS (comma-separated)</label>
                <input className="admin-field__input" value={form.roomNumbers}
                  onChange={update("roomNumbers")} placeholder="e.g. 101, 102, 103, 201" />
                <span style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>
                  Each number becomes an individually bookable room unit
                </span>
              </div>

              {formError && <p className="manager__error">{formError}</p>}

              <button className="btn--gold admin-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Room" : "Create Room"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManager;

// src/pages/profile/Profile.jsx

import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../api/axios";
import Navbar from "../../components/navbar/Navbar.jsx";
import Footer from "../../components/footer/Footer.jsx";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext); // ✅ use dispatch

  const [form, setForm]       = useState({ username: "", email: "", country: "", city: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  // Load current user data
  useEffect(() => {
    if (!user) return;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/user/${user._id}`);
        const { username, email, country, city, phone } = res.data;
        setForm({ username, email, country: country || "", city: city || "", phone: phone || "" });
      } catch {
        setError("Could not load your profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [user]);

  const update = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setError(null);
    setSuccess(false);
  };

  // Save updated profile
  const handleSave = async () => {
    if (!form.username.trim() || !form.email.trim()) {
      setError("Username and email are required.");
      return;
    }
    setSaving(true); setError(null);
    try {
      const res = await axiosInstance.put(`/user/${user._id}`, form);
      // ✅ update context with new user data via dispatch
      dispatch({ type: "LOGIN_SUCCESS", payload: { ...user, ...res.data } });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Delete account
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/user/${user._id}`);
      dispatch({ type: "LOGOUT" }); // ✅ dispatch logout
      navigate("/");
    } catch {
      setError("Failed to delete account.");
      setShowDeleteConfirm(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-content">

        {/* Left: avatar + info */}
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <span className="profile-avatar__initials">
              {user.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="profile-sidebar__name">{user.username}</p>
          <p className="profile-sidebar__email">{user.email}</p>
          {user.isAdmin && <span className="profile-sidebar__badge">Admin</span>}

          <div className="profile-sidebar__meta">
            {user.city    && <p>📍 {user.city}{user.country ? `, ${user.country}` : ""}</p>}
            {user.phone   && <p>📞 {user.phone}</p>}
          </div>

          {user.isAdmin && (
            <button className="btn--outline profile-sidebar__admin-btn"
              onClick={() => navigate("/admin")}>
              Go to Admin Panel →
            </button>
          )}
        </div>

        {/* Right: edit form */}
        <div className="profile-form-section">
          <div className="profile-form-header">
            <h1 className="profile-form-header__title">Edit Profile</h1>
            <p className="profile-form-header__sub">Update your account information below.</p>
          </div>

          {loading ? (
            <div className="profile-loading">
              {[1,2,3,4,5].map((i) => <div key={i} className="skeleton profile-loading__row" />)}
            </div>
          ) : (
            <div className="profile-form">
              <div className="profile-form__row">
                <div className="profile-field">
                  <label className="profile-field__label">USERNAME</label>
                  <input className="profile-field__input" value={form.username} onChange={update("username")} />
                </div>
                <div className="profile-field">
                  <label className="profile-field__label">EMAIL</label>
                  <input className="profile-field__input" type="email" value={form.email} onChange={update("email")} />
                </div>
              </div>

              <div className="profile-form__row">
                <div className="profile-field">
                  <label className="profile-field__label">COUNTRY</label>
                  <input className="profile-field__input" placeholder="e.g. India" value={form.country} onChange={update("country")} />
                </div>
                <div className="profile-field">
                  <label className="profile-field__label">CITY</label>
                  <input className="profile-field__input" placeholder="e.g. New Delhi" value={form.city} onChange={update("city")} />
                </div>
              </div>

              <div className="profile-field">
                <label className="profile-field__label">PHONE</label>
                <input className="profile-field__input" placeholder="+91 98765 43210" value={form.phone} onChange={update("phone")} />
              </div>

              {error   && <div className="profile-error">⚠ {error}</div>}
              {success && <div className="profile-success">✓ Profile updated successfully.</div>}

              <button className="btn--gold profile-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>

              {/* Danger zone */}
              <div className="profile-danger-zone">
                <p className="profile-danger-zone__title">Danger Zone</p>
                <p className="profile-danger-zone__desc">Deleting your account is permanent and cannot be undone.</p>
                {!showDeleteConfirm ? (
                  <button className="profile-delete-btn" onClick={() => setShowDeleteConfirm(true)}>
                    Delete My Account
                  </button>
                ) : (
                  <div className="profile-delete-confirm">
                    <p>Are you sure? This cannot be undone.</p>
                    <div className="profile-delete-confirm__btns">
                      <button className="profile-delete-btn" onClick={handleDelete}>Yes, Delete</button>
                      <button className="btn--outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
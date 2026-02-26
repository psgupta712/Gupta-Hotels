// src/pages/register/Register.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import AuthPanel from "../../components/authPanel/AuthPanel.jsx";
import "../../styles/auth.css";

const BENEFITS = [
  "Exclusive member-only rates",
  "Early access to new properties",
  "Priority reservation support",
  "Complimentary room upgrades",
];

const Register = () => {
  const navigate = useNavigate();

  // All fields match your User.js model
  const [form, setForm] = useState({
    username: "", email: "", password: "", confirm: "",
    country: "", city: "", phone: "",
  });
  const [step,     setStep]     = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const update = (field) => (e) => { setForm((p) => ({ ...p, [field]: e.target.value })); setError(null); };

  // Step 1 validation
  const validateStep1 = () => {
    if (!form.username.trim())               return "Username is required.";
    if (form.username.length < 3)            return "Username must be at least 3 characters.";
    if (!form.email.trim())                  return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(form.email))   return "Please enter a valid email.";
    if (!form.password)                      return "Password is required.";
    if (form.password.length < 6)            return "Password must be at least 6 characters.";
    if (form.password !== form.confirm)      return "Passwords do not match.";
    return null;
  };

  // Step 2 validation
  const validateStep2 = () => {
    if (!form.country.trim()) return "Country is required.";
    if (!form.city.trim())    return "City is required.";
    if (!form.phone.trim())   return "Phone number is required.";
    return null;
  };

  const goStep2 = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError(null); setStep(2);
  };

  const handleRegister = async () => {
    const err = validateStep2();
    if (err) { setError(err); return; }
    setLoading(true); setError(null);
    try {
      const { confirm, ...data } = form; // don't send 'confirm' to backend
      await axiosInstance.post("/auth/register", data);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (msg.includes("username")) { setError("Username already taken."); setStep(1); }
      else if (msg.includes("email")) { setError("Email already registered."); setStep(1); }
      else setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strengthLevel = form.password.length < 1 ? "" : form.password.length < 6 ? "weak" : form.password.length < 10 ? "medium" : "strong";

  return (
    <div className="auth-page">

      {/* Left panel */}
      <AuthPanel image="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80">
        <p className="auth-benefits-title">Member Benefits</p>
        {BENEFITS.map((b) => (
          <div key={b} className="auth-benefit">
            <span className="auth-benefit__icon">✦</span> {b}
          </div>
        ))}
      </AuthPanel>

      {/* Right: form */}
      <div className="auth-form-side">
        <div className="auth-form-wrapper">

          <div className="auth-logo" onClick={() => navigate("/")}>
            <span className="auth-logo__name">GUPTA</span>
            <span className="auth-logo__divider" />
            <span className="auth-logo__tag">Hotels</span>
          </div>

          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join Gupta Hotels and unlock exclusive member benefits.</p>

          {/* Step indicator */}
          <div className="auth-steps">
            <div className={`auth-step ${step >= 1 ? "auth-step--active" : ""}`}>
              <span className="auth-step__num">1</span>
              <span className="auth-step__label">Account</span>
            </div>
            <div className="auth-step__line" />
            <div className={`auth-step ${step >= 2 ? "auth-step--active" : ""}`}>
              <span className="auth-step__num">2</span>
              <span className="auth-step__label">Personal</span>
            </div>
          </div>

          {error && <div className="auth-error"><span>⚠</span> {error}</div>}

          {/* ── Step 1 ── */}
          {step === 1 && (
            <>
              <div className="auth-field">
                <label className="auth-field__label">USERNAME</label>
                <input className="auth-field__input" placeholder="Choose a username"
                  value={form.username} onChange={update("username")} autoFocus />
              </div>
              <div className="auth-field">
                <label className="auth-field__label">EMAIL</label>
                <input className="auth-field__input" type="email" placeholder="you@example.com"
                  value={form.email} onChange={update("email")} />
              </div>
              <div className="auth-field">
                <label className="auth-field__label">PASSWORD</label>
                <div className="auth-field__password-wrap">
                  <input className="auth-field__input" placeholder="Min 6 characters"
                    type={showPass ? "text" : "password"}
                    value={form.password} onChange={update("password")} />
                  <button className="auth-field__toggle" onClick={() => setShowPass((s) => !s)}>
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
                {strengthLevel && (
                  <div className="auth-strength">
                    <div className={`auth-strength__bar auth-strength__bar--${strengthLevel}`} />
                    <span className="auth-strength__label">{strengthLevel.charAt(0).toUpperCase() + strengthLevel.slice(1)}</span>
                  </div>
                )}
              </div>
              <div className="auth-field">
                <label className="auth-field__label">CONFIRM PASSWORD</label>
                <input className={`auth-field__input ${form.confirm && form.confirm !== form.password ? "auth-field__input--error" : ""}`}
                  type={showPass ? "text" : "password"} placeholder="Repeat password"
                  value={form.confirm} onChange={update("confirm")}
                  onKeyDown={(e) => e.key === "Enter" && goStep2()} />
              </div>
              <button className="btn--gold auth-submit" onClick={goStep2}>Continue →</button>
            </>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <>
              <button className="auth-back-step" onClick={() => { setStep(1); setError(null); }}>← Back</button>
              <div className="auth-field">
                <label className="auth-field__label">COUNTRY</label>
                <input className="auth-field__input" placeholder="e.g. India"
                  value={form.country} onChange={update("country")} autoFocus />
              </div>
              <div className="auth-field">
                <label className="auth-field__label">CITY</label>
                <input className="auth-field__input" placeholder="e.g. New Delhi"
                  value={form.city} onChange={update("city")} />
              </div>
              <div className="auth-field">
                <label className="auth-field__label">PHONE</label>
                <input className="auth-field__input" type="tel" placeholder="+91 98765 43210"
                  value={form.phone} onChange={update("phone")}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()} />
              </div>
              <button className="btn--gold auth-submit" onClick={handleRegister} disabled={loading}>
                {loading ? <span className="auth-spinner" /> : "Create Account"}
              </button>
            </>
          )}

          <p className="auth-switch">
            Already have an account? <Link to="/login" className="auth-switch__link">Sign In →</Link>
          </p>
          <button className="auth-back" onClick={() => navigate("/")}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default Register;

// src/pages/login/Login.jsx

import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../api/axios";
import AuthPanel from "../../components/authPanel/AuthPanel";
import "../../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext); // ✅ use dispatch not login()

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    dispatch({ type: "LOGIN_START" }); // ✅ set loading state
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.post("/auth/login", { username, password });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data }); // ✅ save user to context
      navigate("/");
    } catch (err) {
      const status = err.response?.status;
      const message =
        status === 404 || status === 401
          ? "Invalid username or password."
          : "Something went wrong. Please try again.";
      dispatch({ type: "LOGIN_FAILURE", payload: message }); // ✅ save error to context
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Left: decorative image panel */}
      <AuthPanel image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80">
        <p className="auth-quote">"Every great stay begins with a warm welcome."</p>
        <span className="auth-quote__attr">— The Gupta Philosophy</span>
      </AuthPanel>

      {/* Right: form */}
      <div className="auth-form-side">
        <div className="auth-form-wrapper">

          <div className="auth-logo" onClick={() => navigate("/")}>
            <span className="auth-logo__name">GUPTA</span>
            <span className="auth-logo__divider" />
            <span className="auth-logo__tag">Hotels</span>
          </div>

          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to manage your bookings and explore our properties.</p>

          {error && <div className="auth-error"><span>⚠</span> {error}</div>}

          <div className="auth-field">
            <label className="auth-field__label">USERNAME</label>
            <input
              className="auth-field__input"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label className="auth-field__label">PASSWORD</label>
            <div className="auth-field__password-wrap">
              <input
                className="auth-field__input"
                placeholder="Your password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button className="auth-field__toggle" onClick={() => setShowPass((s) => !s)}>
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button className="btn--gold auth-submit" onClick={handleLogin} disabled={loading}>
            {loading ? <span className="auth-spinner" /> : "Sign In"}
          </button>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register" className="auth-switch__link">Register →</Link>
          </p>

          <button className="auth-back" onClick={() => navigate("/")}>← Back to Home</button>

        </div>
      </div>
    </div>
  );
};

export default Login;
// src/components/navbar/Navbar.jsx

import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext); // ✅ use dispatch
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" }); // ✅ dispatch logout
    navigate("/");
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--solid" : ""}`}>

      {/* Logo */}
      <div className="navbar__logo" onClick={() => navigate("/")}>
        <span className="navbar__logo-name">GUPTA</span>
        <span className="navbar__logo-divider" />
        <span className="navbar__logo-tag">Hotels</span>
      </div>

      {/* Nav links */}
      <div className="navbar__links">
        <Link to="/"        className="navbar__link">Home</Link>
        <Link to="/hotels"  className="navbar__link">Hotels</Link>
        <a href="/#about"   className="navbar__link">About</a>
        <a href="/#contact" className="navbar__link">Contact</a>
      </div>

      {/* Right side: auth */}
      <div className="navbar__auth">
        {user ? (
          <>
            <span className="navbar__username">
              👤 {user.username}
              {user.isAdmin && <span className="navbar__admin-badge">Admin</span>}
            </span>
            <button className="btn--outline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    className="navbar__link">Sign In</Link>
            <Link to="/register" className="btn--outline">Register</Link>
          </>
        )}
      </div>

    </nav>
  );
};

export default Navbar;
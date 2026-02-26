// src/components/footer/Footer.jsx
// Used by: Home, Hotels, HotelDetail

import { useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">

          {/* Brand */}
          <div>
            <div className="footer__logo">
              <span className="footer__logo-name">GUPTA</span>
              <span className="footer__logo-divider" />
              <span className="footer__logo-tag">Hotels</span>
            </div>
            <p className="footer__tagline">
              Since 2025, setting the benchmark for luxury hospitality
              across India's most iconic destinations.
            </p>
          </div>

          {/* Properties */}
          <div>
            <p className="footer__col-title">Properties</p>
            {["New Delhi", "Mumbai", "Jaipur", "Udaipur"].map((city) => (
              <p
                key={city}
                className="footer__link"
                onClick={() => navigate("/hotels", { state: { city } })}
              >
                {city}
              </p>
            ))}
          </div>

          {/* Company */}
          <div>
            <p className="footer__col-title">Company</p>
            {["About Us", "Careers", "Sustainability", "Press", "Contact"].map((item) => (
              <p key={item} className="footer__link">{item}</p>
            ))}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <p>© 2025 Gupta Hotels & Resorts Ltd. All rights reserved.</p>
          <div className="footer__legal">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <span key={item} className="footer__link">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

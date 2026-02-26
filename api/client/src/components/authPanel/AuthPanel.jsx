// src/components/authPanel/AuthPanel.jsx
// The left decorative image panel shared by Login AND Register
// Props:
//   image   — background image URL
//   children — anything shown at the bottom (quote or benefits list)

import "./AuthPanel.css";

const AuthPanel = ({ image, children }) => {
  return (
    <div className="auth-panel">
      <img src={image} alt="Gupta Hotels" className="auth-panel__img" />
      <div className="auth-panel__overlay" />

      {/* Logo top-left */}
      <div className="auth-panel__brand">
        <span className="auth-panel__brand-name">GUPTA</span>
        <span className="auth-panel__brand-divider" />
        <span className="auth-panel__brand-tag">Hotels</span>
      </div>

      {/* Bottom content (passed in as children) */}
      <div className="auth-panel__bottom">{children}</div>
    </div>
  );
};

export default AuthPanel;

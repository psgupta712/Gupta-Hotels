// src/pages/home/sections/ContactSection.jsx

import { useState } from "react";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const update = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    // TODO: wire to backend / email service
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className="section" id="contact">
      <div className="section__header">
        <span className="section__eyebrow">GET IN TOUCH</span>
        <h2 className="section__title">We'd Love to Hear from You</h2>
      </div>

      <div className="contact-grid">
        {/* Info */}
        <div>
          {[
            { title: "RESERVATIONS",  lines: ["+91 11 4444 5555", "reservations@guptahotels.com"] },
            { title: "HEAD OFFICE",   lines: ["Gupta Hotels & Resorts Ltd.", "12, Mansarovar, Jaipur, Rajasthan"] },
            { title: "HOURS",         lines: ["Open 24 hours, 7 days a week"] },
          ].map((b) => (
            <div key={b.title} className="contact-info-block">
              <span className="contact-info-block__title">{b.title}</span>
              {b.lines.map((l) => <p key={l} className="contact-info-block__text">{l}</p>)}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="contact-form">
          <div className="contact-form__row">
            {["name", "email"].map((field) => (
              <div key={field} className="auth-field">
                <label className="auth-field__label">{field === "name" ? "YOUR NAME" : "EMAIL"}</label>
                <input
                  className="auth-field__input"
                  placeholder={field === "name" ? "Ramesh Kumar" : "you@example.com"}
                  value={form[field]}
                  onChange={update(field)}
                />
              </div>
            ))}
          </div>
          <div className="auth-field" style={{ marginBottom: 20 }}>
            <label className="auth-field__label">MESSAGE</label>
            <textarea className="auth-field__input" rows={4} style={{ resize: "vertical" }}
              placeholder="Tell us about your requirements…"
              value={form.message} onChange={update("message")} />
          </div>
          <button className={`btn--gold ${sent ? "btn--sent" : ""}`}
            style={{ width: "100%", background: sent ? "#4a8c4a" : undefined }}
            onClick={handleSubmit}>
            {sent ? "✓ Message Sent!" : "Send Enquiry"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

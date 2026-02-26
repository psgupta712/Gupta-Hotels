// src/pages/home/sections/Hero.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const SLIDES = [
  { bg: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80", city: "NEW DELHI",  line1: "Where Legacy",    line2: "Meets Luxury"   },
  { bg: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80", city: "JAIPUR",    line1: "Royal Heritage,", line2: "Timeless Grace" },
  { bg: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80", city: "MUMBAI",    line1: "The Art of",     line2: "Refined Living" },
];

const Hero = () => {
  const navigate = useNavigate();
  const [cur,     setCur]     = useState(0);
  const [fading,  setFading]  = useState(false);
  const [city,    setCity]    = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut,setCheckOut]= useState("");
  const [guests,  setGuests]  = useState(1);

  // Auto-advance slide every 5.5s
  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => { setCur((c) => (c + 1) % SLIDES.length); setFading(false); }, 600);
    }, 5500);
    return () => clearInterval(t);
  }, []);

  const handleSearch = () => navigate("/hotels", { state: { city, checkIn, checkOut, guests } });

  const slide = SLIDES[cur];

  return (
    <section id="hero" className="hero">
      {/* BG image */}
      <div className={`hero__bg ${fading ? "hero__bg--fading" : ""}`}
        style={{ backgroundImage: `url(${slide.bg})` }} />
      <div className="hero__overlay" />

      {/* Slide dots */}
      <div className="hero__dots">
        {SLIDES.map((_, i) => (
          <div key={i} className={`hero__dot ${i === cur ? "hero__dot--active" : ""}`}
            onClick={() => setCur(i)} />
        ))}
      </div>

      {/* Text */}
      <div className="hero__content">
        <div className="hero__eyebrow">
          <span className="hero__eyebrow-line" />
          {slide.city}
        </div>
        <h1 className={`hero__heading ${fading ? "hero__heading--fading" : ""}`}>
          {slide.line1}<br />{slide.line2}
        </h1>
        <p className="hero__subtext">
          India's most celebrated hotel collection — where every stay tells a story of heritage and timeless hospitality.
        </p>
        <button className="btn--gold" onClick={() => navigate("/hotels")}>
          Explore Our Hotels
        </button>
      </div>

      {/* Search bar */}
      <div className="search-bar">
        {[
          { label: "DESTINATION", type: "text",   value: city,     set: setCity,     ph: "City or Hotel" },
          { label: "CHECK IN",    type: "date",   value: checkIn,  set: setCheckIn,  ph: "" },
          { label: "CHECK OUT",   type: "date",   value: checkOut, set: setCheckOut, ph: "" },
          { label: "GUESTS",      type: "number", value: guests,   set: setGuests,   ph: "1" },
        ].map((f, i) => (
          <div key={i} className="search-bar__field">
            <label className="search-bar__label">{f.label}</label>
            <input type={f.type} placeholder={f.ph} value={f.value}
              onChange={(e) => f.set(f.type === "number" ? Number(e.target.value) : e.target.value)}
              className="search-bar__input" />
          </div>
        ))}
        <button className="search-bar__btn" onClick={handleSearch}>Search</button>
      </div>
    </section>
  );
};

export default Hero;

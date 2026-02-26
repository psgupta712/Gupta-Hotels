// src/pages/home/sections/FeaturedSection.jsx
// Calls: GET /api/hotel  →  filters featured: true

import { useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch.jsx";
import HotelCard from "../../../components/hotelCard/HotelCard.jsx";

const FeaturedSection = () => {
  const { data: allHotels, loading } = useFetch("/hotel");
  const featured = allHotels ? allHotels.filter((h) => h.featured).slice(0, 4) : [];

  return (
    <section className="section" id="featured">
      <div className="section__header">
        <span className="section__eyebrow">HAND-PICKED FOR YOU</span>
        <h2 className="section__title">Homes Guests Love</h2>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[1,2,3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 200, width: "100%" }} />
          ))}
        </div>
      )}

      {/* No featured hotels */}
      {!loading && featured.length === 0 && (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "60px 0" }}>
          No featured hotels yet. Mark hotels as featured from the admin panel.
        </p>
      )}

      {/* Reuse HotelCard — same component as Hotels page */}
      {!loading && featured.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {featured.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)}
        </div>
      )}
    </section>
  );
};

export default FeaturedSection;

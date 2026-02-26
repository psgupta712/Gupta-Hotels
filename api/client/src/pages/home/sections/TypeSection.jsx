// src/pages/home/sections/TypeSection.jsx
// Calls: GET /api/hotel/countByType

import { useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch.jsx";

const ICONS = { hotel: "🏨", apartment: "🏢", resort: "🌴", villa: "🏰", cabin: "🛖" };

const TypeSection = () => {
  const navigate = useNavigate();
  const { data: types, loading } = useFetch("/hotel/countByType");

  return (
    <section className="section section--stripe">
      <div className="section__header">
        <span className="section__eyebrow">ACCOMMODATIONS</span>
        <h2 className="section__title">Browse by Property Type</h2>
      </div>

      <div className="type-grid">
        {loading
          ? [1,2,3,4,5].map((i) => <div key={i} className="type-card skeleton" style={{ height: 140 }} />)
          : types?.map((item) => (
              <div key={item.type} className="type-card"
                onClick={() => navigate("/hotels", { state: { type: item.type } })}>
                <span className="type-card__icon">{ICONS[item.type] || "🏠"}</span>
                <h3 className="type-card__label">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</h3>
                <p className="type-card__count">{item.count} Options</p>
              </div>
            ))}
      </div>
    </section>
  );
};

export default TypeSection;

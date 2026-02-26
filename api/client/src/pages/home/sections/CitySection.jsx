// src/pages/home/sections/CitySection.jsx
// Fix: replaced broken Jaipur image URL

import { useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";


const CITIES = [
  { name: "New Delhi", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80", tag: "Capital"  },
  { name: "Mumbai",    img: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80", tag: "Coastal"  },
  { name: "Jaipur",    img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80", tag: "Heritage" },
  { name: "Udaipur",   img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80", tag: "Royal"    },
  { name: "Bangalore", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80", tag: "Modern"  },
];


const CitySection = () => {
  const navigate = useNavigate();
  const cityNames = CITIES.map((c) => c.name).join(",");
  const { data: counts, loading } = useFetch(`/hotel/countByCity?cities=${encodeURIComponent(cityNames)}`);

  return (
    <section className="section" id="cities">
      <div className="section__header">
        <span className="section__eyebrow">EXPLORE INDIA</span>
        <h2 className="section__title">Our Iconic Destinations</h2>
      </div>

      <div className="city-grid">
        {CITIES.map((city, i) => (
          <div
            key={city.name}
            className={`city-card ${i === 0 ? "city-card--large" : ""}`}
            onClick={() => navigate("/hotels", { state: { city: city.name } })}
          >
            <img src={city.img} alt={city.name} className="city-card__img" />
            <div className="city-card__gradient" />
            <div className="city-card__hover" />
            <div className="city-card__info">
              <span className="city-card__tag">{city.tag}</span>
              <h3 className="city-card__name">{city.name}</h3>
              <p className="city-card__count">
                {loading ? "..." : counts ? `${counts[i]} Properties` : "—"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CitySection;
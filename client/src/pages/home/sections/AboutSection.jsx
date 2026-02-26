// src/pages/home/sections/AboutSection.jsx

const STATS = [
  { num: "1+", label: "Years of Legacy"  },
  { num: "12",  label: "Properties"        },
  { num: "8",   label: "Heritage Sites"    },
  { num: "4.9★",label: "Avg Rating"        },
];

const AboutSection = () => (
  <section className="section section--stripe" id="about">
    <div className="about-grid">

      {/* Image collage */}
      <div className="about-images">
        <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700&q=80"
          alt="Hotel" className="about-img about-img--main" />
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80"
          alt="Dining" className="about-img about-img--small" />
        <div className="about-years">
          <span className="about-years__num">1</span>
          <span className="about-years__label">YEAR</span>
        </div>
      </div>

      {/* Text */}
      <div>
        <span className="section__eyebrow">OUR STORY</span>
        <h2 className="section__title" style={{ marginBottom: 24, textAlign: "left" }}>
          Crafting Memories
        </h2>
        <p className="about-text">
          Founded in 2025 by Mr. Priyanshu Gupta, our collection began with a single property in
          Rajasthan. Today, Gupta Hotels stands as India's most trusted symbol of luxury hospitality.
        </p>
        <p className="about-text">
          From restored Rajputana palaces to contemporary urban landmarks, every Gupta property is
          defined by meticulous attention to detail and an unwavering commitment to experiences
          that linger long after checkout.
        </p>
        <div className="about-stats">
          {STATS.map((s) => (
            <div key={s.label} className="about-stat">
              <span className="about-stat__num">{s.num}</span>
              <span className="about-stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;

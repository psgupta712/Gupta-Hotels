// src/pages/home/Home.jsx
// This file only assembles sections — all logic lives in sections/

import Navbar          from "../../components/navbar/Navbar.jsx";
import Footer          from "../../components/footer/Footer.jsx";
import Hero            from "./sections/Hero.jsx";
import CitySection     from "./sections/CitySection.jsx";
import TypeSection     from "./sections/TypeSection.jsx";
import FeaturedSection from "./sections/FeaturedSection.jsx";
import AboutSection    from "./sections/AboutSection.jsx";
import ContactSection  from "./sections/ContactSection.jsx";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <CitySection />
      <TypeSection />
      <FeaturedSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Home;

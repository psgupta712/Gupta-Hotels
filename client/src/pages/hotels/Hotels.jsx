// src/pages/hotels/Hotels.jsx
// All rendering is handled by FilterSidebar and HotelResults components

import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch.jsx";
import Navbar        from "../../components/navbar/Navbar.jsx";
import Footer        from "../../components/footer/Footer.jsx";
import FilterSidebar from "./components/FilterSidebar.jsx";
import HotelResults  from "./components/HotelResults.jsx";
import "./Hotels.css";

const Hotels = () => {
  const location    = useLocation();
  const searchState = location.state || {};

  // Filter state
  const [selectedType, setSelectedType] = useState("All");
  const [maxPrice,     setMaxPrice]     = useState(100000);
  const [minRating,    setMinRating]    = useState(0);
  const [sortBy,       setSortBy]       = useState("default");

  // Build query string for backend
  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (searchState.city)   p.append("city", searchState.city);
    if (searchState.guests) p.append("min",  searchState.guests);
    if (maxPrice < 100000)  p.append("max",  maxPrice);
    return p.toString();
  }, [searchState.city, searchState.guests, maxPrice]);

  const { data: hotels, loading, error } = useFetch(`/hotel${queryString ? "?" + queryString : ""}`);

  // Client-side filters + sort
  const filtered = useMemo(() => {
    if (!hotels) return [];
    let result = [...hotels];
    if (selectedType !== "All") result = result.filter((h) => h.type === selectedType);
    if (minRating > 0)          result = result.filter((h) => h.rating >= minRating);
    if (sortBy === "price_asc")  result.sort((a, b) => a.cheapestPrice - b.cheapestPrice);
    if (sortBy === "price_desc") result.sort((a, b) => b.cheapestPrice - a.cheapestPrice);
    if (sortBy === "rating")     result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [hotels, selectedType, minRating, sortBy]);

  const resetFilters = () => { setSelectedType("All"); setMaxPrice(100000); setMinRating(0); setSortBy("default"); };

  return (
    <div className="hotels-page">
      <Navbar />

      {/* Header */}
      <div className="hotels-page__header">
        <h1 className="hotels-page__title">
          {searchState.city ? `Hotels in ${searchState.city}` : "All Properties"}
        </h1>
        {searchState.city && <span className="chip">📍 {searchState.city}</span>}
      </div>

      {/* Body: sidebar + results */}
      <div className="hotels-page__body">
        <FilterSidebar
          selectedType={selectedType} setSelectedType={setSelectedType}
          maxPrice={maxPrice}         setMaxPrice={setMaxPrice}
          minRating={minRating}       setMinRating={setMinRating}
          onReset={resetFilters}
        />
        <HotelResults
          hotels={filtered} loading={loading} error={error}
          sortBy={sortBy} setSortBy={setSortBy}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Hotels;

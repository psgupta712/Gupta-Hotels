// src/pages/hotels/components/HotelResults.jsx

import HotelCard from "../../../components/hotelCard/HotelCard.jsx";

const HotelResults = ({ hotels, loading, error, sortBy, setSortBy }) => (
  <div className="hotels-results">

    {/* Count + sort row */}
    <div className="hotels-results__top">
      <p className="hotels-results__count">
        {loading ? "Searching..." : `${hotels.length} ${hotels.length === 1 ? "property" : "properties"} found`}
      </p>
      <select className="hotels-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="default">Sort: Default</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
    </div>

    {/* Loading skeletons */}
    {loading && (
      <div className="hotels-results__loading">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 200, width: "100%" }} />
        ))}
      </div>
    )}

    {/* Error */}
    {error && !loading && (
      <div className="hotels-results__error">
        <span>⚠</span>
        <p>Could not load hotels. Please try again.</p>
        <small>Something went wrong</small>
      </div>
    )}

    {/* Empty */}
    {!loading && !error && hotels.length === 0 && (
      <div className="hotels-results__empty">
        <span>🏨</span>
        <p>No hotels match your filters.</p>
        <small>Try adjusting your price range or property type.</small>
      </div>
    )}

    {/* Results */}
    {!loading && !error && hotels.length > 0 && (
      <div className="hotels-list">
        {hotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)}
      </div>
    )}
  </div>
);

export default HotelResults;

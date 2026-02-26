// src/pages/hotels/components/FilterSidebar.jsx

const TYPES = ["All", "hotel", "apartment", "resort", "villa", "cabin"];

const FilterSidebar = ({ selectedType, setSelectedType, maxPrice, setMaxPrice, minRating, setMinRating, onReset }) => (
  <aside className="hotels-sidebar">
    <h2 className="hotels-sidebar__title">Filter</h2>

    {/* Property Type */}
    <div className="filter-group">
      <label className="filter-group__label">PROPERTY TYPE</label>
      <div className="filter-type-grid">
        {TYPES.map((type) => (
          <button key={type}
            className={`filter-type-btn ${selectedType === type ? "active" : ""}`}
            onClick={() => setSelectedType(type)}>
            {type === "All" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>

    {/* Max Price */}
    <div className="filter-group">
      <label className="filter-group__label">
        MAX PRICE: <span className="filter-value">₹{maxPrice.toLocaleString("en-IN")}</span>
      </label>
      <input type="range" min={1000} max={100000} step={1000} value={maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value))} className="filter-slider" />
      <div className="filter-slider-labels">
        <span>₹1,000</span><span>₹1,00,000</span>
      </div>
    </div>

    {/* Min Rating */}
    <div className="filter-group">
      <label className="filter-group__label">MINIMUM RATING</label>
      <div className="filter-rating-btns">
        {[0, 3, 3.5, 4, 4.5].map((r) => (
          <button key={r}
            className={`filter-rating-btn ${minRating === r ? "active" : ""}`}
            onClick={() => setMinRating(r)}>
            {r === 0 ? "Any" : `${r}+`}
          </button>
        ))}
      </div>
    </div>

    <button className="filter-reset-btn" onClick={onReset}>Reset Filters</button>
  </aside>
);

export default FilterSidebar;

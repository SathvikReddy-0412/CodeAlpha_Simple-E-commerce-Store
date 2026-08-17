import React from 'react';
import { SlidersHorizontal, RotateCcw, Search, Star, Check } from 'lucide-react';
import { CATEGORIES } from '../services/productsData';
import { formatCurrency } from '../utils/formatters';
import './FilterSidebar.css';

export const FilterSidebar = ({ filters, setFilters, resetFilters, totalResults }) => {
  const handleCategoryChange = (catId) => {
    setFilters(prev => ({ ...prev, category: catId }));
  };

  const handlePriceChange = (e) => {
    setFilters(prev => ({ ...prev, maxPrice: e.target.value }));
  };

  const handleRatingChange = (rating) => {
    setFilters(prev => ({ ...prev, minRating: prev.minRating === rating ? 0 : rating }));
  };

  const handleStockToggle = (e) => {
    setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }));
  };

  return (
    <aside className="filter-sidebar glass-card">
      <div className="filter-sidebar-header">
        <div className="title-with-icon">
          <SlidersHorizontal size={18} className="header-icon" />
          <h3>Filters</h3>
        </div>
        <button className="reset-btn" onClick={resetFilters} title="Reset all filters">
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <h4 className="filter-title">Categories</h4>
        <div className="category-list">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-item ${filters.category === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              <span>{cat.name}</span>
              <span className="cat-count">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="filter-group">
        <div className="filter-title-row">
          <h4 className="filter-title">Max Price</h4>
          <span className="price-val-badge">{formatCurrency(filters.maxPrice)}</span>
        </div>
        <input
          type="range"
          min="30"
          max="300"
          step="10"
          value={filters.maxPrice}
          onChange={handlePriceChange}
          className="price-slider"
        />
        <div className="slider-labels">
          <span>$30</span>
          <span>$300</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="filter-group">
        <h4 className="filter-title">Minimum Rating</h4>
        <div className="rating-options">
          {[4.5, 4.0, 3.5].map((rating) => (
            <button
              key={rating}
              className={`rating-pill ${filters.minRating === rating ? 'active' : ''}`}
              onClick={() => handleRatingChange(rating)}
            >
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span>{rating} & Up</span>
              {filters.minRating === rating && <Check size={12} className="check-icon" />}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Availability */}
      <div className="filter-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={handleStockToggle}
            className="custom-checkbox"
          />
          <span className="checkbox-text">In Stock Only</span>
        </label>
      </div>
    </aside>
  );
};

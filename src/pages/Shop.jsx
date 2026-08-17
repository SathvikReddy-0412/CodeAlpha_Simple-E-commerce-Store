import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Grid, List, X, Search, RotateCcw } from 'lucide-react';
import { productService } from '../services/backendService';
import { ProductCard } from '../components/ProductCard';
import { FilterSidebar } from '../components/FilterSidebar';
import './Shop.css';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('featured');

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Synchronize state with URL parameters
  useEffect(() => {
    const cat = searchParams.get('category');
    const query = searchParams.get('search');
    if (cat) setSelectedCategory(cat);
    if (query !== null) setSearchQuery(query);
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const { products: data } = await productService.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Filter and Sort Logic
  useEffect(() => {
    let result = [...products];

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Price Filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Rating Filter
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }

    // In Stock Filter
    if (inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // Sort Logic
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isTrending ? 1 : -1));
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, priceRange, minRating, inStockOnly, searchQuery, sortBy]);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 500]);
    setMinRating(0);
    setInStockOnly(false);
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="shop-page page-wrapper container">
      {/* Header Banner */}
      <div className="shop-header-banner glass-card">
        <div>
          <h1 className="shop-title">Shop Product Catalog</h1>
          <p className="shop-subtitle">
            Explore curated acoustic tech, luxury leather goods, and sustainable home essentials.
          </p>
        </div>
        <div className="shop-results-count">
          Showing <b>{filteredProducts.length}</b> Products
        </div>
      </div>

      <div className="shop-layout">
        {/* Desktop Filter Sidebar */}
        <aside className="shop-sidebar-desktop">
          <FilterSidebar
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setSearchParams(cat !== 'all' ? { category: cat } : {});
            }}
            priceRange={priceRange}
            onChangePriceRange={setPriceRange}
            minRating={minRating}
            onChangeMinRating={setMinRating}
            inStockOnly={inStockOnly}
            onChangeInStockOnly={setInStockOnly}
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
            onResetFilters={resetAllFilters}
          />
        </aside>

        {/* Catalog Main Content */}
        <main className="shop-main-content">
          {/* Top Control Bar */}
          <div className="shop-control-bar glass-card">
            {/* Mobile Filter Button */}
            <button
              className="btn btn-secondary btn-sm mobile-filter-trigger"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <Filter size={16} /> Filters
            </button>

            {/* Search Input Bar inside shop */}
            <div className="shop-search-inline">
              <Search size={16} className="inline-search-icon" />
              <input
                type="text"
                placeholder="Filter items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="clear-inline-btn">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sorting & Layout Toggles */}
            <div className="control-bar-right">
              <div className="sort-wrapper">
                <SlidersHorizontal size={15} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">New Releases</option>
                </select>
              </div>

              <div className="view-mode-toggle">
                <button
                  className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <Grid size={18} />
                </button>
                <button
                  className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {(selectedCategory !== 'all' || searchQuery || minRating > 0 || inStockOnly) && (
            <div className="active-filter-chips">
              <span className="chips-label">Active Filters:</span>
              {selectedCategory !== 'all' && (
                <span className="filter-chip">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}><X size={12} /></button>
                </span>
              )}
              {searchQuery && (
                <span className="filter-chip">
                  Query: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}><X size={12} /></button>
                </span>
              )}
              {minRating > 0 && (
                <span className="filter-chip">
                  Rating: {minRating}★+
                  <button onClick={() => setMinRating(0)}><X size={12} /></button>
                </span>
              )}
              {inStockOnly && (
                <span className="filter-chip">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}><X size={12} /></button>
                </span>
              )}
              <button className="reset-chips-btn" onClick={resetAllFilters}>
                <RotateCcw size={12} /> Clear All
              </button>
            </div>
          )}

          {/* Products Grid / List Display */}
          {loading ? (
            <div className="product-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="shop-empty-state glass-card">
              <Search size={48} className="empty-icon" />
              <h3>No products found</h3>
              <p>We couldn't find any products matching your current filters or search criteria.</p>
              <button className="btn btn-primary" onClick={resetAllFilters}>
                <RotateCcw size={16} /> Reset All Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'product-grid' : 'product-list-view'}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Sidebar Modal */}
      {isMobileFilterOpen && (
        <div className="modal-overlay" onClick={() => setIsMobileFilterOpen(false)}>
          <div className="mobile-filter-drawer glass-card animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <h3>Filter Products</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}><X size={20} /></button>
            </div>
            <FilterSidebar
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setIsMobileFilterOpen(false);
              }}
              priceRange={priceRange}
              onChangePriceRange={setPriceRange}
              minRating={minRating}
              onChangeMinRating={setMinRating}
              inStockOnly={inStockOnly}
              onChangeInStockOnly={setInStockOnly}
              searchQuery={searchQuery}
              onChangeSearchQuery={setSearchQuery}
              onResetFilters={resetAllFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
};

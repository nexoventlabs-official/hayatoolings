import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, X, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';
import bannerA from '../assets/a.jpg';
import bannerB from '../assets/b.jpg';
import bannerC from '../assets/c.jpg';
import './Products.css';

const bannerImages = [bannerA, bannerB, bannerC];

// Derive categories from product names
const categorizeProduct = (name) => {
  const n = name.toUpperCase();
  if (n.includes('DRILL') || n.includes('T/S')) return 'Drills';
  if (n.includes('ENDMILL') || n.includes('MILLING') || n.includes('CUTTER')) return 'Milling Tools';
  if (n.includes('INSERT') || n.includes('THREADING')) return 'Inserts';
  if (n.includes('TAP') || n.includes('DIE')) return 'Taps & Dies';
  if (n.includes('BORING') || n.includes('BAR')) return 'Boring Tools';
  if (n.includes('TOOL') || n.includes('HOLDER')) return 'Tool Holders';
  if (n.includes('CONNECTOR') || n.includes('FITTING') || n.includes('HOSE') || n.includes('TUBE')) return 'Pneumatics';
  if (n.includes('BEARING') || n.includes('SKF') || n.includes('NSK')) return 'Bearings';
  if (n.includes('GAUGE') || n.includes('SCALE') || n.includes('CALIPER')) return 'Measuring';
  if (n.includes('WHEEL') || n.includes('DISC') || n.includes('GRINDING')) return 'Grinding & Cutting';
  if (n.includes('FIXTURE') || n.includes('PALLET') || n.includes('CHUCK')) return 'Fixtures';
  if (n.includes('SCREW') || n.includes('NUT') || n.includes('BOLT') || n.includes('KEY')) return 'Fasteners';
  if (n.includes('ROPE') || n.includes('CABLE') || n.includes('PIPE')) return 'Cables & Ropes';
  return 'Others';
};

const allCategories = [...new Set(productsData.map(p => categorizeProduct(p.name)))].sort();

const PRODUCTS_PER_PAGE = 20;

const Products = () => {
  const { currency, symbols, convert } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ category: true, price: true });

  const priceRanges = useMemo(() => {
    const isINR = currency === 'INR';
    const thresholds = isINR 
      ? [50000, 100000, 150000, 200000]
      : [500, 1000, 1500, 2000];
      
    const sym = symbols[currency] || '$';

    return [
      { label: `Under ${sym}${thresholds[0].toLocaleString()}`, min: 0, max: thresholds[0] },
      { label: `${sym}${thresholds[0].toLocaleString()} - ${sym}${thresholds[1].toLocaleString()}`, min: thresholds[0], max: thresholds[1] },
      { label: `${sym}${thresholds[1].toLocaleString()} - ${sym}${thresholds[2].toLocaleString()}`, min: thresholds[1], max: thresholds[2] },
      { label: `${sym}${thresholds[2].toLocaleString()} - ${sym}${thresholds[3].toLocaleString()}`, min: thresholds[2], max: thresholds[3] },
      { label: `Above ${sym}${thresholds[3].toLocaleString()}`, min: thresholds[3], max: Infinity },
    ];
  }, [currency, symbols]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  const togglePriceRange = (index) => {
    setSelectedPriceRanges(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSearchTerm('');
    setSortBy('relevance');
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    let result = [...productsData];

    // Search filter
    if (searchTerm) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(categorizeProduct(p.name)));
    }

    // Price filter
    if (selectedPriceRanges.length > 0) {
      result = result.filter(p => {
        const currentPrice = convert(p.price);
        return selectedPriceRanges.some(i => currentPrice >= priceRanges[i].min && currentPrice < priceRanges[i].max);
      });
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-az':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [searchTerm, selectedCategories, selectedPriceRanges, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const activeFilterCount = selectedCategories.length + selectedPriceRanges.length;

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getCategoryCount = (cat) => {
    return productsData.filter(p => categorizeProduct(p.name) === cat).length;
  };

  return (
    <div className="products-page">
      {/* Breadcrumb */}
      <div className="products-breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span>Products</span>
        </div>
      </div>

      <div className="container">
        {/* Top Bar: Search + Sort */}
        <div className="products-topbar">
          <div className="products-search-wrapper">
            <Search size={18} className="products-search-icon" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="products-search-input"
            />
            {searchTerm && (
              <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="products-topbar-right">
            <button
              className="mobile-filter-btn"
              onClick={() => setShowMobileFilter(!showMobileFilter)}
            >
              <SlidersHorizontal size={18} />
              Filters {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
            </button>

            <div className="sort-wrapper">
              <label>Sort By:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
                <option value="name-za">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Tags */}
        {activeFilterCount > 0 && (
          <div className="active-filters">
            {selectedCategories.map(cat => (
              <span key={cat} className="active-filter-tag">
                {cat}
                <button onClick={() => toggleCategory(cat)}><X size={14} /></button>
              </span>
            ))}
            {selectedPriceRanges.map(i => (
              <span key={i} className="active-filter-tag">
                {priceRanges[i].label}
                <button onClick={() => togglePriceRange(i)}><X size={14} /></button>
              </span>
            ))}
          </div>
        )}

        {/* Main Layout */}
        <div className="products-layout">
          {/* Desktop Sidebar */}
          <aside className={`products-sidebar ${showMobileFilter ? 'show-mobile' : ''}`}>
            <div className="filter-sidebar">
              <div className="filter-header">
                <h3>Filters</h3>
                {activeFilterCount > 0 && (
                  <button className="clear-filters-btn" onClick={clearAllFilters}>
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="filter-section">
                <button className="filter-section-title" onClick={() => toggleSection('category')}>
                  <span>CATEGORY</span>
                  {expandedSections.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSections.category && (
                  <div className="filter-options">
                    {allCategories.map(cat => (
                      <label key={cat} className="filter-option">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                        />
                        <span className="filter-label">{cat}</span>
                        <span className="filter-count">({getCategoryCount(cat)})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="filter-section">
                <button className="filter-section-title" onClick={() => toggleSection('price')}>
                  <span>PRICE</span>
                  {expandedSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSections.price && (
                  <div className="filter-options">
                    {priceRanges.map((range, i) => (
                      <label key={i} className="filter-option">
                        <input
                          type="checkbox"
                          checked={selectedPriceRanges.includes(i)}
                          onChange={() => togglePriceRange(i)}
                        />
                        <span className="filter-label">{range.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Mobile Filter Overlay */}
          {showMobileFilter && (
            <div className="filter-overlay" onClick={() => setShowMobileFilter(false)} />
          )}

          {/* Products Grid */}
          <div className="products-main">
            {/* Rotating Banner */}
            <div className="products-banner">
              {bannerImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Banner ${idx + 1}`}
                  className={`products-banner-img ${idx === currentBanner ? 'active' : ''}`}
                />
              ))}
            </div>

            <div className="products-info-bar">
              <p>Showing <strong>{(currentPage - 1) * PRODUCTS_PER_PAGE + 1}-{Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> products</p>
            </div>

            {paginatedProducts.length > 0 ? (
              <div className="products-grid">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search term</p>
                <button className="btn btn-primary" onClick={clearAllFilters}>
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    if (totalPages <= 7) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .reduce((acc, page, i, arr) => {
                    if (i > 0 && page - arr[i - 1] > 1) {
                      acc.push('...');
                    }
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === '...' ? (
                      <span key={`ellipsis-${idx}`} className="pagination-ellipsis">...</span>
                    ) : (
                      <button
                        key={item}
                        className={`pagination-btn ${currentPage === item ? 'active' : ''}`}
                        onClick={() => setCurrentPage(item)}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

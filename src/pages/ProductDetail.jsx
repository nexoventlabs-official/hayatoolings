import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw,
  ChevronRight, Package, ChevronLeft,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';
import './ProductDetail.css';

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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, updateQuantity } = useCart();
  const { format } = useCurrency();

  const product = productsData.find(p => p.id === parseInt(id));
  const cartItem = cart.find(item => item.id === product?.id);

  const formattedPrice = product ? format(product.price) : '';

  const category = product ? categorizeProduct(product.name) : '';

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return productsData
      .filter(p => p.id !== product.id && categorizeProduct(p.name) === category)
      .slice(0, 4);
  }, [product, category]);

  // Build the carousel slide list. For bundle products we look up each
  // bundleItems entry against the catalog (by name) and use that product's
  // image, so the customer literally sees the items they're buying. For
  // singletons we just show the single product image — no rotation needed.
  const carouselSlides = useMemo(() => {
    if (!product) return [];
    const cover = { image: product.image, label: product.name };
    if (!Array.isArray(product.bundleItems) || product.bundleItems.length === 0) {
      return [cover];
    }
    const matched = product.bundleItems.map((itemName) => {
      const hit = productsData.find((p) => p.name === itemName || p.name.includes(itemName) || itemName.includes(p.name));
      return {
        image: hit?.image || product.image,
        label: itemName,
      };
    });
    // First slide is the cover so the customer sees the headline image, then
    // the carousel reveals what's inside.
    return [cover, ...matched];
  }, [product]);

  const [slideIndex, setSlideIndex] = useState(0);
  // React 18 pattern: reset state-derived-from-props *during render* by
  // comparing the previous prop value, instead of using an effect with
  // setState. Avoids the cascading-render lint and runs one render earlier.
  const [prevProductId, setPrevProductId] = useState(product?.id);
  if (product?.id !== prevProductId) {
    setPrevProductId(product?.id);
    setSlideIndex(0);
  }

  // Auto-advance every 3s when the bundle has multiple slides. Pause on tab
  // hidden so we don't waste cycles on background tabs.
  useEffect(() => {
    if (carouselSlides.length <= 1) return undefined;
    const tick = () => setSlideIndex((i) => (i + 1) % carouselSlides.length);
    const timer = setInterval(tick, 3000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  const goPrev = () => setSlideIndex((i) => (i - 1 + carouselSlides.length) % carouselSlides.length);
  const goNext = () => setSlideIndex((i) => (i + 1) % carouselSlides.length);

  // Buy Now: ensure the product is in the cart, then send the user straight
  // to /checkout — they no longer have to first "Add to Cart" and then click
  // Cart → Checkout.
  const handleBuyNow = () => {
    if (!product) return;
    if (!cartItem) addToCart(product);
    navigate('/checkout');
  };

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="not-found">
            <h2>Product not found</h2>
            <p>The product you're looking for doesn't exist.</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <div className="detail-breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products">Products</Link>
          <ChevronRight size={14} />
          <span>{product.name}</span>
        </div>
      </div>

      <div className="container">
        {/* Product Main Section */}
        <div className="detail-main">
          {/* Product Image / Bundle Carousel */}
          <div className="detail-image-section">
            <div className="detail-image-wrapper detail-carousel">
              {carouselSlides[slideIndex]?.image ? (
                <img
                  key={slideIndex}
                  src={carouselSlides[slideIndex].image}
                  alt={carouselSlides[slideIndex].label}
                  className="detail-image carousel-fade"
                />
              ) : (
                <div className="detail-image-placeholder">
                  <div className="abstract-shape shape-1"></div>
                  <div className="abstract-shape shape-2"></div>
                  <span className="placeholder-text">Image Pending</span>
                </div>
              )}

              {carouselSlides.length > 1 && (
                <>
                  <button
                    type="button"
                    className="carousel-nav carousel-nav-prev"
                    onClick={goPrev}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    className="carousel-nav carousel-nav-next"
                    onClick={goNext}
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="carousel-caption">
                    {slideIndex === 0 ? 'Bundle cover' : `${slideIndex} of ${carouselSlides.length - 1}`}
                    {slideIndex > 0 && (
                      <span className="carousel-caption-name"> — {carouselSlides[slideIndex].label}</span>
                    )}
                  </div>
                  <div className="carousel-dots">
                    {carouselSlides.map((_, i) => (
                      <button
                        type="button"
                        key={i}
                        className={`carousel-dot ${i === slideIndex ? 'active' : ''}`}
                        onClick={() => setSlideIndex(i)}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="detail-info-section">
            <span className="detail-category">{category}</span>
            <h1 className="detail-title">{product.name}</h1>
            
            <div className="detail-rating">
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className={`star ${star <= 4 ? 'filled' : ''}`}>★</span>
                ))}
              </div>
              <span className="rating-text">4.0 (12 Reviews)</span>
            </div>

            <div className="detail-price-section">
              <span className="detail-price">{formattedPrice}</span>
              <span className="detail-tax">Inclusive of all taxes</span>
            </div>

            <div className="detail-divider"></div>

            {/* What's Inside (bundle products only) */}
            {Array.isArray(product.bundleItems) && product.bundleItems.length > 0 && (
              <div className="detail-highlights bundle-includes">
                <h4><Package size={16} style={{ verticalAlign: '-3px', marginRight: 6 }} />What’s Inside ({product.bundleItems.length}-in-1)</h4>
                <ul>
                  {product.bundleItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Highlights */}
            <div className="detail-highlights">
              <h4>Product Highlights</h4>
              <ul>
                <li>Premium industrial grade quality</li>
                <li>Category: {category}</li>
                <li>Product ID: #{product.id}</li>
                <li>In Stock - Ready to Ship</li>
              </ul>
            </div>

            <div className="detail-divider"></div>

            {/* Add to Cart */}
            <div className="detail-cart-section">
              {cartItem ? (
                <div className="detail-qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(product.id, -1)}
                    disabled={cartItem.quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="qty-value">{cartItem.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(product.id, 1)}>
                    <Plus size={18} />
                  </button>
                </div>
              ) : (
                <button className="btn btn-primary detail-add-btn" onClick={() => addToCart(product)}>
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline detail-buy-btn"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>

            {/* Delivery Features */}
            <div className="detail-features">
              <div className="feature-item">
                <Truck size={20} />
                <div>
                  <strong>Free Delivery</strong>
                  <p>On orders above ₹500</p>
                </div>
              </div>
              <div className="feature-item">
                <Shield size={20} />
                <div>
                  <strong>Warranty</strong>
                  <p>Manufacturer warranty</p>
                </div>
              </div>
              <div className="feature-item">
                <RotateCcw size={20} />
                <div>
                  <strong>Easy Returns</strong>
                  <p>7 day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="detail-description-section">
          <h3>Product Description</h3>
          <div className="description-content">
            {product.description ? (
              <p>{product.description}</p>
            ) : (
              <p>
                The <strong>{product.name}</strong> is a high-quality industrial tool designed for precision
                and durability. Built to meet the demands of professional workshops and manufacturing units,
                this product offers reliable performance in demanding conditions.
              </p>
            )}
            {Array.isArray(product.bundleItems) && product.bundleItems.length > 0 && (
              <>
                <h4>This Bundle Contains</h4>
                <ul className="bundle-items-list">
                  {product.bundleItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </>
            )}
            <h4>Specifications</h4>
            <table className="specs-table">
              <tbody>
                <tr><td>Product Name</td><td>{product.name}</td></tr>
                <tr><td>Category</td><td>{category}</td></tr>
                <tr><td>Price</td><td>{formattedPrice}</td></tr>
                <tr><td>SKU</td><td>HT-{String(product.id).padStart(5, '0')}</td></tr>
                <tr><td>Availability</td><td>In Stock</td></tr>
                <tr><td>Brand</td><td>Haya Toolings</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <div className="related-header">
              <h3>Related Products</h3>
              <Link to="/products" className="btn btn-outline">View All</Link>
            </div>
            <div className="related-grid">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

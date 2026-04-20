import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
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
  const { addToCart, cart, updateQuantity } = useCart();

  const product = productsData.find(p => p.id === parseInt(id));
  const cartItem = cart.find(item => item.id === product?.id);

  const formattedPrice = product
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price)
    : '';

  const category = product ? categorizeProduct(product.name) : '';

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return productsData
      .filter(p => p.id !== product.id && categorizeProduct(p.name) === category)
      .slice(0, 4);
  }, [product, category]);

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
          {/* Product Image */}
          <div className="detail-image-section">
            <div className="detail-image-wrapper">
              {product.image ? (
                <img src={product.image} alt={product.name} className="detail-image" />
              ) : (
                <div className="detail-image-placeholder">
                  <div className="abstract-shape shape-1"></div>
                  <div className="abstract-shape shape-2"></div>
                  <span className="placeholder-text">Image Pending</span>
                </div>
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
              <Link to="/checkout" className="btn btn-outline detail-buy-btn">
                Buy Now
              </Link>
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
            <p>
              The <strong>{product.name}</strong> is a high-quality industrial tool designed for precision
              and durability. Built to meet the demands of professional workshops and manufacturing units,
              this product offers reliable performance in demanding conditions.
            </p>
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

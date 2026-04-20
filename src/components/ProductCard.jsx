import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product, hideAddButton }) => {
  const { addToCart } = useCart();
  
  // Format price
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(product.price);

  return (
    <div className="product-card glass animate-fade-in">
      <Link to={`/product/${product.id}`} className="product-card-link">
        <div className="product-image-wrapper">
          {product.image ? (
            <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
          ) : (
            <div className="product-image-placeholder">
              <div className="abstract-shape shape-1"></div>
              <div className="abstract-shape shape-2"></div>
              <span className="placeholder-text">Image Pending</span>
            </div>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name" title={product.name}>
            {product.name}
          </h3>
        </div>
      </Link>
      
      <div className="product-info product-actions-bar">
        <div className="product-footer">
          <span className="product-price">{formattedPrice}</span>
          {!hideAddButton && (
            <button 
              className="btn btn-primary add-to-cart-btn"
              onClick={() => addToCart(product)}
              aria-label="Add to Cart"
            >
              <ShoppingCart size={18} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

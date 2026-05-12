import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import productsData from '../data/products.json';
import './ProductCard.css';

const ProductCard = ({ product, hideAddButton }) => {
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const [slideIndex, setSlideIndex] = useState(0);

  const carouselSlides = useMemo(() => {
    if (!product) return [];
    const cover = { image: product.image };
    if (!Array.isArray(product.bundleItems) || product.bundleItems.length === 0) {
      return [cover];
    }
    const matched = product.bundleItems.map((itemName) => {
      // Find the product whose original name (stored in bundleItems[0]) matches the item
      const hit = productsData.find((p) => (p.bundleItems && p.bundleItems[0] === itemName) || p.name === itemName);
      return {
        image: hit?.image || product.image,
      };
    });
    return matched;
  }, [product]);

  useEffect(() => {
    if (carouselSlides.length <= 1) return undefined;
    const tick = () => setSlideIndex((i) => (i + 1) % carouselSlides.length);
    const timer = setInterval(tick, 3000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  const formattedPrice = format(product.price);
  const currentImage = carouselSlides[slideIndex]?.image || product.image;

  return (
    <div className="product-card glass animate-fade-in">
      <Link to={`/product/${product.id}`} className="product-card-link">
        <div className="product-image-wrapper">
          {currentImage ? (
            <img src={currentImage} alt={product.name} className="product-image" loading="lazy" />
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

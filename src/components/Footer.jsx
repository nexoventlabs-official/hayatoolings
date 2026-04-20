import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1 */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-brand">
              <span className="brand-name">HAYA TOOLINGS</span>
            </Link>
            
            <div className="customer-support">
              <div className="support-icon">
                <Headphones size={28} />
              </div>
              <div className="support-text">
                <p>24x7 Hours Customer Supports</p>
                <h4>+91 8680085737</h4>
              </div>
            </div>

            <div className="footer-address">
              <h5>ADDRESS</h5>
              <p>26N, Bharathi Nagar, Near Palayapudur, Periyanaickenpalayam, Coimbatore, Tamil Nadu - 641020</p>
            </div>
          </div>

          {/* Col 2 */}
          <div className="footer-col">
            <h4 className="footer-title">KNOW US</h4>
            <nav className="footer-nav">
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/products">Products</Link>
              <Link to="/quote">Request a Quote</Link>
            </nav>
          </div>

          {/* Col 3 */}
          <div className="footer-col">
            <h4 className="footer-title">USEFUL LINK</h4>
            <nav className="footer-nav">
              <Link to="/shipping">Shipping Policy</Link>
              <Link to="/returns">Returns & Refunds</Link>
              <Link to="/terms">Terms & Conditions</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </nav>
          </div>

          {/* Col 4 */}
          <div className="footer-col">
            <h4 className="footer-title">OUR SOCIAL CIRCLE</h4>
            <div className="social-icons">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon social-facebook" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon social-twitter" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon social-instagram" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon social-youtube" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
            
            <h4 className="footer-title mt-8">WE ARE IN PLAY STORE</h4>
            <div className="store-badges">
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="store-badge" />
              </a>
              <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="store-badge" />
              </a>
            </div>
          </div>

          {/* Col 5 */}
          <div className="footer-col">
            <h4 className="footer-title">INFORMATION</h4>
            <nav className="footer-nav">
              <Link to="/">Home</Link>
              <Link to="/checkout">Checkout</Link>
            </nav>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom-bar">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">&copy; {new Date().getFullYear()} Haya Toolings | Design Themes</p>
            <div className="payment-icons">
              {/* Visa */}
              <span className="payment-card">
                <svg viewBox="0 0 48 32" width="48" height="32"><rect width="48" height="32" rx="4" fill="#1A1F71"/><text x="24" y="21" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold" fontFamily="Arial, sans-serif" fontStyle="italic">VISA</text></svg>
              </span>
              {/* Mastercard */}
              <span className="payment-card">
                <svg viewBox="0 0 48 32" width="48" height="32"><rect width="48" height="32" rx="4" fill="#fff" stroke="#e0e0e0"/><circle cx="19" cy="16" r="9" fill="#EB001B"/><circle cx="29" cy="16" r="9" fill="#F79E1B"/><circle cx="24" cy="16" r="5.5" fill="#FF5F00" opacity="0.8"/></svg>
              </span>
              {/* UPI */}
              <span className="payment-card">
                <svg viewBox="0 0 48 32" width="48" height="32"><rect width="48" height="32" rx="4" fill="#fff" stroke="#e0e0e0"/><text x="24" y="20" textAnchor="middle" fill="#4CAF50" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif">UPI</text></svg>
              </span>
              {/* RuPay */}
              <span className="payment-card">
                <svg viewBox="0 0 48 32" width="48" height="32"><rect width="48" height="32" rx="4" fill="#fff" stroke="#e0e0e0"/><text x="24" y="14" textAnchor="middle" fill="#097A44" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">Ru</text><text x="24" y="25" textAnchor="middle" fill="#F37021" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">Pay</text></svg>
              </span>
              {/* PayPal */}
              <span className="payment-card">
                <svg viewBox="0 0 48 32" width="48" height="32"><rect width="48" height="32" rx="4" fill="#003087"/><text x="24" y="14" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">Pay</text><text x="24" y="25" textAnchor="middle" fill="#009cde" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">Pal</text></svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

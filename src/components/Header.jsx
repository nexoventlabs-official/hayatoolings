import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Wrench, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="header glass">
      <div className="container header-content">
        <Link to="/" className="brand">
          <Wrench className="brand-icon text-accent" size={28} />
          <span className="brand-text">HAYA TOOLINGS</span>
        </Link>
        
        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
          <Link to="/quote" onClick={() => setIsMenuOpen(false)}>Quote Request</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
        </nav>

        <div className="header-actions">
          <Link to="/checkout" className="cart-btn">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

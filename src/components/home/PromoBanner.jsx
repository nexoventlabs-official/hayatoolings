import React from 'react';
import { Link } from 'react-router-dom';
import './PromoBanner.css';

const PromoBanner = () => {
  return (
    <section className="dt-sc-section-wrapper promo-banner-section">
      <div className="container">
        <div className="additional-block">
          <div className="image-content-wrapper">
            <div className="image">
              <img 
                src="//dt-fixxer.myshopify.com/cdn/shop/files/grid-34.jpg?v=1665723235&width=1920" 
                loading="lazy" 
                alt="Promo background" 
                className="promo-bg-img"
              />
            </div>
            <div className="image-content">
              <img 
                src="//dt-fixxer.myshopify.com/cdn/shop/files/grilogo.png?v=1665725014&width=192" 
                loading="lazy" 
                alt="Brand logo" 
                className="promo-logo"
              />
              <h2>Best Super Power <br /><b>Drilling Machines</b></h2>
              <div className="dt-sc-btn-container">
                <Link to="/products" className="dt-sc-btn">Shop Now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;

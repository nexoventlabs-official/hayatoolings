import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/home/HeroSlider';
import ProductTabs from '../components/home/ProductTabs';
import AboutSection from '../components/home/AboutSection';
import PromoBanner from '../components/home/PromoBanner';
import Testimonials from '../components/home/Testimonials';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';
import './Home.css';

const Home = () => {
  const featuredProducts = productsData.slice(0, 4);

  return (
    <div className="home-container">
      <HeroSlider />
      <ProductTabs />
      <AboutSection />

      {/* Featured Products */}
      <div className="main-content">
        <div className="container">
          <div className="content-header">
            <div>
              <h2 className="h2 mb-2">Our <span className="text-accent">Products</span></h2>
              <p className="text-secondary">Browse our comprehensive catalog of industrial tools.</p>
            </div>
            <Link to="/products" className="btn btn-outline view-all-btn">
              View All Products <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className={`animate-fade-in delay-${(index % 4) * 100}`}>
                <ProductCard product={product} hideAddButton />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <PromoBanner />
      <Testimonials />
    </div>
  );
};

export default Home;

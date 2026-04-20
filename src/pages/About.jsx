import React from 'react';
import { Award, Users, Target, Truck, Clock, Phone, Shield, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import openingBgMask from '../assets/opening-bg-mask.png';
import './About.css';
import './FormPages.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Banner */}
      <section className="about-hero">
        <div className="container">
          <h1 className="about-hero-title">About <span className="text-accent">Haya Toolings</span></h1>
          <p className="about-hero-subtitle">Your Trusted Partner in Industrial Tools & Hardware Since 2021</p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="about-section">
        <div className="container">
          <div className="about-intro">
            <div className="about-intro-text">
              <span className="section-label">WHO WE ARE</span>
              <h2 className="section-title">Precision in Every Move, Power in Every Tool</h2>
              <p>
                Haya Toolings is a leading supplier of premium industrial tools, cutting instruments, and hardware solutions. 
                With over a decade of experience, we serve manufacturing units, workshops, and industries across India with 
                top-quality products at competitive prices.
              </p>
              <p>
                Our extensive catalog includes drills, milling tools, carbide inserts, boring bars, measuring instruments, 
                pneumatic fittings, bearings, grinding wheels, and much more from trusted brands and manufacturers.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-card">
                <span className="stat-number">10+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">5000+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">2000+</span>
                <span className="stat-label">Happy Clients</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">50+</span>
                <span className="stat-label">Brands</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-section about-features-section">
        <div className="container">
          <div className="section-header-center">
            <span className="section-label">WHY CHOOSE US</span>
            <h2 className="section-title">What Sets Us Apart</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><Award size={32} /></div>
              <h3>Premium Quality</h3>
              <p>We source only from certified manufacturers ensuring every tool meets the highest industry standards.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Target size={32} /></div>
              <h3>Wide Range</h3>
              <p>From precision cutting tools to heavy-duty hardware, we stock everything your workshop needs.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Truck size={32} /></div>
              <h3>Fast Delivery</h3>
              <p>Quick dispatch and reliable shipping across India so you never face downtime in your operations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Shield size={32} /></div>
              <h3>Trusted Service</h3>
              <p>Dedicated support team ready to help you find the right tools and resolve any queries promptly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Users size={32} /></div>
              <h3>Expert Guidance</h3>
              <p>Our team of experienced professionals provides technical guidance on tool selection and usage.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Wrench size={32} /></div>
              <h3>Competitive Pricing</h3>
              <p>Best-in-class pricing with bulk order discounts and flexible payment options for businesses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours Section */}
      <section className="business-hours-section">
        <div className="business-hours-bg">
          <img src={openingBgMask} alt="" className="business-hours-mask" />
          <div className="business-hours-overlay"></div>
        </div>
        <div className="container">
          <div className="business-hours-content">
            <div className="hours-image-side">
              <div className="hours-image-card">
                <div className="hours-icon-wrapper">
                  <Clock size={48} />
                </div>
                <p>We're here to help</p>
              </div>
            </div>
            <div className="hours-info-side">
              <span className="hours-label">BUSINESS HOURS</span>
              <h2 className="hours-title">OUR WORKING HOURS</h2>
              <div className="hours-divider">
                <span className="diamond"></span>
                <span className="line"></span>
                <span className="circle"></span>
                <span className="line"></span>
                <span className="diamond"></span>
              </div>
              <div className="hours-grid">
                <div className="hours-card">
                  <span className="hours-day">Monday to Friday</span>
                  <span className="hours-time">9:00 AM</span>
                  <span className="hours-time">6:00 PM</span>
                </div>
                <div className="hours-card">
                  <span className="hours-day">Saturday</span>
                  <span className="hours-time">10:00 AM</span>
                  <span className="hours-time">4:00 PM</span>
                </div>
              </div>
              <Link to="/contact" className="hours-cta-btn">
                <Phone size={16} /> Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

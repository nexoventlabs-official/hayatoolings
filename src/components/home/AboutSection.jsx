import React from 'react';
import { Link } from 'react-router-dom';
import aboutImg from '../../assets/about.png';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section className="home-about-section">
      <div className="container">
        <div className="home-about-layout">
          <div className="home-about-image">
            <img src={aboutImg} alt="Industrial Tools" />
          </div>
          <div className="home-about-content">
            <span className="home-about-label">ABOUT OUR COMPANY</span>
            <h2>
              YOUR TRUSTED PARTNER FOR <span className="text-accent">INDUSTRIAL TOOLS</span>
            </h2>
            <p>
              At the core of our business is a commitment to delivering premium quality industrial tools and hardware solutions. From precision cutting tools and carbide inserts to hand tools and measuring instruments, every product we offer is built for performance, durability, and reliability.
            </p>
            <div className="home-about-owner">
              <strong>Mohamed Azarutheen M</strong>
              <span>Founder, HAYA TOOLINGS</span>
            </div>
            <Link to="/about" className="home-about-btn">
              LEARN MORE
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

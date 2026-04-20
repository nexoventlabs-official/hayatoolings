import React from 'react';
import { Link } from 'react-router-dom';
import { Drill, Wrench, Gauge, Cog } from 'lucide-react';

const bannerData = [
  {
    id: 1,
    icon: Drill,
    title: 'Power Drills',
    desc: 'Upto 25% Off',
    bg: '#d32f2f',
  },
  {
    id: 2,
    icon: Wrench,
    title: 'Hand Tools',
    desc: 'Best Deals',
    bg: '#1a1a1a',
  },
  {
    id: 3,
    icon: Gauge,
    title: 'Measuring',
    desc: 'Top Brands',
    bg: '#d32f2f',
  },
  {
    id: 4,
    icon: Cog,
    title: 'Machine Parts',
    desc: 'Flat 15% Off',
    bg: '#1a1a1a',
  },
];

const GridBanners = () => {
  return (
    <section className="dt-sc-section-wrapper home-grid-banner">
      <div className="container">
        <div className="grid-banners-row">
          {bannerData.map((banner) => {
            const IconComp = banner.icon;
            return (
              <Link to="/products" key={banner.id} className="grid-banner-card" style={{ background: banner.bg }}>
                <div className="grid-banner-icon">
                  <IconComp size={36} />
                </div>
                <div className="grid-banner-text">
                  <h4>{banner.title}</h4>
                  <span>{banner.desc}</span>
                </div>
                <span className="grid-banner-arrow">→</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GridBanners;

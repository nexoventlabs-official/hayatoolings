import React, { useState, useEffect } from 'react';
import './Testimonials.css';

const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const testimonials = [
  {
    id: 1,
    name: 'Karthikeyan Ramasamy',
    quote: '"We\'ve been sourcing all our industrial toolings from Haya Toolings for over 3 years. The quality is consistently excellent and their pricing is very competitive in the market."',
    rating: 5,
    date: '2 weeks ago',
    initial: 'K',
    color: '#4285F4'
  },
  {
    id: 2,
    name: 'Balaji Srinivasan',
    quote: '"Exceptional service and top-quality products. Their range of carbide tools and inserts has significantly improved our machining precision. Highly recommended for any workshop."',
    rating: 5,
    date: '1 month ago',
    initial: 'B',
    color: '#EA4335'
  },
  {
    id: 3,
    name: 'Nithya Balasubramanian',
    quote: '"The durability of their end mills is unmatched. We have seen a 30% increase in our tool life since switching to Haya Toolings. Fantastic support team as well."',
    rating: 5,
    date: '3 weeks ago',
    initial: 'N',
    color: '#34A853'
  },
  {
    id: 4,
    name: 'Vigneshwaran',
    quote: '"Prompt delivery and exactly as described. The custom tooling solutions they provided helped us streamline our CNC operations significantly."',
    rating: 4,
    date: '2 months ago',
    initial: 'V',
    color: '#FBBC05'
  },
  {
    id: 5,
    name: 'Sivakumar',
    quote: '"I have tried many suppliers, but Haya Toolings stands out for their consistent quality and technical knowledge. They know exactly what tools fit the job."',
    rating: 5,
    date: '1 week ago',
    initial: 'S',
    color: '#9C27B0'
  },
  {
    id: 6,
    name: 'Divya Natarajan',
    quote: '"Great experience overall. The milling cutters and turning inserts are of premium grade. Only giving 4 stars because one shipment was delayed by a day, but otherwise perfect."',
    rating: 4,
    date: '3 months ago',
    initial: 'D',
    color: '#E91E63'
  },
  {
    id: 7,
    name: 'Senthil Kumar',
    quote: '"Their technical expertise is a game changer. When we had issues with chip control, their recommended inserts solved it immediately. Highly reliable partner."',
    rating: 5,
    date: '4 days ago',
    initial: 'S',
    color: '#3F51B5'
  },
  {
    id: 8,
    name: 'Meenakshi Sundaram',
    quote: '"Very competitive pricing without compromising on quality. The solid carbide drills have been performing flawlessly in our high-speed machining centers."',
    rating: 5,
    date: '5 months ago',
    initial: 'M',
    color: '#00BCD4'
  },
  {
    id: 9,
    name: 'Saravanan',
    quote: '"We bulk order our inserts from Haya Toolings. The inventory is always well-stocked and the sales team is very responsive. Keep up the good work!"',
    rating: 5,
    date: '2 weeks ago',
    initial: 'S',
    color: '#FF9800'
  },
  {
    id: 10,
    name: 'Muthukumar',
    quote: '"High-precision tools that deliver excellent surface finish on our automotive parts. We consider Haya Toolings our primary vendor for all cutting tools."',
    rating: 5,
    date: '1 month ago',
    initial: 'M',
    color: '#8BC34A'
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setIsFading(false);
    }, 400);
  };

  const handleDotClick = (idx) => {
    if (idx === currentIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(idx);
      setIsFading(false);
    }, 400);
  };

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length]
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <h2>OUR CUSTOMERS <span className="text-accent">FEEDBACK</span></h2>
          <div className="testimonials-divider">
            <span className="diamond"></span>
            <span className="line"></span>
            <span className="circle"></span>
            <span className="line"></span>
            <span className="diamond"></span>
          </div>
        </div>

        <div className={`testimonials-grid fade-wrapper ${isFading ? 'fading' : ''}`}>
          {visibleTestimonials.map((t, idx) => (
            <div key={`${t.id}-${idx}`} className={`google-review-card ${idx === 1 ? 'hide-on-mobile' : ''}`}>
              <div className="gr-header">
                <div className="gr-avatar" style={{ backgroundColor: t.color }}>
                  {t.initial}
                </div>
                <div className="gr-user-info">
                  <div className="gr-name">{t.name}</div>
                  <div className="gr-date">{t.date}</div>
                </div>
                <div className="gr-google-icon">
                  <GoogleIcon />
                </div>
              </div>
              <div className="gr-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`star ${i < t.rating ? 'filled' : 'empty'}`}>★</span>
                ))}
              </div>
              <p className="gr-text">{t.quote}</p>
            </div>
          ))}
        </div>
        
        <div className="carousel-indicators">
           {testimonials.map((_, idx) => (
             <span 
               key={idx} 
               className={`indicator ${idx === currentIndex ? 'active' : ''}`}
               onClick={() => handleDotClick(idx)}
             />
           ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

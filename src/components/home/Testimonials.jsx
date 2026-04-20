import React from 'react';
import testi1 from '../../assets/testi-1-1.png';
import testi2 from '../../assets/testi-1-2.png';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    company: 'Precision Tools Pvt. Ltd.',
    image: testi1,
    quote: '"We\'ve been sourcing all our industrial toolings from Haya Toolings for over 3 years. The quality is consistently excellent and their pricing is very competitive in the market."',
    rating: 5,
    align: 'left',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    company: 'Nova Manufacturing Co.',
    image: testi2,
    quote: '"Exceptional service and top-quality products. Their range of carbide tools and inserts has significantly improved our machining precision. Highly recommended for any workshop."',
    rating: 5,
    align: 'right',
  },
];

const Testimonials = () => {
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

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.id} className={`testimonial-card testimonial-${t.align}`}>
              <div className="testimonial-image-wrapper">
                <div className="testimonial-blob"></div>
                <img src={t.image} alt={t.name} className="testimonial-image" />
              </div>
              <div className="testimonial-content">
                <span className="quote-icon">"</span>
                <p className="testimonial-quote">{t.quote}</p>
                <div className="testimonial-author">
                  <strong className="testimonial-name">{t.name}</strong>
                  <span className="testimonial-company">{t.company}</span>
                  <div className="testimonial-stars">
                    {Array.from({ length: t.rating }, (_, i) => (
                      <span key={i} className="star filled">★</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

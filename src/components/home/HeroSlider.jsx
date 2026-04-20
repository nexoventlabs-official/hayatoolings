import React from 'react';
import { Link } from 'react-router-dom';
import ReactSlick from 'react-slick';
const Slider = ReactSlick.default ? ReactSlick.default : ReactSlick;
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './HomeGrid.css';

import heroImg from '../../assets/hero.jpg';

const slides = [
  {
    id: 1,
    image: heroImg,
    mobileImage: heroImg,
    title: 'Industrial Tools',
    desc: 'Premium Quality Hardware & Toolings'
  }
];

const HeroSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 4000,
    customPaging: i => (
      <div className="dt-sc-progress-tab">
        <div className="dt-sc-progress-wrapper">
          <div className="dt-sc-progress-content">
            <h4><p>{slides[i].title}</p></h4>
            <p className="tab_desc">{slides[i].desc}</p>
          </div>
        </div>
        <span className="dt-sc-on-progress"></span>
      </div>
    ),
    appendDots: dots => (
      <div className="slider-nav-container">
        <ul className="slider-tabs-nav"> {dots} </ul>
      </div>
    )
  };

  return (
    <section className="dt-sc-section-wrapper slider-wrapper">
      <div className="container-fluid p-0">
        <Slider {...settings} className="hero-slick-slider">
          {slides.map((slide) => (
            <div key={slide.id} className="slide-item">
              <picture>
                <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
                <img src={slide.image} alt={slide.title} className="slide-image" />
              </picture>
            </div>
          ))}
        </Slider>
      </div>
      <Link to="/products" className="hero-products-btn">
        Explore Products
      </Link>
    </section>
  );
};

export default HeroSlider;

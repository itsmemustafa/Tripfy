import React from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from 'react-type-animation';
import "./landingPage.css";
import "./section1.css";

const Section1 = () => {
  return (
    <section id="home" className="hero-modern">
      <div className="hero-modern__container">
        <div className="hero-modern__content">


          <h1 className="hero-modern__title">
            Explore The Magic<br />Of{' '}
            <TypeAnimation
              sequence={[
                'Iraq',
                2500,
                'Nature',
                2500,
                'Culture',
                2500,
                'History',
                2500,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              style={{ color: 'var(--color-primary)' }}
            />
          </h1>

          <p className="hero-modern__subtitle">
            Dive into the ultimate travel experience within Iraq.
            We specialize in creating vibrant adventures tailored to you!
          </p>

          <div className="hero-modern__cta-row">
            <Link to="/places" className="btn-modern-primary">
              Get Started
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>

          <p className="hero-modern__note">
            Real places &middot; AI planning &middot; Save &amp; share
          </p>
        </div>

        <div className="hero-modern__gallery">
          <Link to="/places?location=Sulaymaniyah" className="hero-modern__gallery-item">
            <img src="/sulaymaniyah.jpg" alt="Sulaymaniyah" loading="lazy" />
            <div className="gallery-item__overlay"><span>Sulaymaniyah</span></div>
          </Link>
          <Link to="/places?location=Erbil" className="hero-modern__gallery-item">
            <img src="/erbil.jpg" alt="Erbil" loading="eager" />
            <div className="gallery-item__overlay"><span>Erbil</span></div>
          </Link>
          <Link to="/places?location=Baghdad" className="hero-modern__gallery-item">
            <img src="/baghdad.jpg" alt="Baghdad" loading="lazy" />
            <div className="gallery-item__overlay"><span>Baghdad</span></div>
          </Link>
          <Link to="/places?location=Basra" className="hero-modern__gallery-item">
            <img src="/basra.jpg" alt="Basra" loading="lazy" />
            <div className="gallery-item__overlay"><span>Basra</span></div>
          </Link>
          <Link to="/places?location=Duhok" className="hero-modern__gallery-item">
            <img src="/duhok.jpg" alt="Duhok" loading="lazy" />
            <div className="gallery-item__overlay"><span>Duhok</span></div>
          </Link>
        </div>
      </div>
    </section >
  );
};

export default Section1;

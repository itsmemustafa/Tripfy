import React from 'react';
import { Link } from 'react-router-dom';
import './landingPage.css';
import './section1.css';


const Section1 = () => {
    return (
        <section id="home" className="hero-modern">
            <div className="container hero-modern__container">
                <div className="hero-modern__bg">
                    {/* Left Content */}
                    <div className="hero-modern__content">

                        {/* Text Content */}
                        <div className="hero-modern__text-group">
                            <span className="hero-modern__overline">ELEVATE YOUR TRAVEL JOURNEY</span>
                            <h1 className="hero-modern__title">
                                Explore<br />
                                The Magic Of<br />
                                Kurdistan
                            </h1>

                            <div className="hero-modern__cta-row">
                                <Link to="/places" className="btn-modern-primary">
                                    Explore Now
                                </Link>

                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="hero-modern__visual">
                        <div className="hero-modern__video-container">
                            <iframe
                                className="hero-modern__video"
                                src="https://www.youtube.com/embed/HLml5SWtsgo?autoplay=1&mute=1&loop=1&playlist=HLml5SWtsgo&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1"
                                title="Kurdistan Nature"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                style={{ pointerEvents: 'none' }}
                            />
                        </div>

                        {/* Floating Card */}
                        <div className="hero-modern__float-card">
                            <div className="float-card__header">


                            </div>
                            <div className="float-card__content">
                                <div className="avatars-group">
                                    <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop" alt="Place 1" />
                                    <img src="https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=100&h=100&fit=crop" alt="Place 2" />
                                    <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100&h=100&fit=crop" alt="Place 3" />
                                </div>
                                <div className="float-card__text">
                                    <strong>Awesome Places</strong>
                                    <p>Discover The World One Adventure At A Time!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Section1;

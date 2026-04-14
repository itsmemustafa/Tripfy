import React from 'react';
import Section1 from '../../components/landingPage/section1';
import Section2 from '../../components/landingPage/section2';
import Section3 from '../../components/landingPage/section3';
import Section4 from '../../components/landingPage/section4';
import Section5 from '../../components/landingPage/section5';
import Section6 from '../../components/landingPage/section6';


const Landing = () => {
    return (
        <div className="landing-page">
            <main>
                <Section1 />
                {/* Visual Divider */}
                <div className="section-divider-container">
                    <div className="section-divider"></div>
                </div>
                <Section2 />
                <Section3 />
                <Section4 />

                {/* Visual Divider */}
                <div className="section-divider-container">
                    <div className="section-divider"></div>
                </div>

                <Section5 />

                {/* Visual Divider */}
                <div className="section-divider-container">
                    <div className="section-divider"></div>
                </div>

                <Section6 />
            </main>
        </div>
    );
};

export default Landing;

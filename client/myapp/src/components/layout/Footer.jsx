import React from "react";
import { Link } from "react-router-dom";
import "../../components/landingPage/landingPage.css";


const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { label: "Baghdad", href: "#destinations" },
      { label: "Erbil", href: "#destinations" },
      { label: "Basra", href: "#destinations" },
      { label: "Mosul", href: "#destinations" },
      { label: "Sulaymaniyah", href: "#destinations" },
      { label: "Duhok", href: "#destinations" },
      { label: "All Destinations", href: "#destinations" },
    ],
    company: [],
    support: [
      { label: "Help Center", href: "#contact" },
      { label: "Contact Us", href: "#contact" },
    ],
  };

  return (
    <footer id="contact" className="footer">
      <div className="container">
        {/* Footer Top */}
        <div className="footer__top">
          {/* Brand Column */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span>Tripfy</span>
            </Link>
            <p className="footer__tagline">
              Your gateway to discovering the breathtaking beauty of Iraq.
              Plan unforgettable adventures with us.
            </p>
          </div>

          {/* Links Columns */}
          <div className="footer__links-grid">
            <div className="footer__links-column">
              <h4 className="footer__links-title">Explore</h4>
              <ul className="footer__links-list">
                {footerLinks.explore.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer__link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__links-column">
              <h4 className="footer__links-title"></h4>
              <ul className="footer__links-list">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer__link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__links-column">
              <h4 className="footer__links-title">Support</h4>
              <ul className="footer__links-list">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer__link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} Tripfy. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

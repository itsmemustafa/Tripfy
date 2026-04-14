import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../components/landingPage/landingPage.css";


const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Destinations", to: "/places" },
    { label: "PLANNER", to: "/my-plans" },
    { label: "MAP", to: "/map" },
    { label: "AI ASSISTANT", to: "/ai-planner" },
  ];

  if (user?.role === "admin") {
    navLinks.push({ label: "ADMIN", to: "/admin" });
  }

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className={`header-modern ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="container header__container">
        {/* Logo */}
        <Link to="/" className="header__logo" onClick={handleNavClick}>
          <span className="header__logo-text">Tripfy</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header__nav">
          <ul className="header__nav-list">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.to.startsWith("#") ? (
                  <a href={link.to} className="header__nav-link">
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.to}
                    className={`header__nav-link ${link.label === 'AI ASSISTANT' ? 'header__nav-link--ai' : ''}`}
                    onClick={handleNavClick}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Action - Book Trip */}
        <div className="header__actions">
          {isAuthenticated ? (
            <div className="header__user-menu">
              <span className="header__user-name"> {user?.name}</span>
              <button className="btn-book-trip" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <button
              className="btn-book-trip"
              onClick={() => openAuthModal("login")}
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`header__mobile-toggle ${isMobileMenuOpen ? "is-active" : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`header__mobile-menu ${isMobileMenuOpen ? "is-open" : ""}`}
      >
        <nav className="header__mobile-nav">
          <ul className="header__mobile-list">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.to.startsWith("#") ? (
                  <a
                    href={link.to}
                    className="header__mobile-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.to}
                    className="header__mobile-link"
                    onClick={() => {
                      handleNavClick();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="header__mobile-actions">
            {isAuthenticated ? (
              <button
                className="btn-book-trip"
                onClick={logout}
                style={{ width: "100%" }}
              >
                Logout
              </button>
            ) : (
              <button
                className="btn-book-trip"
                onClick={() => {
                  openAuthModal("login");
                  setIsMobileMenuOpen(false);
                }}
                style={{ width: "100%" }}
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

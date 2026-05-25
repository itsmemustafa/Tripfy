import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../landingPage/section1.css";

const Header = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled]             = useState(false);
  const [isMobile, setIsMobile]                 = useState(() => window.innerWidth <= 768);

  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  /* ── Scroll listener ── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Resize listener — keeps isMobile in sync on reload & orientation change ── */
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── Close menu on route change ── */
  useEffect(() => {
    setIsMobileMenuOpen(false);
    // Reset scroll detection on route change
    setIsScrolled(window.scrollY > 50);
  }, [location.pathname]);

  /* ── Lock body scroll when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: "Home",         to: "/" },
    { label: "Destinations", to: "/places" },
    { label: "Planner",      to: "/my-plans" },
    { label: "Map",          to: "/map" },
    { label: "AI Assistant", to: "/ai-planner" },
  ];
  if (user?.role === "admin") {
    navLinks.push({ label: "Admin", to: "/admin" });
  }

  /* Mobile uses BottomNav — no top header needed */
  if (isMobile) return null;

  const headerClass = `header-modern${isScrolled ? " is-scrolled" : ""}`;

  return (
    <header className={headerClass}>
      <div className="container header__container">
        {/* Logo */}
        <Link to="/" className="header__logo">
          Tripfy
        </Link>

        {/* Desktop nav */}
        <nav className="header__nav" aria-label="Main navigation">
          <ul className="header__nav-list">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className={`header__nav-link${link.label === "AI Assistant" ? " header__nav-link--ai" : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Auth actions */}
        <div className="header__actions">
          {isAuthenticated ? (
            <div className="header__user-menu">
              <span className="header__user-name">{user?.name}</span>
              <button className="btn-book-trip" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="btn-book-trip" onClick={() => openAuthModal("login")}>
              Login
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className={`header__mobile-toggle${isMobileMenuOpen ? " is-active" : ""}`}
          onClick={() => setIsMobileMenuOpen(v => !v)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile fullscreen menu */}
      <div className={`header__mobile-menu${isMobileMenuOpen ? " is-open" : ""}`}>
        <nav className="header__mobile-nav">
          <ul className="header__mobile-list">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="header__mobile-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="header__mobile-actions">
            {isAuthenticated ? (
              <button className="btn-book-trip" onClick={logout} style={{ width: "100%" }}>
                Logout
              </button>
            ) : (
              <button
                className="btn-book-trip"
                style={{ width: "100%" }}
                onClick={() => { openAuthModal("login"); setIsMobileMenuOpen(false); }}
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

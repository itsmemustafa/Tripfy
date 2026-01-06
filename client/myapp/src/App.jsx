import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthModal from './components/Auth/AuthModal';
import './App.css';

const Home = () => {
  const { user, openAuthModal, logout } = useAuth();

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="logo">Tripfy</div>
        <div className="nav-actions">
          {user ? (
            <div className="user-menu">
              <span className="user-name">Hello, {user.name}</span>
              <button className="btn btn-secondary" onClick={logout}>Logout</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => openAuthModal('login')}>Sign In</button>
          )}
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <h1>Discover Your Next Adventure</h1>
          <p>Explore the best places, hotels, and experiences around the world. Join our community today.</p>
          {!user && (
            <button className="btn btn-large" onClick={() => openAuthModal('signup')}>
              Get Started Free
            </button>
          )}
          {user && (
            <div className="welcome-banner">
              <h3>Ready to explore, {user.name}?</h3>
            </div>
          )}
        </div>
      </header>

      <AuthModal />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  )
}

export default App;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Moments</Link>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Ana Sayfa
            </Link>
            <Link
              to="/diary"
              className={`nav-link ${isActive('/diary') ? 'active' : ''}`}
            >
              Günlük
            </Link>
            <Link
              to="/notes"
              className={`nav-link ${isActive('/notes') ? 'active' : ''}`}
            >
              Notlar
            </Link>
            <Link
              to="/photos"
              className={`nav-link ${isActive('/photos') ? 'active' : ''}`}
            >
              Fotoğraflar
            </Link>
            <button onClick={logout} className="nav-link logout-btn">
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
            >
              Giriş Yap
            </Link>
            <Link
              to="/register"
              className={`nav-link ${isActive('/register') ? 'active' : ''}`}
            >
              Kayıt Ol
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 
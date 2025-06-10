import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Diary from './pages/Diary';
import Notes from './pages/Notes';
import Photos from './pages/Photos';
import Settings from './pages/Settings';
import './App.css';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className={`nav-item ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <nav className="nav-menu">
            <NavLink to="/">Ana Sayfa</NavLink>
            <NavLink to="/diary">Günlük</NavLink>
            <NavLink to="/notes">Notlar</NavLink>
            <NavLink to="/photos">Fotoğraflar</NavLink>
            <NavLink to="/settings">Ayarlar</NavLink>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/diary" element={<Diary />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/photos" element={<Photos />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>

          <footer className="footer">
            <p>&copy; 2024 Anılarımız. Tüm hakları saklıdır.</p>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

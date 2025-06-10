import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Diary from './pages/Diary';
import Notes from './pages/Notes';
import Photos from './pages/Photos';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <Link to="/" className="nav-logo">
            Anılarımız
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Ana Sayfa</Link>
            <Link to="/diary" className="nav-link">Günlük</Link>
            <Link to="/notes" className="nav-link">Notlar</Link>
            <Link to="/photos" className="nav-link">Fotoğraflar</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/diary" element={<Diary />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/photos" element={<Photos />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2024 Anılarımız. Tüm hakları saklıdır.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

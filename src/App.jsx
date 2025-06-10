import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Diary from './pages/Diary';
import Notes from './pages/Notes';
import Photos from './pages/Photos';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
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

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <nav className="nav-menu">
        <NavLink to="/">Ana Sayfa</NavLink>
        {user ? (
          <>
            <NavLink to="/diary">Günlük</NavLink>
            <NavLink to="/notes">Notlar</NavLink>
            <NavLink to="/photos">Fotoğraflar</NavLink>
            <NavLink to="/settings">Ayarlar</NavLink>
            <button onClick={logout} className="nav-item logout-btn">
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Giriş Yap</NavLink>
            <NavLink to="/register">Kayıt Ol</NavLink>
          </>
        )}
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/diary"
            element={
              <PrivateRoute>
                <Diary />
              </PrivateRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <PrivateRoute>
                <Notes />
              </PrivateRoute>
            }
          />
          <Route
            path="/photos"
            element={
              <PrivateRoute>
                <Photos />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

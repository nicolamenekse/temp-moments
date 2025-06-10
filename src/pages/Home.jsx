import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Anılarımız</h1>
        <p>Değerli anılarınızı biriktirin, saklayın ve paylaşın</p>
      </header>
      
      <div className="features-grid">
        <Link to="/diary" className="feature-card">
          <div className="feature-icon">📝</div>
          <h2>Günlük</h2>
          <p>Günlük düşüncelerinizi ve duygularınızı kaydedin</p>
        </Link>

        <Link to="/notes" className="feature-card">
          <div className="feature-icon">📔</div>
          <h2>Not Defteri</h2>
          <p>Önemli notlarınızı ve hatırlatmalarınızı yazın</p>
        </Link>

        <Link to="/photos" className="feature-card">
          <div className="feature-icon">📸</div>
          <h2>Fotoğraflar</h2>
          <p>Anılarınızı fotoğraflarla ölümsüzleştirin</p>
        </Link>

        <Link to="/memories" className="feature-card">
          <div className="feature-icon">💭</div>
          <h2>Anılar</h2>
          <p>Tüm anılarınızı tek bir yerde toplayın</p>
        </Link>
      </div>
    </div>
  );
};

export default Home; 
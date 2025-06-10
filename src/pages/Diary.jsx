import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Diary.css';

const Diary = () => {
  const { user, saveUserData, getUserData } = useAuth();
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('normal');
  const [error, setError] = useState('');

  useEffect(() => {
    const userEntries = getUserData('diary');
    setEntries(userEntries);
  }, [user, getUserData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Başlık ve içerik alanları zorunludur');
      return;
    }

    const newEntry = {
      id: Date.now(),
      title,
      content,
      mood,
      date: new Date().toISOString()
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    saveUserData('diary', updatedEntries);
    
    setTitle('');
    setContent('');
    setMood('normal');
    setError('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu günlük girişini silmek istediğinizden emin misiniz?')) {
      const updatedEntries = entries.filter(entry => entry.id !== id);
      setEntries(updatedEntries);
      saveUserData('diary', updatedEntries);
    }
  };

  return (
    <div className="diary-container">
      <h1>Günlüğüm</h1>
      
      <form onSubmit={handleSubmit} className="diary-form">
        {error && <div className="error">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="title">Başlık</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Günlük başlığı"
          />
        </div>

        <div className="form-group">
          <label htmlFor="mood">Ruh Hali</label>
          <select
            id="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option value="happy">Mutlu</option>
            <option value="normal">Normal</option>
            <option value="sad">Üzgün</option>
            <option value="excited">Heyecanlı</option>
            <option value="angry">Kızgın</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">İçerik</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Bugün neler yaşadın?"
            rows="6"
          />
        </div>

        <button type="submit">Kaydet</button>
      </form>

      <div className="entries-container">
        {entries.map(entry => (
          <div key={entry.id} className="diary-entry">
            <div className="entry-header">
              <h3>{entry.title}</h3>
              <div className="entry-meta">
                <span className={`mood ${entry.mood}`}>
                  {entry.mood === 'happy' && '😊'}
                  {entry.mood === 'normal' && '😐'}
                  {entry.mood === 'sad' && '😢'}
                  {entry.mood === 'excited' && '🤩'}
                  {entry.mood === 'angry' && '😠'}
                </span>
                <span className="date">
                  {new Date(entry.date).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="delete-btn"
                >
                  Sil
                </button>
              </div>
            </div>
            <p className="entry-content">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Diary; 
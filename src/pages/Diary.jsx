import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Diary.css';

const Diary = () => {
  const { user, saveUserData, getUserData } = useAuth();
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('happy');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEntries = async () => {
      if (user) {
        const userData = await getUserData(user.uid);
        if (userData && userData.diaryEntries) {
          setEntries(userData.diaryEntries);
        }
      }
    };
    loadEntries();
  }, [user, getUserData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Başlık ve içerik alanları zorunludur.');
      return;
    }

    try {
      const newEntry = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        mood,
        date: new Date().toISOString(),
      };

      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      await saveUserData(user.uid, { diaryEntries: updatedEntries });

      setTitle('');
      setContent('');
      setMood('happy');
    } catch (err) {
      setError('Günlük kaydedilirken bir hata oluştu.');
      console.error('Günlük kaydetme hatası:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu günlük girişini silmek istediğinizden emin misiniz?')) {
      try {
        const updatedEntries = entries.filter(entry => entry.id !== id);
        setEntries(updatedEntries);
        await saveUserData(user.uid, { diaryEntries: updatedEntries });
      } catch (err) {
        setError('Günlük silinirken bir hata oluştu.');
        console.error('Günlük silme hatası:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="diary-container">
      <h1>Günlüğüm</h1>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="diary-form">
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Günlük başlığı"
            className="diary-input"
          />
        </div>

        <div className="form-group">
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="diary-select"
          >
            <option value="happy">Mutlu</option>
            <option value="sad">Üzgün</option>
            <option value="angry">Kızgın</option>
            <option value="excited">Heyecanlı</option>
            <option value="calm">Sakin</option>
          </select>
        </div>

        <div className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Bugün neler yaşadın?"
            className="diary-textarea"
            rows="6"
          />
        </div>

        <button type="submit" className="diary-submit">
          Kaydet
        </button>
      </form>

      <div className="diary-entries">
        {entries && entries.length > 0 ? (
          entries.map(entry => (
            <div key={entry.id} className="diary-entry">
              <div className="entry-header">
                <h3>{entry.title}</h3>
                <span className={`mood-indicator ${entry.mood}`}>
                  {entry.mood}
                </span>
              </div>
              <p className="entry-content">{entry.content}</p>
              <div className="entry-footer">
                <span className="entry-date">
                  {formatDate(entry.date)}
                </span>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="delete-btn"
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-entries">Henüz günlük girişi yok.</p>
        )}
      </div>
    </div>
  );
};

export default Diary; 
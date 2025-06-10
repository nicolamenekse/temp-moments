import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Notes.css';

const Notes = () => {
  const { user, saveUserData, getUserData } = useAuth();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const userNotes = getUserData('notes');
    setNotes(userNotes);
  }, [user, getUserData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Başlık ve içerik alanları zorunludur');
      return;
    }

    const newNote = {
      id: Date.now(),
      title,
      content,
      date: new Date().toISOString()
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveUserData('notes', updatedNotes);
    
    setTitle('');
    setContent('');
    setError('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu notu silmek istediğinizden emin misiniz?')) {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      saveUserData('notes', updatedNotes);
    }
  };

  return (
    <div className="notes-container">
      <h1>Notlarım</h1>
      
      <form onSubmit={handleSubmit} className="notes-form">
        {error && <div className="error">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="title">Başlık</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Not başlığı"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">İçerik</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Notunuzu buraya yazın..."
            rows="6"
          />
        </div>

        <button type="submit">Kaydet</button>
      </form>

      <div className="notes-grid">
        {notes.map(note => (
          <div key={note.id} className="note-card">
            <div className="note-header">
              <h3>{note.title}</h3>
              <div className="note-actions">
                <span className="note-date">
                  {new Date(note.date).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="delete-btn"
                >
                  Sil
                </button>
              </div>
            </div>
            <p className="note-content">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes; 
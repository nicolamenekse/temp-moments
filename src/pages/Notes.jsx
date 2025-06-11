import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Notes.css';

const categoryLabels = {
  personal: 'Kişisel',
  work: 'İş',
  ideas: 'Fikirler',
  tasks: 'Görevler'
};

const Notes = () => {
  const { user, saveUserData, getUserData } = useAuth();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('personal');
  const [error, setError] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    const loadNotes = async () => {
      if (user) {
        const userData = await getUserData(user.uid);
        if (userData && userData.notes) {
          setNotes(userData.notes);
        }
      }
    };
    loadNotes();
  }, [user, getUserData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Başlık ve içerik alanları zorunludur.');
      return;
    }

    try {
      const newNote = {
        id: editingNoteId || Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedNotes = editingNoteId
        ? notes.map((note) => (note.id === editingNoteId ? newNote : note))
        : [...notes, newNote];

      setNotes(updatedNotes);
      await saveUserData(user.uid, { notes: updatedNotes });

      setTitle('');
      setContent('');
      setCategory('personal');
      setEditingNoteId(null);
    } catch (err) {
      setError('Not kaydedilirken bir hata oluştu.');
      console.error('Not kaydetme hatası:', err);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setEditingNoteId(note.id);
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Bu notu silmek istediğinizden emin misiniz?')) {
      try {
        const updatedNotes = notes.filter((note) => note.id !== noteId);
        setNotes(updatedNotes);
        await saveUserData(user.uid, { notes: updatedNotes });
      } catch (err) {
        setError('Not silinirken bir hata oluştu.');
        console.error('Not silme hatası:', err);
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
    <div className="notes-container">
      <h1>Notlarım</h1>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="note-form">
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Not başlığı"
            className="note-input"
          />
        </div>

        <div className="form-group">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="note-select"
          >
            <option value="personal">Kişisel</option>
            <option value="work">İş</option>
            <option value="ideas">Fikirler</option>
            <option value="tasks">Görevler</option>
          </select>
        </div>

        <div className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Notunuzu buraya yazın..."
            className="note-textarea"
            rows="6"
          />
        </div>

        <button type="submit" className="note-submit">
          {editingNoteId ? 'Notu Güncelle' : 'Not Ekle'}
        </button>
      </form>

      <div className="notes-grid">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <h3>{note.title}</h3>
                <span className={`note-category ${note.category}`}>
                  {categoryLabels[note.category]}
                </span>
              </div>
              <p className="note-content">{note.content}</p>
              <div className="note-footer">
                <span className="note-date">
                  {formatDate(note.updatedAt)}
                </span>
                <div className="note-actions">
                  <button
                    onClick={() => handleEdit(note)}
                    className="note-edit"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="note-delete"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-notes">Henüz not eklenmemiş.</p>
        )}
      </div>
    </div>
  );
};

export default Notes; 
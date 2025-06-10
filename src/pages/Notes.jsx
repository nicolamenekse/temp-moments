import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import '../styles/Notes.css';

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .required('Başlık gereklidir')
    .min(3, 'Başlık en az 3 karakter olmalıdır'),
  content: Yup.string()
    .required('İçerik gereklidir')
    .min(5, 'İçerik en az 5 karakter olmalıdır'),
  category: Yup.string()
    .required('Kategori seçilmelidir'),
});

const Notes = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = (values, { resetForm }) => {
    if (editingNote) {
      // Düzenleme modu
      setNotes(notes.map(note => 
        note.id === editingNote.id 
          ? { ...note, ...values, updatedAt: new Date().toLocaleDateString('tr-TR') }
          : note
      ));
      setEditingNote(null);
    } else {
      // Yeni not ekleme
      const newNote = {
        id: Date.now(),
        createdAt: new Date().toLocaleDateString('tr-TR'),
        updatedAt: new Date().toLocaleDateString('tr-TR'),
        ...values,
      };
      setNotes([newNote, ...notes]);
    }
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu notu silmek istediğinizden emin misiniz?')) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'kişisel', 'iş', 'alışveriş', 'sağlık', 'diğer'];

  return (
    <div className="notes-container">
      <h1>Notlarım</h1>

      <div className="notes-controls">
        <input
          type="text"
          placeholder="Notlarda ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'Tüm Kategoriler' : category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="note-form-container">
        <h2>{editingNote ? 'Notu Düzenle' : 'Yeni Not'}</h2>
        <Formik
          initialValues={editingNote || { title: '', content: '', category: '' }}
          validationSchema={NoteSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <Form className="note-form">
              <div className="form-group">
                <Field
                  name="title"
                  type="text"
                  placeholder="Başlık"
                  className="form-input"
                />
                {errors.title && touched.title && (
                  <div className="error">{errors.title}</div>
                )}
              </div>

              <div className="form-group">
                <Field
                  name="content"
                  as="textarea"
                  placeholder="Notunuzu yazın..."
                  className="form-textarea"
                />
                {errors.content && touched.content && (
                  <div className="error">{errors.content}</div>
                )}
              </div>

              <div className="form-group">
                <Field name="category" as="select" className="form-select">
                  <option value="">Kategori seçin</option>
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </Field>
                {errors.category && touched.category && (
                  <div className="error">{errors.category}</div>
                )}
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-button">
                  {editingNote ? 'Güncelle' : 'Kaydet'}
                </button>
                {editingNote && (
                  <button
                    type="button"
                    onClick={() => setEditingNote(null)}
                    className="cancel-button"
                  >
                    İptal
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <div className="notes-list">
        <h2>Notlarım</h2>
        {filteredNotes.length === 0 ? (
          <p className="no-notes">Henüz not bulunmuyor.</p>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <h3>{note.title}</h3>
                <div className="note-actions">
                  <span className="note-category">{note.category}</span>
                  <span className="note-date">
                    {note.updatedAt !== note.createdAt ? 'Güncellendi: ' : 'Oluşturuldu: '}
                    {note.updatedAt}
                  </span>
                  <button
                    onClick={() => handleEdit(note)}
                    className="edit-button"
                    title="Düzenle"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="delete-button"
                    title="Sil"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <p className="note-content">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notes; 
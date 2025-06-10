import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import '../styles/Diary.css';

const DiarySchema = Yup.object().shape({
  title: Yup.string()
    .required('Başlık gereklidir')
    .min(3, 'Başlık en az 3 karakter olmalıdır'),
  content: Yup.string()
    .required('İçerik gereklidir')
    .min(10, 'İçerik en az 10 karakter olmalıdır'),
  mood: Yup.string()
    .required('Duygu durumu seçilmelidir'),
});

const Diary = () => {
  const [entries, setEntries] = useState(() => {
    // localStorage'dan kayıtları yükle
    const savedEntries = localStorage.getItem('diaryEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  // entries değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (values, { resetForm }) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('tr-TR'),
      ...values,
    };
    setEntries([newEntry, ...entries]);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu günlük kaydını silmek istediğinizden emin misiniz?')) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  return (
    <div className="diary-container">
      <h1>Günlüğüm</h1>
      
      <div className="diary-form-container">
        <Formik
          initialValues={{ title: '', content: '', mood: '' }}
          validationSchema={DiarySchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="diary-form">
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
                  placeholder="Bugün neler yaşadın?"
                  className="form-textarea"
                />
                {errors.content && touched.content && (
                  <div className="error">{errors.content}</div>
                )}
              </div>

              <div className="form-group">
                <Field name="mood" as="select" className="form-select">
                  <option value="">Duygu durumunuzu seçin</option>
                  <option value="happy">😊 Mutlu</option>
                  <option value="sad">😢 Üzgün</option>
                  <option value="excited">🤩 Heyecanlı</option>
                  <option value="calm">😌 Sakin</option>
                  <option value="angry">😠 Kızgın</option>
                </Field>
                {errors.mood && touched.mood && (
                  <div className="error">{errors.mood}</div>
                )}
              </div>

              <button type="submit" className="submit-button">
                Kaydet
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <div className="entries-container">
        <h2>Günlük Kayıtlarım</h2>
        {entries.length === 0 ? (
          <p className="no-entries">Henüz günlük kaydı bulunmuyor.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="entry-card">
              <div className="entry-header">
                <h3>{entry.title}</h3>
                <div className="entry-actions">
                  <span className="entry-date">{entry.date}</span>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="delete-button"
                    title="Kaydı Sil"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <p className="entry-content">{entry.content}</p>
              <div className="entry-mood">
                Duygu Durumu: {
                  {
                    happy: '😊 Mutlu',
                    sad: '😢 Üzgün',
                    excited: '🤩 Heyecanlı',
                    calm: '😌 Sakin',
                    angry: '😠 Kızgın',
                  }[entry.mood]
                }
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Diary; 
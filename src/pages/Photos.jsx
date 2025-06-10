import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Photos.css';

const Photos = () => {
  const { user, saveUserData, getUserData } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    const loadPhotos = async () => {
      if (user) {
        const userData = await getUserData(user.uid);
        if (userData && userData.photos) {
          setPhotos(userData.photos);
        }
      }
    };
    loadPhotos();
  }, [user, getUserData]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Lütfen geçerli bir resim dosyası seçin.');
      return;
    }

    try {
      setUploadStatus('Yükleniyor...');
      setUploadProgress(0);

      // Simüle edilmiş yükleme işlemi
      const reader = new FileReader();
      reader.onload = async (event) => {
        const newPhoto = {
          id: Date.now().toString(),
          url: event.target.result,
          title: file.name,
          description: '',
          date: new Date().toISOString(),
        };

        const updatedPhotos = [newPhoto, ...photos];
        setPhotos(updatedPhotos);
        await saveUserData(user.uid, { photos: updatedPhotos });

        setUploadStatus('Yükleme tamamlandı!');
        setUploadProgress(100);
        setTimeout(() => {
          setUploadStatus('');
          setUploadProgress(0);
        }, 2000);
      };

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError('Fotoğraf yüklenirken bir hata oluştu.');
      console.error('Fotoğraf yükleme hatası:', err);
      setUploadStatus('');
      setUploadProgress(0);
    }
  };

  const handleDelete = async (photoId) => {
    if (window.confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) {
      try {
        const updatedPhotos = photos.filter(photo => photo.id !== photoId);
        setPhotos(updatedPhotos);
        await saveUserData(user.uid, { photos: updatedPhotos });
        if (selectedPhoto && selectedPhoto.id === photoId) {
          setSelectedPhoto(null);
        }
      } catch (err) {
        setError('Fotoğraf silinirken bir hata oluştu.');
        console.error('Fotoğraf silme hatası:', err);
      }
    }
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setEditForm({
      title: photo.title,
      description: photo.description
    });
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedPhotos = photos.map((photo) =>
        photo.id === selectedPhoto.id
          ? {
              ...photo,
              title: editForm.title,
              description: editForm.description
            }
          : photo
      );

      setPhotos(updatedPhotos);
      setSelectedPhoto((prev) => ({
        ...prev,
        title: editForm.title,
        description: editForm.description
      }));
      await saveUserData(user.uid, { photos: updatedPhotos });
      setIsEditing(false);
    } catch (err) {
      setError('Düzenleme kaydedilirken bir hata oluştu.');
      console.error('Düzenleme kaydetme hatası:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      title: selectedPhoto.title,
      description: selectedPhoto.description
    });
    setIsEditing(false);
  };

  const handleDescriptionChange = async (e) => {
    if (!selectedPhoto) return;

    try {
      const updatedPhoto = {
        ...selectedPhoto,
        description: e.target.value,
      };

      const updatedPhotos = photos.map(photo =>
        photo.id === selectedPhoto.id ? updatedPhoto : photo
      );

      setPhotos(updatedPhotos);
      setSelectedPhoto(updatedPhoto);
      await saveUserData(user.uid, { photos: updatedPhotos });
    } catch (err) {
      setError('Açıklama güncellenirken bir hata oluştu.');
      console.error('Açıklama güncelleme hatası:', err);
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
    <div className="photos-container">
      <h1>Fotoğraflarım</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="file-input"
          id="photo-upload"
        />
        <label htmlFor="photo-upload" className="upload-button">
          Fotoğraf Yükle
        </label>
        {uploadStatus && (
          <div className="upload-status">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span>{uploadStatus}</span>
          </div>
        )}
      </div>

      <div className="photos-grid">
        {photos && photos.length > 0 ? (
          photos.map(photo => (
            <div key={photo.id} className="photo-card">
              <img
                src={photo.url}
                alt={photo.title}
                onClick={() => handlePhotoClick(photo)}
                className="photo-thumbnail"
              />
              <div className="photo-info">
                <h3>{photo.title}</h3>
                <span className="photo-date">{formatDate(photo.date)}</span>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="delete-btn"
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-photos">Henüz fotoğraf yüklenmemiş.</p>
        )}
      </div>

      {selectedPhoto && (
        <div className="photo-modal">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>
              ×
            </button>
            <img src={selectedPhoto.url} alt={selectedPhoto.title} />
            <div className="modal-info">
              {isEditing ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="edit-input"
                    placeholder="Başlık"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Açıklama"
                    className="edit-textarea"
                  />
                  <div className="edit-buttons">
                    <button onClick={handleSaveEdit} className="save-btn">Kaydet</button>
                    <button onClick={handleCancelEdit} className="cancel-btn">İptal</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2>{selectedPhoto.title}</h2>
                  <span className="modal-date">
                    {formatDate(selectedPhoto.date)}
                  </span>
                  <textarea
                    value={selectedPhoto.description}
                    onChange={handleDescriptionChange}
                    placeholder="Fotoğraf açıklaması ekle..."
                    className="photo-description"
                  />
                  <button onClick={handleEdit} className="edit-btn">
                    Düzenle
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos; 
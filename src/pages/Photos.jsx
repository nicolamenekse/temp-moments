import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Photos.css';

const Photos = () => {
  const { user, saveUserData, getUserData } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const userPhotos = getUserData('photos');
    setPhotos(userPhotos);
  }, [user, getUserData]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setUploadStatus('Yükleniyor...');
        setUploadProgress(0);

        const reader = new FileReader();
        reader.onload = (event) => {
          const newPhoto = {
            id: Date.now(),
            url: event.target.result,
            title: file.name,
            date: new Date().toISOString(),
            description: ''
          };

          const updatedPhotos = [newPhoto, ...photos];
          setPhotos(updatedPhotos);
          saveUserData('photos', updatedPhotos);
          
          setUploadStatus('Yüklendi!');
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
      } else {
        setUploadStatus('Lütfen geçerli bir resim dosyası seçin');
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) {
      const updatedPhotos = photos.filter(photo => photo.id !== id);
      setPhotos(updatedPhotos);
      saveUserData('photos', updatedPhotos);
    }
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  const handleDescriptionChange = (id, newDescription) => {
    const updatedPhotos = photos.map(photo =>
      photo.id === id ? { ...photo, description: newDescription } : photo
    );
    setPhotos(updatedPhotos);
    saveUserData('photos', updatedPhotos);
  };

  return (
    <div className="photos-container">
      <h1>Fotoğraflarım</h1>

      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          id="photo-upload"
          className="file-input"
        />
        <label htmlFor="photo-upload" className="upload-button">
          Fotoğraf Yükle
        </label>
        {uploadStatus && (
          <div className="upload-status">
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span>{uploadStatus}</span>
          </div>
        )}
      </div>

      <div className="gallery">
        {photos.map(photo => (
          <div key={photo.id} className="photo-card">
            <img
              src={photo.url}
              alt={photo.title}
              onClick={() => handlePhotoClick(photo)}
            />
            <div className="photo-info">
              <h3>{photo.title}</h3>
              <p className="photo-date">
                {new Date(photo.date).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <button
                onClick={() => handleDelete(photo.id)}
                className="delete-btn"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseModal}>
              ×
            </button>
            <img src={selectedPhoto.url} alt={selectedPhoto.title} />
            <div className="modal-info">
              <h2>{selectedPhoto.title}</h2>
              <p className="modal-date">
                {new Date(selectedPhoto.date).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <textarea
                value={selectedPhoto.description}
                onChange={(e) => handleDescriptionChange(selectedPhoto.id, e.target.value)}
                placeholder="Fotoğraf açıklaması ekle..."
                rows="3"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos; 
import React, { useState, useEffect } from 'react';
import '../styles/Photos.css';

const Photos = () => {
  const [photos, setPhotos] = useState(() => {
    const savedPhotos = localStorage.getItem('photos');
    return savedPhotos ? JSON.parse(savedPhotos) : [];
  });

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    localStorage.setItem('photos', JSON.stringify(photos));
  }, [photos]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setIsUploading(true);
    setUploadProgress(0);

    files.forEach((file, index) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const newPhoto = {
          id: Date.now() + index,
          url: e.target.result,
          title: file.name,
          date: new Date().toLocaleDateString('tr-TR'),
          description: '',
        };

        setPhotos(prevPhotos => [newPhoto, ...prevPhotos]);
        
        // Yükleme simülasyonu
        const progress = ((index + 1) / files.length) * 100;
        setUploadProgress(progress);
        
        if (index === files.length - 1) {
          setIsUploading(false);
          setUploadProgress(0);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) {
      setPhotos(photos.filter(photo => photo.id !== id));
      if (selectedPhoto?.id === id) {
        setSelectedPhoto(null);
      }
    }
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  const handleDescriptionChange = (id, description) => {
    setPhotos(photos.map(photo => 
      photo.id === id ? { ...photo, description } : photo
    ));
  };

  return (
    <div className="photos-container">
      <h1>Fotoğraflarım</h1>

      <div className="upload-section">
        <label htmlFor="photo-upload" className="upload-button">
          Fotoğraf Yükle
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </label>
        {isUploading && (
          <div className="upload-progress">
            <div 
              className="progress-bar"
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <span>Yükleniyor... {Math.round(uploadProgress)}%</span>
          </div>
        )}
      </div>

      <div className="gallery">
        {photos.length === 0 ? (
          <p className="no-photos">Henüz fotoğraf yüklenmemiş.</p>
        ) : (
          photos.map((photo) => (
            <div key={photo.id} className="photo-card">
              <div className="photo-image" onClick={() => handlePhotoClick(photo)}>
                <img src={photo.url} alt={photo.title} />
              </div>
              <div className="photo-info">
                <h3>{photo.title}</h3>
                <p className="photo-date">{photo.date}</p>
                <textarea
                  className="photo-description"
                  placeholder="Fotoğraf açıklaması ekle..."
                  value={photo.description}
                  onChange={(e) => handleDescriptionChange(photo.id, e.target.value)}
                />
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="delete-button"
                  title="Fotoğrafı Sil"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPhoto && (
        <div className="photo-modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseModal}>×</button>
            <img src={selectedPhoto.url} alt={selectedPhoto.title} />
            <div className="modal-info">
              <h2>{selectedPhoto.title}</h2>
              <p className="modal-date">{selectedPhoto.date}</p>
              {selectedPhoto.description && (
                <p className="modal-description">{selectedPhoto.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos; 
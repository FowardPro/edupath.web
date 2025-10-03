// src/components/Gallery/PhotoGallery.jsx
import React, { useEffect, useState } from "react";
import "./PhotoGallery.css";

export default function PhotoGallery() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    // 🔹 Fetch gallery data from backend later
    // fetch("/api/gallery/")
    //   .then((res) => res.json())
    //   .then((data) => setPhotos(data));
    setPhotos([]); // placeholder empty until backend connected
  }, []);

  return (
    <div className="gallery-container">
      <h1 className="gallery-title">Photo Gallery</h1>
      <div className="gallery-grid">
        {photos.length === 0 ? (
          <p className="gallery-empty">No photos uploaded yet.</p>
        ) : (
          photos.map((photo) => (
            <div key={photo.id} className="gallery-card">
              <div className="gallery-image-wrapper">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="gallery-image"
                />
              </div>
              <h3 className="gallery-heading">{photo.title}</h3>
              <p className="gallery-text">{photo.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

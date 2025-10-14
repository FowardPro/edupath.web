import React from 'react';
import styles from './GalleryPage.module.css';

const GalleryPage = () => {
  const galleryItems = [
    {
      title: 'AI Tools Workshop',
      description: 'Students learning about our AI-powered study tools',
      image: '🛠️'
    },
    {
      title: 'Career Day Event',
      description: 'Industry professionals sharing insights with students',
      image: '💼'
    },
    {
      title: 'Study Group Session',
      description: 'Collaborative learning with EduPath quiz generator',
      image: '👥'
    },
    {
      title: 'Graduation Ceremony',
      description: 'Celebrating student achievements and success stories',
      image: '🎓'
    },
    {
      title: 'Tech Innovation Fair',
      description: 'Showcasing student projects using EduPath tools',
      image: '💡'
    },
    {
      title: 'Parent Orientation',
      description: 'Introducing parents to EduPath platform features',
      image: '👨‍👩‍👧‍👦'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Photo Gallery</h1>
        <div className={styles.grid}>
          {galleryItems.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.image}>{item.image}</div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;

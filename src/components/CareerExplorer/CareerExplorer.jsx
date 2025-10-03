// pages/CareerExplorer/CareerExplorer.jsx
import React, { useState } from 'react';
import styles from './CareerExplorer.module.css';

const CareerExplorer = () => {
  const [interests, setInterests] = useState('');

  const handleExplore = () => {
    if (!interests.trim()) return;
    // Logic to process interests and show career suggestions would go here
    console.log('Exploring careers for:', interests);
  };

  return (
    <div className={styles.careerExplorer}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI Career Explorer</h1>
        <p className={styles.subtitle}>Discover your ideal career path with AI-powered recommendations</p>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.inputSection}>
        <h2 className={styles.sectionTitle}>Tell us about your interests</h2>
        <textarea
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="Describe your interests, skills, and what you enjoy doing..."
          className={styles.textarea}
          rows={5}
        />
        <button
          onClick={handleExplore}
          disabled={!interests.trim()}
          className={styles.exploreButton}
        >
          Explore Career Paths
        </button>
      </div>
    </div>
  );
};

export default CareerExplorer;
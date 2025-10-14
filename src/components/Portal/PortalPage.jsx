import React from 'react';
import styles from './PortalPage.module.css';

const PortalPage = () => {
  const portalFeatures = [
    {
      title: 'Dashboard',
      description: 'Access your personalized dashboard with progress tracking and recommendations.',
      icon: '📊'
    },
    {
      title: 'Study Materials',
      description: 'Upload and organize your study notes, documents, and learning resources.',
      icon: '📚'
    },
    {
      title: 'Quiz History',
      description: 'Review your quiz performance and track your learning progress over time.',
      icon: '📝'
    },
    {
      title: 'Career Profile',
      description: 'Manage your career interests, skills assessment, and exploration history.',
      icon: '🎯'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Student Portal</h1>
        <div className={styles.welcomeCard}>
          <h2 className={styles.welcomeTitle}>Welcome to Your EduPath Portal</h2>
          <p className={styles.welcomeText}>
            Access all your educational tools and track your progress in one place.
          </p>
        </div>
        <div className={styles.grid}>
          {portalFeatures.map((feature, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.icon}>{feature.icon}</div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.description}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortalPage;

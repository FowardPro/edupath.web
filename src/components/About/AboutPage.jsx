import React from 'react';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>About EduPath</h1>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Our Mission</h2>
          <p className={styles.cardText}>
            At EduPath, we're revolutionizing education through the power of artificial intelligence. We believe every student deserves personalized guidance and innovative tools to excel in their academic journey.
          </p>
          <div className={styles.grid}>
            <div>
              <h3 className={styles.subTitle}>For High School Students</h3>
              <p className={styles.subText}>Our AI-powered career exploration helps students discover their passion and find the perfect career path based on their interests, skills, and goals.</p>
            </div>
            <div>
              <h3 className={styles.subTitle}>For University Students</h3>
              <p className={styles.subText}>Transform your study notes into interactive quizzes with our intelligent quiz generator, making learning more engaging and effective.</p>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Our History</h2>
          <p className={styles.cardText}>
            Founded with the vision of making quality education accessible to all, EduPath combines cutting-edge AI technology with proven educational methodologies. Our platform has helped thousands of students achieve their academic and career goals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

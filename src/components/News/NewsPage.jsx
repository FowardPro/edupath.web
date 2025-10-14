import React from 'react';
import styles from './NewsPage.module.css';

const NewsPage = () => {
  const newsItems = [
    {
      title: 'EduPath Launches AI-Powered Career Exploration Tool',
      date: 'December 15, 2024',
      summary: 'Our new AI career explorer helps high school students discover their perfect career path based on their interests and skills.',
      image: '🚀'
    },
    {
      title: 'Smart Quiz Generator Now Available for University Students',
      date: 'December 10, 2024',
      summary: 'Transform your study notes into interactive quizzes with our intelligent AI-powered quiz generator.',
      image: '🧠'
    },
    {
      title: 'EduPath Reaches 10,000 Active Users Milestone',
      date: 'December 5, 2024',
      summary: 'We\'re thrilled to announce that EduPath has reached 10,000 active users across our platform.',
      image: '🎉'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>News & Announcements</h1>
        <div className={styles.grid}>
          {newsItems.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.image}>{item.image}</div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.date}>{item.date}</p>
              <p className={styles.summary}>{item.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;

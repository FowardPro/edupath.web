import React from 'react'
import styles from './NewsAnnouncements.module.css';

const NewsAnnouncements = () => {
  const newsData = [
    {
      title: "New AI Quiz Generator Feature Launched",
      excerpt: "Students can now upload their study notes and generate personalized quizzes using our advanced AI technology.",
      date: "October 1, 2025",
      category: "Technology",
      featured: true
    },
    {
      title: "AI Literacy Certification Program Available",
      excerpt: "New certification program helps students develop essential AI and digital literacy skills for the future job market.",
      date: "October 5, 2025",
      category: "Campus",

    },
    {
      title: "Fall Semester Registration Now Open",
      excerpt: "Fall semester registration is now open for all students. Don't miss your chance to enroll in the courses you want!",
      date: "October 10, 2025",
      category: "Registration",

    },
    {
      title: "Career Exploration Program Expansion",
      excerpt: "The Career Exploration Program is expanding to include new workshops and resources for students.",
      date: "October 15, 2025",
      category: "Campus",

    }
  ];

  
  return (
    <div className={styles.announcementsContainer}>
      <div className={styles.announcementsHeader}>
        <h2 className={styles.announcementsTitle}>News & Announcements</h2>
      </div>

      <div className={styles.announcementsList}>
        {newsData.map((news, index) => (
          <div key={index} className={`${styles.announcementCard} ${news.featured ? styles.featuredAnnouncement : ''}`}>
            <div className={styles.announcementHeader}>
              <span className={`${styles.announcementCategory} ${styles[news.category.toLowerCase()]}`}>{news.category}</span>
              <span className={styles.announcementDate}>{news.date}</span>
            </div>
            <h3 className={styles.announcementTitle}>{news.title}</h3>
            <p className={styles.announcementExcerpt}>{news.excerpt}</p>
            <button className={styles.readMoreButton}>Read More</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewsAnnouncements
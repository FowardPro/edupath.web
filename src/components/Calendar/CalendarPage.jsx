import React from 'react';
import styles from './CalendarPage.module.css';

const CalendarPage = () => {
  const events = [
    {
      title: 'AI Tools Workshop',
      date: 'January 15, 2025',
      time: '2:00 PM - 4:00 PM',
      location: 'Virtual',
      description: 'Learn how to use EduPath\'s AI tools effectively in your studies.',
      image: '🛠️'
    },
    {
      title: 'Career Exploration Seminar',
      date: 'January 22, 2025',
      time: '10:00 AM - 12:00 PM',
      location: 'Main Auditorium',
      description: 'Discover career paths and get guidance from industry experts.',
      image: '💼'
    },
    {
      title: 'Parent-Teacher Conference',
      date: 'January 28, 2025',
      time: '6:00 PM - 8:00 PM',
      location: 'School Hall',
      description: 'Meet with teachers to discuss student progress and goals.',
      image: '👨‍👩‍👧‍👦'
    },
    {
      title: 'Spring Semester Orientation',
      date: 'February 5, 2025',
      time: '9:00 AM - 11:00 AM',
      location: 'Campus Center',
      description: 'Welcome new students and overview of upcoming semester.',
      image: '🎓'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Calendar & Events</h1>
        <div className={styles.grid}>
          {events.map((event, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.image}>{event.image}</div>
              <h3 className={styles.cardTitle}>{event.title}</h3>
              <div className={styles.eventDetails}>
                <p className={styles.date}><strong>Date:</strong> {event.date}</p>
                <p className={styles.time}><strong>Time:</strong> {event.time}</p>
                <p className={styles.location}><strong>Location:</strong> {event.location}</p>
              </div>
              <p className={styles.description}>{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;

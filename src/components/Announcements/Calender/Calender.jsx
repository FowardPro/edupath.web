import React from 'react'
import styles from './Calender.module.css';


const Calendar = () => {

  const calendarData = {


    events: [
      {
        title: "AI Workshop",
        date: "Oct 20",
        time: "10:00 AM - 12:00 PM",
        location: "Room 101",
        description: "An introductory workshop on AI and its applications."
      },
      {
        title: "Career Fair",
        date: "Oct 25",
        time: "1:00 PM - 4:00 PM",
        location: "Main Hall",
        description: "Meet potential employers and explore job opportunities."
      },
      {
        title: "Midterm Exams",
        date: "Nov 1 - Nov 5",
        time: "All Day",
        location: "Various Locations",
        description: "Midterm exams for all courses."
      },
      {
        title: "Thanksgiving Break",
        date: "Nov 25 - Nov 29",
        time: "All Day",
        location: "Various Locations",
        description: "Thanksgiving break for all students."
      }
    ],
    academicCalendar: [
      {
        period: "Fall Semester 2024",
        startDate: "2024-09-01",
        endDate: "2024-12-20",
        events: [
          { name: "Classes Begin", date: "2024-09-01" },
          { name: "Add/Drop Deadline", date: "2024-09-15" },
          { name: "Midterm Exams", date: "2024-10-28" },
          { name: "Thanksgiving Break", date: "2024-11-28" },
          { name: "Final Exams", date: "2024-12-10" },
          { name: "Semester Ends", date: "2024-12-20" }
        ]
      },
      {
        period: "Spring Semester 2025",
        startDate: "2025-01-10",
        endDate: "2025-05-15",
        events: [
          { name: "Classes Begin", date: "2025-01-10" },
          { name: "Add/Drop Deadline", date: "2025-01-24" },
          { name: "Midterm Exams", date: "2025-03-14" },
          { name: "Spring Break", date: "2025-03-21" },
          { name: "Final Exams", date: "2025-05-05" },
          { name: "Semester Ends", date: "2025-05-15" }
        ]
      },
      {
        period: "Summer Term 2025",
        startDate: "2025-06-01",
        endDate: "2025-08-15",
        events: [
          { name: "Classes Begin", date: "2025-06-01" },
          { name: "Add/Drop Deadline", date: "2025-06-15" },
          { name: "Final Exams", date: "2025-08-10" },
          { name: "Semester Ends", date: "2025-08-15" }
        ]
      },
      {
        period: "Fall Semester 2025",
        startDate: "2025-09-01",
        endDate: "2025-12-20",
        events: [
          { name: "Classes Begin", date: "2025-09-01" },
          { name: "Add/Drop Deadline", date: "2025-09-15" },
          { name: "Midterm Exams", date: "2025-10-28" },
          { name: "Thanksgiving Break", date: "2025-11-28" },
          { name: "Final Exams", date: "2025-12-10" },
          { name: "Semester Ends", date: "2025-12-20" }
        ]
      }
    ]

  }

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <h2 className={styles.calendarTitle}>Academic Calendar & Events</h2>
      </div>
      <div className={styles.calendarContent}>
        <div className={styles.eventsSection}>
          <h3 className={styles.sectionTitle}>Upcoming Events</h3>
          {calendarData.events.map((event, index) => (
            <div key={index} className={styles.eventCard}>
              <h4 className={styles.eventTitle}>{event.title}</h4>
              <p className={styles.eventDateTime}>{event.date} | {event.time}</p>
              <p className={styles.eventLocation}>Location: {event.location}</p>
              <p className={styles.eventDescription}>{event.description}</p>
            </div>
          ))}
        </div>
        <div className={styles.academicCalendarSection}>
          <h3 className={styles.sectionTitle}>Academic Calendar</h3>
          {calendarData.academicCalendar.map((semester, index) => (
            <div key={index} className={styles.semesterCard}>
              <h4 className={styles.semesterTitle}>{semester.period}</h4>
              <p className={styles.semesterDates}>From {semester.startDate} to {semester.endDate}</p>
              <ul className={styles.semesterEventsList}>
                {semester.events.map((event, index) => (
                  <li key={index} className={styles.semesterEvent}>
                    {event.name} - {event.date}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Calendar;

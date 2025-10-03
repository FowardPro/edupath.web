import React, { useEffect, useState } from "react";
import "../App.css"; // keep your global theme

export default function StudentPortal() {
  const [profile, setProfile] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // 🔹 Replace with real API calls later
    // fetch("/api/student/profile").then(res => res.json()).then(setProfile);
    // fetch("/api/student/grades").then(res => res.json()).then(setGrades);
    // fetch("/api/student/attendance").then(res => res.json()).then(setAttendance);
    // fetch("/api/student/schedule").then(res => res.json()).then(setSchedule);
    // fetch("/api/student/assignments").then(res => res.json()).then(setAssignments);
    // fetch("/api/student/quizzes").then(res => res.json()).then(setQuizzes);
    // fetch("/api/student/announcements").then(res => res.json()).then(setAnnouncements);

    // Leave arrays empty; backend will fill them
    setProfile({});
    setGrades([]);
    setAttendance([]);
    setSchedule([]);
    setAssignments([]);
    setQuizzes([]);
    setAnnouncements([]);
  }, []);

  return (
    <div className="portal-container">
      <h1 className="portal-title">Student Portal</h1>

      {/* Profile */}
      <section className="panel">
        <h2>Profile</h2>
        {profile ? (
          <div>
            <p><b>Name:</b> {profile.name}</p>
            <p><b>Email:</b> {profile.email}</p>
            <p><b>Program:</b> {profile.program}</p>
          </div>
        ) : (
          <p>No profile loaded.</p>
        )}
      </section>

      {/* Grades */}
      <section className="panel">
        <h2>Grades</h2>
        {grades.length ? (
          <table className="table">
            <thead>
              <tr><th>Course</th><th>Grade</th></tr>
            </thead>
            <tbody>
              {grades.map((g, i) => (
                <tr key={i}>
                  <td>{g.course}</td>
                  <td>{g.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No grades available.</p>}
      </section>

      {/* Attendance */}
      <section className="panel">
        <h2>Attendance</h2>
        {attendance.length ? (
          <ul>
            {attendance.map((a, i) => (
              <li key={i}>{a.date} - {a.status}</li>
            ))}
          </ul>
        ) : <p>No attendance records.</p>}
      </section>

      {/* Schedule */}
      <section className="panel">
        <h2>Schedule</h2>
        {schedule.length ? (
          <ul>
            {schedule.map((s, i) => (
              <li key={i}>{s.day} - {s.course} @ {s.time}</li>
            ))}
          </ul>
        ) : <p>No schedule assigned.</p>}
      </section>

      {/* Assignments */}
      <section className="panel">
        <h2>Assignments</h2>
        {assignments.length ? (
          <ul>
            {assignments.map((a, i) => (
              <li key={i}>
                {a.title} (Due {a.due_date}) - {a.status}
                {a.status === "Pending" && (
                  <input type="file" onChange={(e) => console.log("Upload", e.target.files)} />
                )}
              </li>
            ))}
          </ul>
        ) : <p>No assignments.</p>}
      </section>

      {/* Quizzes */}
      <section className="panel">
        <h2>Quizzes</h2>
        {quizzes.length ? (
          <ul>
            {quizzes.map((q, i) => (
              <li key={i}>
                {q.title} - Due {q.due_date}
                <button className="btn">Take Quiz</button>
              </li>
            ))}
          </ul>
        ) : <p>No quizzes.</p>}
      </section>

      {/* Announcements */}
      <section className="panel">
        <h2>Announcements</h2>
        {announcements.length ? (
          <ul>
            {announcements.map((a, i) => (
              <li key={i}>{a.message}</li>
            ))}
          </ul>
        ) : <p>No announcements.</p>}
      </section>
    </div>
  );
}

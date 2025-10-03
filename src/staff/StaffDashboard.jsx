import React, { useEffect, useState } from "react";
import { StaffAPI, CommunicationAPI } from "../services/api";
import "../App.css"; // global theme

export default function StaffDashboard() {
  // 🔹 State
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch staff data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cls, asg, ann] = await Promise.all([
          StaffAPI.getClasses(),
          StaffAPI.getAssignments(),
          CommunicationAPI.list(),
        ]);
        setClasses(cls);
        setAssignments(asg);
        setAnnouncements(ann);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Actions
  const createClass = async (data) => {
    try {
      const newClass = await StaffAPI.createClass(data);
      setClasses((prev) => [...prev, newClass]);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteClass = async (id) => {
    try {
      await StaffAPI.deleteClass(id);
      setClasses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const createAssignment = async (data) => {
    try {
      const newAsg = await StaffAPI.createAssignment(data);
      setAssignments((prev) => [...prev, newAsg]);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteAssignment = async (id) => {
    try {
      await StaffAPI.deleteAssignment(id);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const postAnnouncement = async (data) => {
    try {
      const ann = await CommunicationAPI.create(data);
      setAnnouncements((prev) => [...prev, ann]);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await CommunicationAPI.delete(id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page-container">
      <h1>Staff Portal</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {/* Classes Section */}
      <section className="mb-8">
        <h2>Classes</h2>
        <button className="btn mb-2" onClick={() => createClass({ name: "New Class" })}>
          + New Class
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.students?.length || 0}</td>
                <td>
                  <button className="btn danger" onClick={() => deleteClass(c.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Assignments Section */}
      <section className="mb-8">
        <h2>Assignments</h2>
        <button
          className="btn mb-2"
          onClick={() => createAssignment({ title: "New Assignment" })}
        >
          + New Assignment
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.due_date || "—"}</td>
                <td>
                  <button className="btn danger" onClick={() => deleteAssignment(a.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Announcements Section */}
      <section>
        <h2>Announcements</h2>
        <button
          className="btn mb-2"
          onClick={() => postAnnouncement({ message: "New announcement!" })}
        >
          + New Announcement
        </button>
        <ul>
          {announcements.map((a) => (
            <li key={a.id} className="flex justify-between items-center mb-2">
              <span>{a.message}</span>
              <button className="btn danger" onClick={() => deleteAnnouncement(a.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

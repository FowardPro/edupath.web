// src/pages/Connect.jsx
import React, { useState, useEffect } from "react";
import "../App.css";

export default function Connect() {
  const [staff, setStaff] = useState([]); // staff directory
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });

  // 🔹 Fetch staff directory from backend later
  useEffect(() => {
    // fetch("/api/staff/")
    //   .then((res) => res.json())
    //   .then((data) => setStaff(data))
    //   .catch((err) => console.error("Failed to load staff:", err));
    setStaff([]); // placeholder for now
  }, []);

  // 🔹 Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Submit contact form
  const handleSubmit = (e) => {
    e.preventDefault();
    // fetch("/api/contact/", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(form),
    // })
    //   .then((res) => res.json())
    //   .then(() => {
    //     alert("Message sent successfully!");
    //     setForm({ name: "", email: "", topic: "", message: "" });
    //   })
    //   .catch((err) => console.error("Error sending message:", err));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Connect with Us</h1>

      {/* Contact Form */}
      <div className="bg-[var(--panel)] p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="input w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="input w-full"
            required
          />
          <select
            name="topic"
            value={form.topic}
            onChange={handleChange}
            className="input w-full"
            required
          >
            <option value="">Select Topic</option>
            <option value="career">Career Exploration</option>
            <option value="quiz">AI Quiz Generator</option>
            <option value="support">Technical Support</option>
            <option value="other">Other</option>
          </select>
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            rows="4"
            className="input w-full"
            required
          ></textarea>
          <button type="submit" className="btn w-full">
            Send Message
          </button>
        </form>
      </div>

      {/* Staff Directory */}
      <div className="bg-[var(--panel)] p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Staff Directory</h2>
        {staff.length === 0 ? (
          <p className="text-gray-400">Staff directory will appear here.</p>
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.role}</td>
                  <td>{member.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

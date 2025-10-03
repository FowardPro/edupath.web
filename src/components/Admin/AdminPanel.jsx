// src/components/Admin/AdminPanel.jsx
import React from "react";
import "./AdminPanel.css";

export default function AdminPanel({ onLogout }) {
  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="brand">🧠 EduPath Admin</div>
        <nav className="menu">
          <button className="menu-item active">Dashboard</button>
          <button className="menu-item">Manage Users</button>
          <button className="menu-item">Manage Content</button>
          <button className="menu-item">Settings</button>
          <button className="menu-item danger" onClick={onLogout}>Logout</button>
        </nav>
      </aside>

      {/* Main area */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <h2>Admin Panel</h2>
          <div className="user-chip">Role: Admin</div>
        </header>

        {/* Content Area */}
        <section className="admin-content">
          {/* ⚡ Real data from backend will be plugged here later */}
          <div className="card">
            <h3>Manage Users</h3>
            <p>This section will list and manage registered users.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

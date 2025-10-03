import React, { useState } from "react";
import "../../App.css";
import UserManagement from "./UserManagement";

export default function AdminDashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState("users");

  // Sidebar items
  const sections = [
    { id: "users", label: "User Management" },
    { id: "roles", label: "Role Management" },
    { id: "permissions", label: "Permission Management" },
    { id: "audit", label: "Audit Logs" },
    { id: "settings", label: "System Settings" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return <UserManagement />;
      case "roles":
        return <div>Role Management (coming soon)</div>;
      case "permissions":
        return <div>Permission Management (coming soon)</div>;
      case "audit":
        return <div>Audit Logs (coming soon)</div>;
      case "settings":
        return <div>System Settings (coming soon)</div>;
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="brand">🧠 EduPath Admin</div>
        <nav className="menu">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`menu-item ${activeSection === s.id ? "active" : ""}`}
            >
              {s.label}
            </button>
          ))}
          <button className="menu-item danger mt-4" onClick={onLogout}>
            Logout
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <header className="admin-topbar">
          <h1 className="text-lg font-bold capitalize">{activeSection.replace("-", " ")}</h1>
          <span className="user-chip">Admin</span>
        </header>
        <section className="admin-content">{renderContent()}</section>
      </main>
    </div>
  );
}

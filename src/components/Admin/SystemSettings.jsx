import React, { useState } from "react";
import "../../App.css";

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState("general");

  // Placeholder settings state (backend later)
  const [settings, setSettings] = useState({
    siteName: "EduPath",
    themeColor: "#3b82f6",
    timezone: "UTC",
    logo: null,
    favicon: null,
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPass: "",
    twoFactor: false,
    sessionTimeout: 30,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    // 🔹 send settings to backend: fetch("/api/settings", { method:"POST", body: JSON.stringify(settings) })
    alert("Settings saved!");
  };

  return (
    <div>
      <h2 className="mb-4">System Settings</h2>
      
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-700 mb-4">
        {["general", "branding", "email", "integrations", "security"].map(tab => (
          <button
            key={tab}
            className={`navButton ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Panels */}
      <div className="admin-content">
        {activeTab === "general" && (
          <div className="grid gap-4">
            <input
              className="input"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              placeholder="Site Name"
            />
            <select
              className="input"
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
            >
              <option value="UTC">UTC</option>
              <option value="Africa/Johannesburg">Africa/Johannesburg</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </div>
        )}

        {activeTab === "branding" && (
          <div className="grid gap-4">
            <label>Upload Logo</label>
            <input type="file" className="input" name="logo" />
            <label>Upload Favicon</label>
            <input type="file" className="input" name="favicon" />
            <input
              type="color"
              className="input"
              name="themeColor"
              value={settings.themeColor}
              onChange={handleChange}
            />
          </div>
        )}

        {activeTab === "email" && (
          <div className="grid gap-4">
            <input
              className="input"
              name="smtpHost"
              value={settings.smtpHost}
              onChange={handleChange}
              placeholder="SMTP Host"
            />
            <input
              className="input"
              name="smtpPort"
              value={settings.smtpPort}
              onChange={handleChange}
              placeholder="SMTP Port"
            />
            <input
              className="input"
              name="smtpUser"
              value={settings.smtpUser}
              onChange={handleChange}
              placeholder="SMTP Username"
            />
            <input
              type="password"
              className="input"
              name="smtpPass"
              value={settings.smtpPass}
              onChange={handleChange}
              placeholder="SMTP Password"
            />
            <button className="btn">Send Test Email</button>
          </div>
        )}

        {activeTab === "integrations" && (
          <div className="grid gap-4">
            <input className="input" placeholder="Google API Key" />
            <input className="input" placeholder="LinkedIn Client ID" />
            <input className="input" placeholder="Payment Gateway Key" />
          </div>
        )}

        {activeTab === "security" && (
          <div className="grid gap-4">
            <label>Password Policy: (min 8 chars, 1 uppercase, 1 number)</label>
            <input
              type="number"
              className="input"
              name="sessionTimeout"
              value={settings.sessionTimeout}
              onChange={handleChange}
              placeholder="Session Timeout (minutes)"
            />
            <label>
              <input
                type="checkbox"
                name="twoFactor"
                checked={settings.twoFactor}
                onChange={handleChange}
              />{" "}
              Enable Two-Factor Authentication
            </label>
          </div>
        )}

        <div className="mt-6">
          <button className="btn" onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

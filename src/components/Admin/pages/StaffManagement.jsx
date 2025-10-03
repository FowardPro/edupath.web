// src/admin/pages/StaffManagement.jsx
import React, { useState, useEffect } from "react";
import "../../../App.css";


export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // create | edit | delete
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", role: "", email: "" });

  // 🔹 Fetch staff from backend later
  useEffect(() => {
    // fetch("/api/staff/")
    //   .then((res) => res.json())
    //   .then((data) => setStaff(data));
    setStaff([]); // empty until backend wired
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openModal = (type, staffMember = null) => {
    setModal(type);
    setSelected(staffMember);
    setForm(staffMember || { name: "", role: "", email: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modal === "create") {
      // POST /api/staff/
    } else if (modal === "edit" && selected) {
      // PUT /api/staff/{id}/
    } else if (modal === "delete" && selected) {
      // DELETE /api/staff/{id}/
    }
    setModal(null);
    setSelected(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Staff Directory Management</h2>
        <button className="btn" onClick={() => openModal("create")}>
          + Add Staff
        </button>
      </div>

      <input
        className="input mb-4"
        placeholder="Search staff..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th style={{ width: "150px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff
            .filter(
              (s) =>
                s.name?.toLowerCase().includes(search.toLowerCase()) ||
                s.email?.toLowerCase().includes(search.toLowerCase())
            )
            .map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.role}</td>
                <td>{s.email}</td>
                <td>
                  <button className="btn" onClick={() => openModal("edit", s)}>
                    Edit
                  </button>{" "}
                  <button
                    className="btn danger"
                    onClick={() => openModal("delete", s)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modals */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-[var(--panel)] p-6 rounded-xl shadow-lg w-full max-w-md">
            {(modal === "create" || modal === "edit") && (
              <form onSubmit={handleSubmit}>
                <h3 className="mb-4">
                  {modal === "create" ? "Add Staff" : "Edit Staff"}
                </h3>
                <div className="mb-3">
                  <label className="block mb-1">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="input w-full"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1">Role</label>
                  <input
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="input w-full"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input w-full"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn danger"
                    onClick={() => setModal(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn">
                    Save
                  </button>
                </div>
              </form>
            )}

            {modal === "delete" && (
              <div>
                <h3 className="mb-4">Delete Staff</h3>
                <p>
                  Are you sure you want to delete <b>{selected?.name}</b>?
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <button className="btn danger" onClick={handleSubmit}>
                    Delete
                  </button>
                  <button className="btn" onClick={() => setModal(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

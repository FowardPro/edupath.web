import React, { useEffect, useState } from "react";
import "../../App.css"; // global theme

export default function UserManagement() {
  const [users, setUsers] = useState([]);   // user list
  const [search, setSearch] = useState(""); // search filter
  const [modal, setModal] = useState(null); // "create" | "edit" | "delete"
  const [selected, setSelected] = useState(null); // selected user
  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "student",
    active: true,
  });

  // 🔹 Fetch users from API (placeholder — connect to Django later)
  useEffect(() => {
    // Example backend fetch (uncomment later):
    // fetch("/api/users/")
    //   .then((res) => res.json())
    //   .then((data) => setUsers(data));
    setUsers([]); // empty until backend is wired
  }, []);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔹 Open modal (for create/edit/delete)
  const openModal = (type, user = null) => {
    setModal(type);
    setSelected(user);
    setForm(
      user || { username: "", email: "", role: "student", active: true }
    );
  };

  // 🔹 Submit actions
  const handleSubmit = (e) => {
    e.preventDefault();

    if (modal === "create") {
      // POST /api/users/
      // setUsers([...users, form]);
    } else if (modal === "edit" && selected) {
      // PUT /api/users/{id}/
      // setUsers(users.map((u) => (u.id === selected.id ? form : u)));
    } else if (modal === "delete" && selected) {
      // DELETE /api/users/{id}/
      // setUsers(users.filter((u) => u.id !== selected.id));
    }

    setModal(null);
    setSelected(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2>User Management</h2>
        <button className="btn" onClick={() => openModal("create")}>
          + Add User
        </button>
      </div>

      {/* Search */}
      <input
        className="input mb-4"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Users Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th style={{ width: "180px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter(
              (u) =>
                u.username?.toLowerCase().includes(search.toLowerCase()) ||
                u.email?.toLowerCase().includes(search.toLowerCase())
            )
            .map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <span className="badge">{u.role}</span>
                </td>
                <td>
                  {u.active ? (
                    <span className="badge">Active</span>
                  ) : (
                    <span className="badge">Inactive</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn"
                    onClick={() => openModal("edit", u)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn danger"
                    onClick={() => openModal("delete", u)}
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
            {/* Create/Edit Modal */}
            {(modal === "create" || modal === "edit") && (
              <form onSubmit={handleSubmit}>
                <h3 className="mb-4">
                  {modal === "create" ? "Add User" : "Edit User"}
                </h3>

                <div className="mb-3">
                  <label className="block mb-1">Username</label>
                  <input
                    name="username"
                    value={form.username}
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

                <div className="mb-3">
                  <label className="block mb-1">Role</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="input w-full"
                  >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="student">Student</option>
                  </select>
                </div>

                <div className="mb-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                  />
                  <label>Active</label>
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

            {/* Delete Modal */}
            {modal === "delete" && (
              <div>
                <h3 className="mb-4">Delete User</h3>
                <p>
                  Are you sure you want to delete{" "}
                  <b>{selected?.username}</b>?
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <button className="btn danger" onClick={handleSubmit}>
                    Delete
                  </button>
                  <button
                    className="btn"
                    onClick={() => setModal(null)}
                  >
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

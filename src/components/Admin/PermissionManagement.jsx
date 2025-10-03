import React, { useEffect, useState } from "react";
import "../../App.css"; // global theme

export default function PermissionManagement() {
  const [permissions, setPermissions] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // "create" | "edit" | "delete"
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ key: "", description: "" });

  // 🔹 Load permissions (ready for backend integration)
  useEffect(() => {
    // fetch("/api/permissions/").then(res=>res.json()).then(setPermissions);
    setPermissions([]);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openModal = (type, perm = null) => {
    setModal(type);
    setSelected(perm);
    setForm(perm || { key: "", description: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modal === "create") {
      // POST /api/permissions/
    } else if (modal === "edit" && selected) {
      // PUT /api/permissions/{id}/
    } else if (modal === "delete" && selected) {
      // DELETE /api/permissions/{id}/
    }
    setModal(null);
    setSelected(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Permission Management</h2>
        <button className="btn" onClick={() => openModal("create")}>
          + Add Permission
        </button>
      </div>

      {/* Search */}
      <input
        className="input mb-4"
        placeholder="Search permissions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Permissions table */}
      <table className="table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Description</th>
            <th style={{ width: "150px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {permissions
            .filter((p) =>
              p.key?.toLowerCase().includes(search.toLowerCase())
            )
            .map((p) => (
              <tr key={p.id}>
                <td>
                  <span className="badge">{p.key}</span>
                </td>
                <td>{p.description}</td>
                <td>
                  <button className="btn" onClick={() => openModal("edit", p)}>
                    Edit
                  </button>{" "}
                  <button
                    className="btn danger"
                    onClick={() => openModal("delete", p)}
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
            {/* CREATE / EDIT */}
            {(modal === "create" || modal === "edit") && (
              <form onSubmit={handleSubmit}>
                <h3 className="mb-4">
                  {modal === "create" ? "Add Permission" : "Edit Permission"}
                </h3>

                <div className="mb-3">
                  <label className="block mb-1">Permission Key</label>
                  <input
                    name="key"
                    value={form.key}
                    onChange={handleChange}
                    className="input w-full"
                    placeholder="e.g. can_manage_users"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="input w-full"
                    rows="3"
                    placeholder="Describe what this permission allows"
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

            {/* DELETE CONFIRM */}
            {modal === "delete" && (
              <div>
                <h3 className="mb-4">Delete Permission</h3>
                <p>
                  Are you sure you want to delete{" "}
                  <b>{selected?.key}</b>?
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

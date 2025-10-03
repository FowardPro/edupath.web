import React, { useEffect, useState } from "react";
import "../../App.css"; // global admin theme

export default function RoleManagement() {
  const [roles, setRoles] = useState([]); // list of roles
  const [permissions, setPermissions] = useState([]); // all available perms
  const [search, setSearch] = useState(""); // filter
  const [modal, setModal] = useState(null); // "create" | "edit" | "delete"
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", permissions: [] });

  // 🔹 Load roles & permissions (replace with Django fetch later)
  useEffect(() => {
    // fetch("/api/roles/").then(res=>res.json()).then(setRoles);
    // fetch("/api/permissions/").then(res=>res.json()).then(setPermissions);
    setRoles([]); 
    setPermissions([]);
  }, []);

  // 🔹 Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Toggle permission checkbox
  const togglePermission = (perm) => {
    setForm((prev) => {
      const has = prev.permissions.includes(perm);
      return {
        ...prev,
        permissions: has
          ? prev.permissions.filter((p) => p !== perm)
          : [...prev.permissions, perm],
      };
    });
  };

  // 🔹 Open modal
  const openModal = (type, role = null) => {
    setModal(type);
    setSelected(role);
    setForm(role || { name: "", permissions: [] });
  };

  // 🔹 Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (modal === "create") {
      // POST /api/roles/
    } else if (modal === "edit" && selected) {
      // PUT /api/roles/{id}/
    } else if (modal === "delete" && selected) {
      // DELETE /api/roles/{id}/
    }
    setModal(null);
    setSelected(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Role Management</h2>
        <button className="btn" onClick={() => openModal("create")}>
          + Add Role
        </button>
      </div>

      {/* Search */}
      <input
        className="input mb-4"
        placeholder="Search roles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Roles table */}
      <table className="table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Permissions</th>
            <th style={{ width: "150px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles
            .filter((r) =>
              r.name?.toLowerCase().includes(search.toLowerCase())
            )
            .map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>
                  {r.permissions?.map((p) => (
                    <span key={p} className="badge mr-1">
                      {p}
                    </span>
                  ))}
                </td>
                <td>
                  <button className="btn" onClick={() => openModal("edit", r)}>
                    Edit
                  </button>{" "}
                  <button
                    className="btn danger"
                    onClick={() => openModal("delete", r)}
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
                  {modal === "create" ? "Add Role" : "Edit Role"}
                </h3>
                <div className="mb-3">
                  <label className="block mb-1">Role Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="input w-full"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block mb-2">Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {permissions.map((perm) => (
                      <label
                        key={perm}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={form.permissions.includes(perm)}
                          onChange={() => togglePermission(perm)}
                        />
                        {perm}
                      </label>
                    ))}
                  </div>
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
                <h3 className="mb-4">Delete Role</h3>
                <p>
                  Are you sure you want to delete role{" "}
                  <b>{selected?.name}</b>?
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

import React, { useEffect, useState } from "react";
import "../../App.css";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterAction, setFilterAction] = useState("");

  // 🔹 Load logs (ready for backend integration)
  useEffect(() => {
    // Example call: fetch("/api/audit-logs/").then(res=>res.json()).then(setLogs);
    setLogs([]);
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchUser = filterUser ? log.user?.toLowerCase().includes(filterUser.toLowerCase()) : true;
    const matchAction = filterAction ? log.action?.toLowerCase().includes(filterAction.toLowerCase()) : true;
    const matchSearch =
      search.length > 0
        ? log.description?.toLowerCase().includes(search.toLowerCase())
        : true;
    return matchUser && matchAction && matchSearch;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Audit Logs</h2>
        {/* 🔽 Export (backend integration later) */}
        <button className="btn">Export CSV</button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        <input
          className="input"
          placeholder="Search by description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          className="input"
          placeholder="Filter by user..."
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
        />
        <input
          className="input"
          placeholder="Filter by action..."
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
        />
      </div>

      {/* Logs table */}
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Description</th>
            <th>IP</th>
            <th>Device</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.user}</td>
                <td>
                  <span className="badge">{log.action}</span>
                </td>
                <td>{log.description}</td>
                <td>{log.ip || "—"}</td>
                <td>{log.device || "—"}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No logs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

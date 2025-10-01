// src/admin/pages/Users.jsx
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * ============ API CONTRACT (adjust to your backend) ============
 * BASE: process.env.REACT_APP_API_BASE || ""
 *
 * GET  /api/admin/users?query=&role=&status=&page=1&pageSize=20&sort=createdAt&dir=desc&from=&to=
 *   { rows:[{
 *      id, email, name, avatarUrl, role, status, // status: "active"|"invited"|"disabled"|"pending"
 *      lastLoginAt, createdAt, mfaEnabled, emailVerified, sessions, risk, // risk: "low"|"med"|"high"
 *    }],
 *     total:number
 *   }
 *
 * POST /api/admin/users          body: {name,email,role,status?}      -> {ok:true, id}
 * POST /api/admin/users/import   form-data: file (CSV)                 -> {ok:true, imported, errors:[]}
 * GET  /api/admin/users/export?query=&role=&status=&from=&to=         -> CSV stream
 * POST /api/admin/users/:id/activate                                  -> {ok:true}
 * POST /api/admin/users/:id/deactivate                                -> {ok:true}
 * DELETE /api/admin/users/:id                                         -> {ok:true}
 * POST /api/admin/users/:id/role      body:{role}                     -> {ok:true}
 * POST /api/admin/users/:id/reset                                     -> {ok:true}  // email reset link
 * POST /api/admin/users/:id/invite                                    -> {ok:true}
 *
 * GET  /api/admin/users/:id                                          -> full user
 * GET  /api/admin/users/:id/activity?limit=50                         -> [{id,when,what,meta}]
 * GET  /api/admin/users/:id/sessions                                  -> [{id,ip,device,createdAt,lastSeenAt,location}]
 * GET  /api/admin/users/:id/tokens                                    -> [{id,label,createdAt,lastUsedAt}]
 */

const API_BASE = process.env.REACT_APP_API_BASE || "";
const PAGE_SIZES = [10, 20, 50, 100];
const ROLES = ["admin", "staff", "student"]; // change to your roles
const STATUSES = ["active", "invited", "pending", "disabled"];

export default function Users() {
  // table state
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState("createdAt");
  const [dir, setDir] = useState("desc");

  // data
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // selection & UI
  const [selected, setSelected] = useState(new Set());
  const [drawerId, setDrawerId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  // date filters (optional)
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // debounce search
  const debouncedQuery = useDebounce(query, 350);

  // fetch list
  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setErr("");
    const qs = new URLSearchParams({
      query: debouncedQuery,
      role,
      status,
      page: String(page),
      pageSize: String(pageSize),
      sort,
      dir,
      from,
      to,
    });
    fetch(`${API_BASE}/api/admin/users?` + qs.toString(), { signal: ac.signal })
      .then(jsonOrThrow)
      .then((data) => {
        setRows(Array.isArray(data.rows) ? data.rows : []);
        setTotal(Number(data.total || 0));
        setSelected(new Set()); // clear selection on new data
      })
      .catch((e) => {
        if (e.name !== "AbortError") setErr(e.message || "Failed to load users.");
      })
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, [debouncedQuery, role, status, page, pageSize, sort, dir, from, to, refreshKey]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // bulk actions
  const selIds = useMemo(() => Array.from(selected), [selected]);
  const selCount = selIds.length;

  function toggleAll(e) {
    if (e.target.checked) {
      setSelected(new Set(rows.map((r) => r.id)));
    } else {
      setSelected(new Set());
    }
  }
  function toggleOne(id) {
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function bulk(path) {
    if (!selCount) return;
    try {
      await Promise.all(selIds.map((id) => fetch(`${API_BASE}${path.replace(":id", id)}`, { method: "POST" })));
      setRefreshKey((n) => n + 1);
    } catch (e) {
      alert("Action failed: " + (e.message || e));
    }
  }
  async function bulkDelete() {
    if (!selCount) return;
    if (!window.confirm(`Delete ${selCount} user(s)? This cannot be undone.`)) return;
    try {
      await Promise.all(selIds.map((id) => fetch(`${API_BASE}/api/admin/users/${id}`, { method: "DELETE" })));
      setRefreshKey((n) => n + 1);
    } catch (e) {
      alert("Delete failed: " + (e.message || e));
    }
  }
  async function bulkRole(newRole) {
    try {
      await Promise.all(
        selIds.map((id) =>
          fetch(`${API_BASE}/api/admin/users/${id}/role`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: newRole }),
          })
        )
      );
      setRefreshKey((n) => n + 1);
    } catch (e) {
      alert("Update role failed: " + (e.message || e));
    }
  }

  function onSort(col) {
    if (sort === col) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSort(col);
      setDir("asc");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Users</h1>
          <p className="text-gray-300">Manage users, roles, security and activity across your system.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => setCreateOpen(true)} className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold">
            New User
          </button>
          <button onClick={() => setImportOpen(true)} className="px-3 py-2 rounded-lg bg-white/10 text-gray-200 hover:bg-white/20">
            Import CSV
          </button>
          <a
            href={`${API_BASE}/api/admin/users/export?` + new URLSearchParams({ query, role, status, from, to }).toString()}
            className="px-3 py-2 rounded-lg bg-white/10 text-gray-200 hover:bg-white/20"
          >
            Export CSV
          </a>
          <button onClick={() => setRefreshKey((n) => n + 1)} className="px-3 py-2 rounded-lg bg-white/10 text-gray-200 hover:bg-white/20">
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
        <div className="grid md:grid-cols-6 gap-3">
          <div className="md:col-span-2">
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search name or email…"
              className="w-full p-2.5 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </div>
          <div>
            <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }} className="w-full p-2.5 bg-black/30 border border-white/20 rounded-lg text-white">
              <option value="">All roles</option>
              {ROLES.map((r) => <option key={r} value={r}>{title(r)}</option>)}
            </select>
          </div>
          <div>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-full p-2.5 bg-black/30 border border-white/20 rounded-lg text-white">
              <option value="">All status</option>
              {STATUSES.map((s) => <option key={s} value={s}>{title(s)}</option>)}
            </select>
          </div>
          <div>
            <input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className="w-full p-2.5 bg-black/30 border border-white/20 rounded-lg text-white"/>
          </div>
          <div>
            <input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} className="w-full p-2.5 bg-black/30 border border-white/20 rounded-lg text-white"/>
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      {selCount > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 flex flex-wrap items-center gap-3">
          <div className="text-gray-300">{selCount} selected</div>
          <button onClick={() => bulk("/api/admin/users/:id/activate")} className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-gray-200">Activate</button>
          <button onClick={() => bulk("/api/admin/users/:id/deactivate")} className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-gray-200">Deactivate</button>
          <button onClick={() => bulk("/api/admin/users/:id/reset")} className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-gray-200">Send reset</button>
          <button onClick={() => bulk("/api/admin/users/:id/invite")} className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-gray-200">Send invite</button>
          <RolePicker onPick={(r) => bulkRole(r)} />
          <button onClick={bulkDelete} className="px-3 py-1.5 rounded bg-red-600/80 hover:bg-red-600 text-white">Delete</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="px-4 py-3">
                <input type="checkbox" onChange={toggleAll} checked={rows.length>0 && selected.size===rows.length}/>
              </th>
              <Th label="User" col="name" sort={sort} dir={dir} onSort={onSort}/>
              <Th label="Email" col="email" sort={sort} dir={dir} onSort={onSort}/>
              <Th label="Role" col="role" sort={sort} dir={dir} onSort={onSort}/>
              <Th label="Status" col="status" sort={sort} dir={dir} onSort={onSort}/>
              <Th label="Last login" col="lastLoginAt" sort={sort} dir={dir} onSort={onSort}/>
              <Th label="Created" col="createdAt" sort={sort} dir={dir} onSort={onSort}/>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">Loading…</td></tr>
            )}
            {!loading && err && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-red-300">{err}</td></tr>
            )}
            {!loading && !err && rows.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No users found.</td></tr>
            )}
            {rows.map((u) => (
              <tr key={u.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.has(u.id)} onChange={()=>toggleOne(u.id)}/>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar url={u.avatarUrl} name={u.name || u.email}/>
                    <div>
                      <div className="text-white font-medium">{u.name || "—"}</div>
                      <div className="text-xs text-gray-400">ID: {u.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-300">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded bg-white/10 text-gray-200">{title(u.role)}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={u.status}/>
                </td>
                <td className="px-4 py-3 text-gray-300">{fmtWhen(u.lastLoginAt)}</td>
                <td className="px-4 py-3 text-gray-300">{fmtDate(u.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <RowBtn onClick={()=>setDrawerId(u.id)}>View</RowBtn>
                    {u.status !== "disabled"
                      ? <RowBtn onClick={()=>post(`${API_BASE}/api/admin/users/${u.id}/deactivate`, setRefreshKey)} danger>Disable</RowBtn>
                      : <RowBtn onClick={()=>post(`${API_BASE}/api/admin/users/${u.id}/activate`, setRefreshKey)}>Activate</RowBtn>}
                    <RowBtn onClick={()=>post(`${API_BASE}/api/admin/users/${u.id}/reset`, setRefreshKey)}>Reset</RowBtn>
                    <RowBtn onClick={()=>removeUser(u.id, setRefreshKey)} danger>Delete</RowBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4">
          <div className="text-gray-400">
            Page <span className="text-gray-200">{page}</span> of <span className="text-gray-200">{totalPages}</span> · {total} total
          </div>
          <div className="flex items-center gap-2">
            <select value={pageSize} onChange={(e)=>{ setPageSize(Number(e.target.value)); setPage(1); }} className="p-2 bg-black/30 border border-white/20 rounded-lg text-white">
              {PAGE_SIZES.map(n => <option key={n} value={n}>{n}/page</option>)}
            </select>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-2 rounded bg-white/10 text-gray-200 hover:bg-white/20 disabled:opacity-50">Prev</button>
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-2 rounded bg-white/10 text-gray-200 hover:bg-white/20 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawerId && <UserDrawer id={drawerId} onClose={()=>setDrawerId(null)} />}

      {/* Create modal */}
      {createOpen && <CreateUserModal onClose={()=>setCreateOpen(false)} onCreated={()=>setRefreshKey(n=>n+1)} />}

      {/* Import modal */}
      {importOpen && <ImportModal onClose={()=>setImportOpen(false)} onImported={()=>setRefreshKey(n=>n+1)} />}
    </div>
  );
}

/* ---------------- UI Subcomponents ---------------- */

function Th({ label, col, sort, dir, onSort }) {
  const active = sort === col;
  return (
    <th className="px-4 py-3 cursor-pointer select-none" onClick={()=>onSort(col)}>
      <div className="inline-flex items-center gap-1">
        <span>{label}</span>
        <span className={`text-xs ${active ? "text-cyan-300" : "text-gray-600"}`}>{active ? (dir==="asc"?"▲":"▼") : "↕"}</span>
      </div>
    </th>
  );
}

function Avatar({ url, name }) {
  const letter = (name || "?").trim().charAt(0).toUpperCase();
  return url ? (
    <img alt="" src={url} className="w-8 h-8 rounded-full object-cover" />
  ) : (
    <div className="w-8 h-8 rounded-full bg-white/20 text-white grid place-items-center">{letter}</div>
  );
}

function StatusBadge({ status }) {
  const map = {
    active: "text-green-300 bg-green-500/15 border-green-500/30",
    invited: "text-blue-300 bg-blue-500/15 border-blue-500/30",
    pending: "text-yellow-300 bg-yellow-500/15 border-yellow-500/30",
    disabled: "text-red-300 bg-red-500/15 border-red-500/30",
  };
  const cls = map[status] || "text-gray-300 bg-white/10 border-white/20";
  return <span className={`px-2 py-1 rounded border ${cls}`}>{title(status) || "Unknown"}</span>;
}

function RowBtn({ onClick, children, danger }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded text-sm ${danger ? "bg-red-600/80 hover:bg-red-600 text-white" : "bg-white/10 hover:bg-white/20 text-gray-200"}`}
    >
      {children}
    </button>
  );
}

/* ---------------- Drawer with tabs ---------------- */

function UserDrawer({ id, onClose }) {
  const [tab, setTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true); setErr("");
    Promise.all([
      fetch(`${API_BASE}/api/admin/users/${id}`, { signal: ac.signal }).then(jsonOrThrow),
      fetch(`${API_BASE}/api/admin/users/${id}/activity?limit=50`, { signal: ac.signal }).then(jsonOrThrow),
      fetch(`${API_BASE}/api/admin/users/${id}/sessions`, { signal: ac.signal }).then(jsonOrThrow),
    ]).then(([u, a, s]) => {
      setUser(u); setActivity(Array.isArray(a) ? a : []); setSessions(Array.isArray(s) ? s : []);
    }).catch((e)=>{ if (e.name!=="AbortError") setErr(e.message || "Failed to load user."); })
      .finally(()=>setLoading(false));
    return ()=>ac.abort();
  }, [id]);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute top-0 right-0 h-full w-full sm:w-[520px] bg-slate-900 shadow-2xl border-l border-white/20 flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="text-white font-semibold">User</div>
          <button onClick={onClose} className="text-gray-300 hover:text-white px-2 py-1 rounded bg-white/10">Close</button>
        </div>

        <div className="p-4 flex items-center gap-3 border-b border-white/10">
          <Avatar url={user?.avatarUrl} name={user?.name || user?.email}/>
          <div>
            <div className="text-white font-semibold">{user?.name || "—"}</div>
            <div className="text-gray-400 text-sm">{user?.email}</div>
            <div className="mt-1 flex gap-2">
              <StatusBadge status={user?.status}/>
              <span className="px-2 py-0.5 rounded bg-white/10 text-gray-200 text-xs">{title(user?.role)}</span>
              {user?.mfaEnabled && <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-xs border border-emerald-500/30">MFA</span>}
              {user?.emailVerified ? <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-xs border border-cyan-500/30">Verified</span>
                : <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-300 text-xs border border-yellow-500/30">Unverified</span>}
            </div>
          </div>
        </div>

        <div className="px-4 pt-3 flex gap-2 border-b border-white/10">
          {["profile","activity","access","sessions","security","notes"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`px-3 py-2 rounded-t-lg ${tab===t?"bg-white/15 text-white":"text-gray-300 hover:text-white hover:bg-white/10"}`}>
              {title(t)}
            </button>
          ))}
        </div>

        <div className="p-4 overflow-y-auto">
          {loading && <div className="text-gray-400">Loading…</div>}
          {err && <div className="text-red-300">{err}</div>}
          {!loading && !err && (
            <>
              {tab==="profile" && <ProfileTab user={user} />}
              {tab==="activity" && <ActivityTab items={activity} />}
              {tab==="access" && <AccessTab user={user} />}
              {tab==="sessions" && <SessionsTab items={sessions} />}
              {tab==="security" && <SecurityTab user={user} />}
              {tab==="notes" && <NotesTab userId={user.id} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user }) {
  return (
    <div className="space-y-3 text-gray-300">
      <Row label="Name" value={user?.name || "—"} />
      <Row label="Email" value={user?.email || "—"} />
      <Row label="Role" value={title(user?.role)} />
      <Row label="Status" value={title(user?.status)} />
      <Row label="Created" value={fmtDate(user?.createdAt)} />
      <Row label="Last login" value={fmtWhen(user?.lastLoginAt)} />
      <Row label="Risk" value={title(user?.risk) || "low"} />
    </div>
  );
}
function ActivityTab({ items }) {
  if (!items?.length) return <div className="text-gray-400">No activity.</div>;
  return (
    <ul className="space-y-3">
      {items.map((a)=>(
        <li key={a.id} className="p-3 rounded bg-white/5 border border-white/10">
          <div className="text-white font-medium">{a.what}</div>
          <div className="text-xs text-gray-400">{fmtWhen(a.when)}</div>
          {a.meta && <div className="text-gray-300 text-sm mt-1">{a.meta}</div>}
        </li>
      ))}
    </ul>
  );
}
function AccessTab({ user }) {
  return (
    <div className="space-y-3">
      <div className="text-gray-300">Role: <span className="px-2 py-1 rounded bg-white/10">{title(user?.role)}</span></div>
      <div className="text-gray-400 text-sm">Manage roles & granular permissions in the Roles screen.</div>
    </div>
  );
}
function SessionsTab({ items }) {
  if (!items?.length) return <div className="text-gray-400">No active sessions.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-gray-400 text-left">
          <tr><th className="py-2 pr-4">Device</th><th className="py-2 pr-4">IP</th><th className="py-2 pr-4">Location</th><th className="py-2 pr-4">Created</th><th className="py-2">Last seen</th></tr>
        </thead>
        <tbody>
          {items.map(s=>(
            <tr key={s.id} className="border-t border-white/10">
              <td className="py-2 pr-4 text-gray-200">{s.device || "—"}</td>
              <td className="py-2 pr-4 text-gray-300">{s.ip || "—"}</td>
              <td className="py-2 pr-4 text-gray-300">{s.location || "—"}</td>
              <td className="py-2 pr-4 text-gray-300">{fmtWhen(s.createdAt)}</td>
              <td className="py-2 text-gray-300">{fmtWhen(s.lastSeenAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function SecurityTab({ user }) {
  return (
    <div className="space-y-3 text-gray-300">
      <Row label="MFA" value={user?.mfaEnabled ? "Enabled" : "Disabled"} />
      <Row label="Email verified" value={user?.emailVerified ? "Yes" : "No"} />
      <div className="flex gap-2">
        <button onClick={()=>post(`${API_BASE}/api/admin/users/${user.id}/reset`)} className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-gray-200">Send password reset</button>
        <button onClick={()=>post(`${API_BASE}/api/admin/users/${user.id}/invite`)} className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-gray-200">Resend invite</button>
      </div>
    </div>
  );
}
function NotesTab({ userId }) {
  const [saving, setSaving] = useState(false);
  const [text, setText] = useState("");
  return (
    <div>
      <textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="Private admin notes…" className="w-full h-32 p-3 bg-black/30 border border-white/20 rounded text-white placeholder-gray-400"/>
      <div className="mt-2">
        <button disabled={saving} onClick={async ()=>{
          setSaving(true);
          try {
            await fetch(`${API_BASE}/api/admin/users/${userId}/notes`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ text }) });
            setText("");
            alert("Saved");
          } catch(e){ alert("Save failed"); } finally { setSaving(false); }
        }} className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-gray-200 disabled:opacity-50">Save note</button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-gray-400">{label}</div>
      <div className="text-gray-200">{value}</div>
    </div>
  );
}

/* ---------------- Create / Import Modals ---------------- */

function CreateUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name:"", email:"", role:"student", status:"invited" });
  const [saving, setSaving] = useState(false);
  return (
    <Modal title="Create user" onClose={onClose}>
      <div className="space-y-3">
        <Input label="Full name" value={form.name} onChange={(v)=>setForm(f=>({...f,name:v}))}/>
        <Input label="Email" type="email" value={form.email} onChange={(v)=>setForm(f=>({...f,email:v}))}/>
        <div className="grid grid-cols-2 gap-3">
          <Select label="Role" value={form.role} onChange={(v)=>setForm(f=>({...f,role:v}))} options={ROLES}/>
          <Select label="Initial status" value={form.status} onChange={(v)=>setForm(f=>({...f,status:v}))} options={STATUSES}/>
        </div>
        <div className="pt-2 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded bg-white/10 text-gray-200 hover:bg-white/20">Cancel</button>
          <button disabled={saving} onClick={async ()=>{
            if (!form.email) return alert("Email required");
            setSaving(true);
            try {
              await fetch(`${API_BASE}/api/admin/users`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(form) });
              onClose(); onCreated?.();
            } catch(e){ alert("Create failed"); } finally { setSaving(false); }
          }} className="px-3 py-2 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white disabled:opacity-50">
            Create
          </button>
        </div>
      </div>
    </Modal>
  );
}

function ImportModal({ onClose, onImported }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  return (
    <Modal title="Import users (CSV)" onClose={onClose}>
      <div className="space-y-3">
        <input type="file" accept=".csv" onChange={(e)=>setFile(e.target.files?.[0] || null)} className="block w-full text-gray-300"/>
        <div className="text-gray-400 text-sm">Expected headers: name,email,role,status</div>
        <div className="pt-2 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded bg-white/10 text-gray-200 hover:bg-white/20">Cancel</button>
          <button disabled={!file || busy} onClick={async ()=>{
            if (!file) return;
            setBusy(true);
            const fd = new FormData(); fd.append("file", file);
            try {
              await fetch(`${API_BASE}/api/admin/users/import`, { method:"POST", body: fd });
              onClose(); onImported?.();
            } catch(e){ alert("Import failed"); } finally { setBusy(false); }
          }} className="px-3 py-2 rounded bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50">
            Import
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ---------------- Small UI primitives ---------------- */

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}/>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-slate-900 rounded-2xl border border-white/20 shadow-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white font-semibold">{title}</div>
            <button onClick={onClose} className="px-2 py-1 rounded bg-white/10 text-gray-300 hover:text-white">Close</button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type="text" }) {
  return (
    <label className="block">
      <div className="text-sm text-gray-300 mb-1">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full p-2.5 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
      />
    </label>
  );
}

function Select({ label, value, onChange, options=[] }) {
  return (
    <label className="block">
      <div className="text-sm text-gray-300 mb-1">{label}</div>
      <select value={value} onChange={(e)=>onChange(e.target.value)} className="w-full p-2.5 bg-black/30 border border-white/20 rounded-lg text-white">
        {options.map(o=> <option key={o} value={o}>{title(o)}</option>)}
      </select>
    </label>
  );
}

function RolePicker({ onPick }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  useEffect(() => {
    const f = (e) => { if (!btnRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("click", f);
    return () => document.removeEventListener("click", f);
  }, []);
  return (
    <div className="relative" ref={btnRef}>
      <button onClick={()=>setOpen(o=>!o)} className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-gray-200">
        Set role ▾
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-40 bg-slate-900 border border-white/20 rounded-lg p-1">
          {ROLES.map((r)=>(
            <button key={r} onClick={()=>{ onPick?.(r); setOpen(false); }} className="w-full text-left px-3 py-2 rounded text-gray-200 hover:bg-white/10">
              {title(r)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Utilities ---------------- */

function title(s) {
  if (!s) return "";
  return String(s).replace(/_/g," ").replace(/\b\w/g,(m)=>m.toUpperCase());
}
function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString();
}
function fmtWhen(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString();
}
async function jsonOrThrow(res) {
  if (!res.ok) {
    const txt = await res.text().catch(()=>`${res.status} ${res.statusText}`);
    throw new Error(txt || `${res.status} ${res.statusText}`);
  }
  return res.json();
}
async function post(url, bump) {
  await fetch(url, { method:"POST" });
  bump?.((n)=>n+1);
}
async function removeUser(id, bump) {
  if (!window.confirm("Delete this user?")) return;
  await fetch(`${API_BASE}/api/admin/users/${id}`, { method:"DELETE" });
  bump?.((n)=>n+1);
}

/* Debounce hook */
function useDebounce(value, delay=300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(()=>setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

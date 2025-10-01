// src/admin/AdminLayout.jsx
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

/* Bigger brain mark (matches login vibe) */
function BrainMark({ size = 56 }) { // <= change this number to adjust globally
  const px = `${size}px`;
  return (
    <div
      className="rounded-3xl shadow-lg grid place-items-center"
      style={{
        width: px,
        height: px,
        background:
          "linear-gradient(135deg, rgba(139,92,246,.9), rgba(236,72,153,.9))",
        border: "1px solid rgba(255,255,255,.25)",
      }}
      aria-label="EduPath"
      title="EduPath"
    >
      <span style={{ fontSize: size * 0.58, lineHeight: 1 }}>🧠</span>
    </div>
  );
}


/* Sidebar link */
function SideLink({ to, end, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 px-3 py-2 rounded-xl transition",
          isActive
            ? "bg-white/15 text-cyan-300 shadow-inner ring-1 ring-white/20"
            : "text-gray-300 hover:text-white hover:bg-white/10",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

/* Tiny avatar from initials when no image */
function Avatar({ name, url }) {
  const letter = (name || "?").trim().charAt(0).toUpperCase();
  return url ? (
    <img src={url} alt="" className="w-8 h-8 rounded-full object-cover" />
  ) : (
    <div className="w-9 h-9 rounded-full bg-white/15 grid place-items-center border border-white/20">
      <span className="text-white/90 text-sm">{letter}</span>
    </div>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Parallax glow (subtle)
  const shellRef = useRef(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const el = shellRef.current;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      setParallax({ x: dx * 30, y: dy * 30 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={shellRef} className="relative min-h-screen ep-bg overflow-hidden">
      {/* Glow orbs following cursor */}
      <div
        className="ep-orb ep-orb--violet"
        style={{ left: "-10%", top: "-12%", transform: `translate(${parallax.x}px, ${parallax.y}px)` }}
      />
      <div
        className="ep-orb ep-orb--pink"
        style={{ right: "-12%", top: "12%", transform: `translate(${parallax.x * -0.6}px, ${parallax.y * -0.6}px)` }}
      />
      <div
        className="ep-orb ep-orb--cyan"
        style={{ left: "12%", bottom: "-18%", transform: `translate(${parallax.x * 0.4}px, ${parallax.y * 0.4}px)` }}
      />
      <div className="ep-grid absolute inset-0 pointer-events-none" />

      {/* === Sidebar === */}
      <aside className="fixed left-0 top-0 h-full w-72 ep-glass border-r border-white/20 flex flex-col z-40">
        <div className="px-4 pt-4 pb-3 flex items-center gap-3">
          <BrainMark />
          {/* remove "EduPath Admin" text per request */}
        </div>

        <nav className="px-3 py-2 space-y-1">
          <SideLink to="/admin" end>🏠 <span>Dashboard</span></SideLink>
          <SideLink to="/admin/users">👥 <span>Users</span></SideLink>
          <SideLink to="/admin/roles">🔑 <span>Roles</span></SideLink>
          <SideLink to="/admin/settings">⚙️ <span>Settings</span></SideLink>
        </nav>

        <div className="mt-auto px-3 pb-3">
          <div className="ep-glass p-3 rounded-xl">
            <div className="flex items-center gap-3">
              <Avatar name={user?.username || user?.email} url={user?.avatarUrl} />
              <div>
                <div className="text-white font-medium leading-tight">
                  {user?.username || "Admin"}
                </div>
                <div className="text-xs ep-subtle leading-tight">
                  {user?.role || "admin"}
                </div>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="w-full ep-btn-primary mt-3"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* === Top bar (profile only) === */}
      <header className="sticky top-0 z-30 ml-72">
        <div className="px-6 md:px-10 pt-4">
          <div className="ep-glass rounded-xl px-4 py-3 flex items-center justify-end gap-3">
            {/* Only keep the profile on the header */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-white/90">{user?.username || "Admin"}</div>
                <div className="text-xs ep-subtle">{user?.email || ""}</div>
              </div>
              <Avatar name={user?.username || user?.email} url={user?.avatarUrl} />
            </div>
          </div>
        </div>
      </header>

      {/* === Main content area === */}
      <main className="ml-72">
        <div className="px-6 md:px-10 py-8">
          {/* no big wrapper card now; let each page render its own glass panels */}
          <div className="ep-fade">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

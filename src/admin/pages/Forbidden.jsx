// src/admin/pages/Forbidden.jsx
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

export default function Forbidden() {
  const { user, logout, login } = useAuthStore();
  const nav = useNavigate();

  async function switchAccount() {
    logout();
    nav("/login", { replace: true });
  }

  async function demoAdmin() {
    const res = await login({ username: "admin", password: "demo" });
    if (res?.ok) nav("/admin", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="max-w-xl text-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-10">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-4xl font-bold text-white mb-3">403 — Forbidden</h1>
        <p className="text-gray-300 mb-6">
          {user
            ? `Signed in as ${user.username} (${user.role}). You need admin rights to view this page.`
            : "You don’t have permission to access this area."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={switchAccount}
            className="px-5 py-3 rounded-lg bg-white/10 text-gray-200 hover:bg-white/20 transition"
          >
            Switch Account
          </button>
          <button
            onClick={demoAdmin}
            className="px-5 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white transition"
          >
            Continue as Demo Admin
          </button>
        </div>
      </div>
    </div>
  );
}

// src/admin/pages/Login.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();                  // <- call hook on its own line
  const from = location.state?.from?.pathname || "/admin"; // <- derive after

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await login(form);
    if (res?.ok) navigate(from, { replace: true });
    else setError(res?.message || "Invalid credentials");
  }

  async function demoAdmin() {
    const res = await login({ username: "admin", password: "demo" });
    if (res?.ok) navigate("/admin", { replace: true });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🧠</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            EduPath Admin
          </h1>
          <p className="text-gray-300 mt-1">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Username</label>
            <input
              className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              name="username"
              value={form.username}
              onChange={(e)=>setForm(f=>({...f,[e.target.name]:e.target.value}))}
              placeholder="e.g. admin"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              name="password"
              value={form.password}
              onChange={(e)=>setForm(f=>({...f,[e.target.name]:e.target.value}))}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all"
          >
            Sign in
          </button>

          
        </form>
      </div>
    </div>
  );
}

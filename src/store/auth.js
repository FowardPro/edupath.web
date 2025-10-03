import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("access") || null,
  role: localStorage.getItem("role") || null,

  login: async ({ username, password }) => {
    try {
      const res = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        return { ok: false, message: "Invalid username or password" };
      }

      const data = await res.json();

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("role", data.role);

      set({ user: username, token: data.access, role: data.role });
      return { ok: true, role: data.role };
    } catch (err) {
      console.error(err);
      return { ok: false, message: "Server error" };
    }
  },

  logout: () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    set({ user: null, token: null, role: null });
  },
}));

// src/store/auth.js
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Persist user in localStorage so refresh keeps you logged in
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("auth_user") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem("auth_user", JSON.stringify(user));
      else localStorage.removeItem("auth_user");
    } catch {}
  }, [user]);

  // --- Demo auth (replace with real API) ---
  const login = async ({ username, password }) => {
    if (!username || !password) {
      return { ok: false, message: "Username and password are required" };
    }
    // Simple demo role mapping:
    //  - "admin" → admin
    //  - "candidate" → candidate
    //  - anything else → user
    const role =
      username.toLowerCase() === "admin"
        ? "admin"
        : username.toLowerCase() === "candidate"
        ? "candidate"
        : "user";

    const nextUser = { username, role };
    setUser(nextUser);
    return { ok: true, user: nextUser };
  };

  const logout = () => setUser(null);

  const hasRole = (roles = []) => {
    if (!roles || roles.length === 0) return true; // no restriction
    return roles.includes(user?.role);
  };

  const value = useMemo(
    () => ({ user, login, logout, hasRole }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

// Back-compat alias so files importing `useAuthStore` keep working
export const useAuthStore = useAuth;

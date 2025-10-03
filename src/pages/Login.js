import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import "../components/Auth/SocialLoginButtons.css";
import SocialLoginButtons from "../components/Auth/SocialLoginButtons";
import "./Login.css";

export default function Login({ setIsLoggedIn, setRole }) {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await login(form);
    if (res?.ok) {
      localStorage.setItem("role", res.role);
      setIsLoggedIn(true);
      setRole(res.role);

      // Redirect by role
      if (res.role === "admin") navigate("/admin-portal", { replace: true });
      else if (res.role === "staff") navigate("/staff-portal", { replace: true });
      else if (res.role === "student") navigate("/student-portal", { replace: true });
      else navigate(from, { replace: true });
    } else {
      setError(res?.message || "Invalid credentials");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🧠</div>
          <h1 className="login-title">EduPath</h1>
          <p className="login-subtitle">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label className="login-label">Username</label>
            <input
              className="login-input"
              name="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
              placeholder=""
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="login-label">Password</label>
            <input
              type="password"
              className="login-input"
              name="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
              placeholder=""
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-button">
            Sign in
          </button>

          <div className="login-links">
            <Link to="/register">Create an account</Link>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        </form>

        <div className="login-divider">Or continue with</div>
        <SocialLoginButtons />
      </div>
    </div>
  );
}

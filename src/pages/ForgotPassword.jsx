import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call backend for reset
    setMessage("If an account exists, a reset link was sent.");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Reset Password</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            className="login-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Send Reset Link</button>
        </form>
        {message && <div className="login-message">{message}</div>}
        <div className="login-links">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}

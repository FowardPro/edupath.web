// src/components/Auth/SocialLoginButtons.jsx
import React from "react";
import { FaGoogle, FaGithub, FaFacebook, FaLinkedin } from "react-icons/fa";
import "./SocialLoginButtons.css";

export default function SocialLoginButtons() {
  return (
    <div className="social-login">
      <div className="social-buttons">
        <button className="social-btn google" title="Login with Google">
          <FaGoogle />
        </button>
        <button className="social-btn github" title="Login with GitHub">
          <FaGithub />
        </button>
        <button className="social-btn facebook" title="Login with Facebook">
          <FaFacebook />
        </button>
        <button className="social-btn linkedin" title="Login with LinkedIn">
          <FaLinkedin />
        </button>
      </div>
    </div>
  );
}

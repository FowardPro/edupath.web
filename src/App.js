// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/Landing/LandingPage.jsx";
import AITools from "./components/AITools/AITools.jsx";
import CareerExplorer from "./components/CareerExplorer/CareerExplorer.jsx";
import QuizGenerator from "./components/QuizGenerator/QuizGenerator.jsx";
import Login from "./pages/Login.js";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import PhotoGallery from "./components/Gallery/PhotoGallery.jsx"; // ✅ added
import "./App.css";
import Connect from "./pages/Connect.jsx";
import StaffManagement from "./components/Admin/pages/StaffManagement.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    !!localStorage.getItem("access")
  );
  const [role, setRole] = React.useState(localStorage.getItem("role"));

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} />} />

          {/* Locked routes */}
          <Route
            path="/ai-tools"
            element={
              isLoggedIn ? (
                <AITools />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
              )
            }
          />
          <Route
  path="/connect"
  element={
    isLoggedIn ? <Connect /> : <Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
  }
/>
<Route
  path="/admin/staff-management"
  element={
    isLoggedIn && role === "admin" ? (
      <StaffManagement />
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>
/>
          <Route
            path="/career-explorer"
            element={
              isLoggedIn ? (
                <CareerExplorer />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
              )
            }
          />
          <Route
            path="/quiz-generator"
            element={
              isLoggedIn ? (
                <QuizGenerator />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
              )
            }
          />

          {/* Auth pages */}
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Role-based portals */}
          <Route
            path="/admin-portal"
            element={
              isLoggedIn && role === "admin" ? (
                <h1>Admin Panel</h1>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/staff-portal"
            element={
              isLoggedIn && role === "staff" ? (
                <h1>Staff Portal</h1>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/student-portal"
            element={
              isLoggedIn && role === "student" ? (
                <h1>Student Portal</h1>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* ✅ Photo Gallery */}
          <Route
            path="/photo-gallery"
            element={
              isLoggedIn ? (
                <PhotoGallery />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

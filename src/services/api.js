// src/services/api.js
// Central API service for EduPath frontend
// Handles JWT token storage & requests to Django backend

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000/api";

// 🔹 Helper: Get JWT access token
function getAccessToken() {
  return localStorage.getItem("access");
}

// 🔹 Generic request function
async function request(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Attach JWT token if available
  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  // Auto logout if unauthorized
  if (res.status === 401) {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    window.location.href = "/login";
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "API request failed");
  }

  return res.json();
}

//
// ========== 🔹 Auth APIs ==========
//
export const AuthAPI = {
  login: (data) =>
    request("/auth/login/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data) =>
    request("/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  forgotPassword: (data) =>
    request("/auth/forgot-password/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

//
// ========== 🔹 User Management (Admin/Staff) ==========
//
export const UserAPI = {
  list: () => request("/users/"),
  create: (data) =>
    request("/users/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/users/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/users/${id}/`, {
      method: "DELETE",
    }),
};

//
// ========== 🔹 Staff: Classes & Assignments ==========
//
export const StaffAPI = {
  getClasses: () => request("/staff/classes/"),
  createClass: (data) =>
    request("/staff/classes/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateClass: (id, data) =>
    request(`/staff/classes/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteClass: (id) =>
    request(`/staff/classes/${id}/`, { method: "DELETE" }),

  getAssignments: () => request("/staff/assignments/"),
  createAssignment: (data) =>
    request("/staff/assignments/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateAssignment: (id, data) =>
    request(`/staff/assignments/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteAssignment: (id) =>
    request(`/staff/assignments/${id}/`, { method: "DELETE" }),

  gradeAssignment: (id, grade) =>
    request(`/staff/assignments/${id}/grade/`, {
      method: "POST",
      body: JSON.stringify({ grade }),
    }),
};

//
// ========== 🔹 Communication APIs (Announcements) ==========
//
export const CommunicationAPI = {
  list: () => request("/announcements/"),
  create: (data) =>
    request("/announcements/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (id) => request(`/announcements/${id}/`, { method: "DELETE" }),
};

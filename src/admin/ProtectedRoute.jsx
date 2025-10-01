// src/admin/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export default function ProtectedRoute({ roles = [] }) {
  const { user, hasRole } = useAuthStore();
  const location = useLocation();

  // Not logged in → go to login, remember where we came from
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Logged in but missing required role(s) → 403
  if (roles.length > 0 && !hasRole(roles)) {
    return <Navigate to="/403" replace />;
  }

  // Authorized → render nested routes
  return <Outlet />;
}

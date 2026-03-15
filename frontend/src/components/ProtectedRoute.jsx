import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role = "user" }) {
  const token = localStorage.getItem("token");
  const stored = localStorage.getItem(role);

  // If there is no token or the expected role item, redirect to the appropriate login page
  if (!token || !stored) {
    return (
      <Navigate to={role === "driver" ? "/captain-login" : "/login"} replace />
    );
  }

  return children;
}

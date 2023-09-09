import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export const ProtectedRoutes = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
};

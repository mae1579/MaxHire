import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    toast.error("Musisz być zalogowanym!");
    return <Navigate to="/login" replace />;
  }

  if (roles?.length) {
    const role = String(user.role || "").toLowerCase();
    const allowed = roles.map((item) => String(item).toLowerCase());
    if (!allowed.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
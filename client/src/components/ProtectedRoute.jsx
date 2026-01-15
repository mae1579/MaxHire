import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    toast.error("Musisz być zalogowanym!");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
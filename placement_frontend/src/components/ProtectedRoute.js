import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function ProtectedRoute({ role, children }) {
  const { authed, role: currentRole } = useAuth();
  if (!authed) return <Navigate to="/auth/signin" replace />;
  if (role && currentRole !== role) return <Navigate to="/" replace />;
  return children;
}

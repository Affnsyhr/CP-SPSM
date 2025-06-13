import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    // Redirect ke login jika belum login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect ke dashboard sesuai role jika tidak memiliki akses
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'super_admin':
        return <Navigate to="/super-admin/dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
} 
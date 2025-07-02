import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('ProtectedRoute user:', user, 'allowedRoles:', allowedRoles);

  if (!user) {
    // Redirect ke login jika belum login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect ke dashboard sesuai role jika tidak memiliki akses
    switch (user.role) {
      case 'admin_tu':
        return <Navigate to="/admin/dashboard" replace />;
      case 'superadmin':
        return <Navigate to="/super-admin/dashboard" replace />;
      case 'kepala_sekolah':
        return <Navigate to="/headmaster/dashboard" replace />;
      case 'orang_tua':
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
} 
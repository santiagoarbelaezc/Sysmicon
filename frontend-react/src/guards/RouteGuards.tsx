import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthService } from '../services/auth.service';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuthService();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuthService();
  if (isLoggedIn) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerified?: boolean;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireVerified = false,
  requiredRole
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireVerified && user && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (requiredRole && user && user.role !== requiredRole && user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

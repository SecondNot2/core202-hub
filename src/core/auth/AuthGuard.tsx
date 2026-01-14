/**
 * Auth Guard Component - Protects routes that require authentication
 */

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  requiredPermissions?: string[];
  requiredRole?: string;
  fallback?: React.ReactNode;
}

/**
 * Protects routes that require authentication
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  redirectTo = "/login",
  requireAuth = true,
  requiredPermissions = [],
  requiredRole,
  fallback = <AuthLoadingFallback />,
}) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  // Show loading state while checking auth
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role
  if (requiredRole && user?.role !== requiredRole && user?.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check permissions
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(
      (permission) =>
        user?.role === "admin" || user?.permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

/**
 * Redirect away from auth pages if already authenticated
 */
export const GuestGuard: React.FC<{
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}> = ({ children, redirectTo = "/", fallback = <AuthLoadingFallback /> }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (isAuthenticated) {
    // Redirect to the page they were trying to visit, or home
    const from =
      (location.state as { from?: Location })?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

/**
 * Default loading fallback for auth guards
 */
const AuthLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-2 text-sm text-gray-500">Checking authentication...</p>
    </div>
  </div>
);

export default AuthGuard;

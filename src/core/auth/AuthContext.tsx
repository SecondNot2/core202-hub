/**
 * Auth Context - Provides auth utilities via React Context
 */

import React, { createContext, useContext, useEffect } from "react";
import { useAuthStore } from "./store";
import type { User, AuthState, AuthActions } from "@shared/types";

// ============================================================================
// Context
// ============================================================================

interface AuthContextType extends AuthState, AuthActions {
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ============================================================================
// Provider
// ============================================================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const store = useAuthStore();

  // Check auth on mount
  useEffect(() => {
    store.checkAuth();
  }, []);

  const hasPermission = (permission: string): boolean => {
    if (!store.user) return false;
    if (store.user.role === "admin") return true;
    return store.user.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!store.user) return false;
    if (store.user.role === "admin") return true;
    return store.user.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        ...store,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================================
// Hook
// ============================================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Hook to get current user (throws if not authenticated)
 */
export function useCurrentUser(): User {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) {
    throw new Error("User is not authenticated");
  }
  return user;
}

/**
 * Hook to check if current user has a permission
 */
export function useHasPermission(permission: string): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}

/**
 * Hook to check if current user has a role
 */
export function useHasRole(role: string): boolean {
  const { hasRole } = useAuth();
  return hasRole(role);
}

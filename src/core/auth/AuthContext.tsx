/**
 * Auth Context - Provides auth utilities via React Context
 * Integrated with Supabase Auth state changes
 */

import React, { createContext, useContext, useEffect } from "react";
import { useAuthStore, subscribeToAuthChanges } from "./store";
import { startHubSettingsSync, stopHubSettingsSync } from "@core/store/hub";
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

  // Check auth on mount and subscribe to Supabase auth changes
  useEffect(() => {
    store.checkAuth();

    // Subscribe to auth state changes from Supabase
    const unsubscribe = subscribeToAuthChanges((isAuthenticated, userId) => {
      if (isAuthenticated && userId) {
        // Re-check auth to refresh user data
        store.checkAuth();
        // Start hub settings sync
        startHubSettingsSync(userId);
      } else if (!isAuthenticated) {
        // Stop hub settings sync
        stopHubSettingsSync();
        // Clear local state when signed out
        useAuthStore.setState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    });

    // If already authenticated on mount, start sync
    const currentState = useAuthStore.getState();
    if (currentState.isAuthenticated && currentState.user?.id) {
      startHubSettingsSync(currentState.user.id);
    }

    return () => {
      unsubscribe();
      stopHubSettingsSync();
    };
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

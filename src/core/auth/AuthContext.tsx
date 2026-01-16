/**
 * Auth Context - Provides auth utilities via React Context
 * Integrated with Supabase Auth state changes
 */

import React, { createContext, useContext, useEffect } from "react";
import { useAuthStore, subscribeToAuthChanges } from "./store";
import { supabase } from "@core/supabase/client";
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
    // Get persisted state - if already authenticated, don't show loading
    const persistedState = useAuthStore.getState();

    // Only check auth if not already authenticated from persisted state
    // This prevents "Checking authentication..." flash when switching tabs
    if (!persistedState.isAuthenticated) {
      store.checkAuth();
    } else {
      // Already authenticated from localStorage, just ensure isLoading is false
      useAuthStore.setState({ isLoading: false });

      // Silently verify session in background without showing loading
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          // Session expired, clear auth state
          useAuthStore.setState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      });

      // Start hub settings sync
      if (persistedState.user?.id) {
        startHubSettingsSync(persistedState.user.id);
      }
    }

    // Subscribe to auth state changes from Supabase
    const unsubscribe = subscribeToAuthChanges((isAuthenticated, userId) => {
      if (isAuthenticated && userId) {
        const current = useAuthStore.getState();

        // Only run full checkAuth (which triggers loading screen) if:
        // 1. We're not currently authenticated in our store
        // 2. Or the user ID has changed (different user logged in)
        if (!current.isAuthenticated || current.user?.id !== userId) {
          store.checkAuth();
        }

        // Always ensure sync is running if we are authenticated
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

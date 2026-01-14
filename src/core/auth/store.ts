/**
 * Authentication Store - Manages user authentication state
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthState, AuthActions } from "@shared/types";

// ============================================================================
// Auth Store
// ============================================================================

interface AuthStore extends AuthState, AuthActions {}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      isLoading: true,
      user: null,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Replace with actual authentication logic
          // This is a mock implementation for development
          await mockDelay(500);

          if (email && password) {
            const mockUser = createMockUser(email);
            set({
              isAuthenticated: true,
              isLoading: false,
              user: mockUser,
              error: null,
            });
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Login failed";
          set({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: message,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          // TODO: Replace with actual logout logic
          await mockDelay(200);

          set({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: null,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Logout failed";
          set({ isLoading: false, error: message });
        }
      },

      checkAuth: async () => {
        const { user } = get();

        set({ isLoading: true });

        try {
          // TODO: Replace with actual token validation
          await mockDelay(300);

          // If we have a persisted user, consider them authenticated
          if (user) {
            set({
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              isAuthenticated: false,
              isLoading: false,
              user: null,
              error: null,
            });
          }
        } catch (error) {
          set({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: null,
          });
        }
      },
    }),
    {
      name: "core202-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ============================================================================
// Helper Functions
// ============================================================================

function mockDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createMockUser(email: string): User {
  const isAdmin = email.toLowerCase().includes("admin");

  return {
    id: `user_${Date.now()}`,
    email,
    name: email.split("@")[0],
    role: isAdmin ? "admin" : "user",
    permissions: isAdmin
      ? ["admin", "read", "write", "delete"]
      : ["read", "write"],
    avatar: undefined,
    metadata: {
      createdAt: new Date().toISOString(),
    },
  };
}

// ============================================================================
// Auth Selectors (for performance optimization)
// ============================================================================

export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) =>
  state.isAuthenticated;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectAuthError = (state: AuthStore) => state.error;

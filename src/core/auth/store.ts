/**
 * Authentication Store - Manages user authentication state via Supabase
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@core/supabase/client";
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
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            // Fetch profile data
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", data.user.id)
              .single();

            const appUser: User = {
              id: data.user.id,
              email: data.user.email || "",
              name:
                profile?.full_name || data.user.email?.split("@")[0] || "User",
              avatar: profile?.avatar_url || undefined,
              role: "user",
              permissions: ["read", "write"],
              metadata: {
                createdAt: data.user.created_at,
              },
            };

            set({
              isAuthenticated: true,
              isLoading: false,
              user: appUser,
              error: null,
            });
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
          const { error } = await supabase.auth.signOut();
          if (error) throw error;

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
        set({ isLoading: true });

        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session?.user) {
            // Fetch profile data
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            const appUser: User = {
              id: session.user.id,
              email: session.user.email || "",
              name:
                profile?.full_name ||
                session.user.email?.split("@")[0] ||
                "User",
              avatar: profile?.avatar_url || undefined,
              role: "user",
              permissions: ["read", "write"],
              metadata: {
                createdAt: session.user.created_at,
              },
            };

            set({
              isAuthenticated: true,
              isLoading: false,
              user: appUser,
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

      updateProfile: async (data: Partial<User>) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true, error: null });

        try {
          const { error } = await supabase
            .from("profiles")
            .update({
              full_name: data.name,
              avatar_url: data.avatar,
            })
            .eq("id", user.id);

          if (error) throw error;

          set({
            user: { ...user, ...data },
            isLoading: false,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Update failed";
          set({ isLoading: false, error: message });
          throw error;
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
// Auth State Change Listener (for external subscription)
// ============================================================================

export function subscribeToAuthChanges(
  callback: (isAuthenticated: boolean, userId: string | null) => void
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    // Only react to actual sign-in/sign-out events
    // Ignore TOKEN_REFRESHED to prevent re-checking on tab focus
    if (event === "SIGNED_IN" && session?.user) {
      callback(true, session.user.id);
    } else if (event === "SIGNED_OUT") {
      callback(false, null);
    }
    // Ignore: TOKEN_REFRESHED, USER_UPDATED, PASSWORD_RECOVERY, MFA_CHALLENGE_VERIFIED
    // These don't require re-checking authentication state
  });

  return () => subscription.unsubscribe();
}

// ============================================================================
// Sign Up Function (used by Login page)
// ============================================================================

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string
): Promise<{ success: boolean; message: string }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || email.split("@")[0],
      },
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  if (data.user?.identities?.length === 0) {
    return { success: false, message: "Email already registered" };
  }

  return { success: true, message: "Account created! You can now sign in." };
}

// ============================================================================
// Auth Selectors (for performance optimization)
// ============================================================================

export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) =>
  state.isAuthenticated;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectAuthError = (state: AuthStore) => state.error;

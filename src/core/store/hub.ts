/**
 * Hub Store - Global state management for the application shell
 */

import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import type { HubState, HubActions, Notification } from "@shared/types";

// ============================================================================
// Hub Store
// ============================================================================

interface HubStore extends HubState, HubActions {}

export const useHubStore = create<HubStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        sidebarCollapsed: false,
        theme: "system",
        notifications: [],
        commands: [],
        sharedState: {},

        // Actions
        toggleSidebar: () => {
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
        },

        setSidebarCollapsed: (collapsed) => {
          set({ sidebarCollapsed: collapsed });
        },

        setTheme: (theme) => {
          set({ theme });
          applyTheme(theme);
        },

        addNotification: (notification) => {
          const id = `notification_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          const newNotification: Notification = { ...notification, id };

          set((state) => ({
            notifications: [...state.notifications, newNotification],
          }));

          // Auto-remove after duration (default 5 seconds)
          const duration = notification.duration ?? 5000;
          if (duration > 0) {
            setTimeout(() => {
              get().removeNotification(id);
            }, duration);
          }

          return id;
        },

        removeNotification: (id) => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }));
        },

        registerCommand: (command) => {
          // Check if command already exists
          const existing = get().commands.find((c) => c.id === command.id);
          if (existing) {
            console.warn(`Command "${command.id}" already registered`);
            return () => {};
          }

          set((state) => ({
            commands: [...state.commands, command],
          }));

          // Return unregister function
          return () => get().unregisterCommand(command.id);
        },

        unregisterCommand: (id) => {
          set((state) => ({
            commands: state.commands.filter((c) => c.id !== id),
          }));
        },

        setSharedState: <T>(key: string, value: T) => {
          set((state) => ({
            sharedState: { ...state.sharedState, [key]: value },
          }));
        },

        getSharedState: <T>(key: string): T | undefined => {
          return get().sharedState[key] as T | undefined;
        },
      }),
      {
        name: "core202-hub",
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
        }),
      }
    )
  )
);

// ============================================================================
// Theme Helper
// ============================================================================

function applyTheme(theme: "light" | "dark" | "system"): void {
  const root = document.documentElement;

  if (theme === "system") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
}

// Initialize theme on load
if (typeof window !== "undefined") {
  const storedState = localStorage.getItem("core202-hub");
  if (storedState) {
    try {
      const { state } = JSON.parse(storedState);
      if (state?.theme) {
        applyTheme(state.theme);
      }
    } catch {
      // Ignore parsing errors
    }
  }

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      const currentTheme = useHubStore.getState().theme;
      if (currentTheme === "system") {
        applyTheme("system");
      }
    });
}

// ============================================================================
// Selectors
// ============================================================================

export const selectSidebarCollapsed = (state: HubStore) =>
  state.sidebarCollapsed;
export const selectTheme = (state: HubStore) => state.theme;
export const selectNotifications = (state: HubStore) => state.notifications;
export const selectCommands = (state: HubStore) => state.commands;

/**
 * Plugin API Factory - Creates the API object passed to plugins
 */

import type { PluginAPI, User, Command } from "@shared/types";
import { useHubStore } from "@core/store";
import { useAuthStore } from "@core/auth";

// Event bus for plugin communication
type EventCallback = (payload?: unknown) => void;
const eventBus = new Map<string, Set<EventCallback>>();

/**
 * Creates a PluginAPI instance for a specific plugin
 */
export function createPluginAPI(
  pluginId: string,
  navigate: (path: string) => void
): PluginAPI {
  return {
    getUser: (): User | null => {
      return useAuthStore.getState().user;
    },

    hasPermission: (permission: string): boolean => {
      const user = useAuthStore.getState().user;
      if (!user) return false;
      if (user.role === "admin") return true;
      return user.permissions.includes(permission);
    },

    navigate,

    notify: (message, type = "info") => {
      useHubStore.getState().addNotification({ message, type });
    },

    getSharedState: <T>(key: string): T | undefined => {
      return useHubStore.getState().getSharedState<T>(key);
    },

    setSharedState: <T>(key: string, value: T): void => {
      useHubStore.getState().setSharedState(key, value);
    },

    subscribeToState: <T>(
      key: string,
      callback: (value: T) => void
    ): (() => void) => {
      // Subscribe to zustand store changes for the specific key
      return useHubStore.subscribe(
        (state) => state.sharedState[key] as T,
        callback
      );
    },

    registerCommand: (command: Command): (() => void) => {
      // Prefix command ID with plugin ID for namespacing
      const namespacedCommand = {
        ...command,
        id: `${pluginId}:${command.id}`,
      };
      return useHubStore.getState().registerCommand(namespacedCommand);
    },

    emit: (event: string, payload?: unknown): void => {
      const namespacedEvent = `${pluginId}:${event}`;
      const callbacks = eventBus.get(namespacedEvent);
      if (callbacks) {
        callbacks.forEach((cb) => cb(payload));
      }

      // Also emit global event
      const globalCallbacks = eventBus.get(event);
      if (globalCallbacks) {
        globalCallbacks.forEach((cb) => cb(payload));
      }
    },

    on: (event: string, callback: EventCallback): (() => void) => {
      if (!eventBus.has(event)) {
        eventBus.set(event, new Set());
      }
      eventBus.get(event)!.add(callback);

      return () => {
        eventBus.get(event)?.delete(callback);
      };
    },
  };
}

/**
 * Clear all event listeners (useful for testing)
 */
export function clearEventBus(): void {
  eventBus.clear();
}

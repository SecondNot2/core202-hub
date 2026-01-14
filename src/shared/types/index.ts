/**
 * Core type definitions for the Core202 Hub plugin system.
 * These types define the contract between the hub and plugins.
 */

import type { ComponentType } from "react";
import type { RouteObject } from "react-router-dom";

// ============================================================================
// Plugin Manifest Types
// ============================================================================

/**
 * Plugin status in the lifecycle
 */
export type PluginStatus =
  | "registered" // Plugin is registered but not loaded
  | "loading" // Plugin is being loaded
  | "active" // Plugin is loaded and active
  | "error" // Plugin failed to load
  | "disabled"; // Plugin is disabled by user/admin

/**
 * Permission required by a plugin
 */
export interface PluginPermission {
  id: string;
  name: string;
  description?: string;
}

/**
 * Navigation item for sidebar/menu
 */
export interface PluginNavItem {
  id: string;
  label: string;
  icon?: string;
  path: string;
  badge?: string | number;
  children?: PluginNavItem[];
}

/**
 * Plugin manifest - defines plugin metadata and configuration
 */
export interface PluginManifest {
  /** Unique plugin identifier (e.g., 'notes', 'tasks') */
  id: string;

  /** Display name */
  name: string;

  /** Plugin version */
  version: string;

  /** Brief description */
  description?: string;

  /** Plugin author */
  author?: string;

  /** Base route path (e.g., '/notes') */
  basePath: string;

  /** Icon identifier (e.g., 'notes', 'tasks', or SVG path) */
  icon?: string;

  /** Navigation items for the sidebar */
  navItems?: PluginNavItem[];

  /** Required permissions */
  permissions?: PluginPermission[];

  /** Plugin dependencies (other plugin IDs) */
  dependencies?: string[];

  /** Whether plugin is enabled by default */
  defaultEnabled?: boolean;

  /** Plugin priority for loading order (higher = first) */
  priority?: number;
}

// ============================================================================
// Plugin Module Types
// ============================================================================

/**
 * Plugin routes configuration
 */
export type PluginRoutes = RouteObject[];

/**
 * Plugin lifecycle hooks
 */
export interface PluginLifecycle {
  /** Called when plugin is being loaded */
  onLoad?: () => Promise<void> | void;

  /** Called when plugin is being unloaded */
  onUnload?: () => Promise<void> | void;

  /** Called when plugin is activated */
  onActivate?: () => Promise<void> | void;

  /** Called when plugin is deactivated */
  onDeactivate?: () => Promise<void> | void;
}

/**
 * Plugin API - what the hub exposes to plugins
 */
export interface PluginAPI {
  /** Get current authenticated user */
  getUser: () => User | null;

  /** Check if user has permission */
  hasPermission: (permission: string) => boolean;

  /** Navigate to a route */
  navigate: (path: string) => void;

  /** Show notification */
  notify: (
    message: string,
    type?: "info" | "success" | "warning" | "error"
  ) => void;

  /** Get shared state slice */
  getSharedState: <T>(key: string) => T | undefined;

  /** Set shared state slice */
  setSharedState: <T>(key: string, value: T) => void;

  /** Subscribe to shared state changes */
  subscribeToState: <T>(
    key: string,
    callback: (value: T) => void
  ) => () => void;

  /** Register a global command */
  registerCommand: (command: Command) => () => void;

  /** Emit a global event */
  emit: (event: string, payload?: unknown) => void;

  /** Subscribe to a global event */
  on: (event: string, callback: (payload?: unknown) => void) => () => void;
}

/**
 * Plugin module - the actual plugin implementation
 */
export interface PluginModule {
  /** Plugin manifest */
  manifest: PluginManifest;

  /** Plugin routes */
  routes: PluginRoutes;

  /** Plugin lifecycle hooks */
  lifecycle?: PluginLifecycle;

  /** Plugin's root component (optional, for custom layouts) */
  RootComponent?: ComponentType;

  /** Setup function called with PluginAPI */
  setup?: (api: PluginAPI) => Promise<void> | void;
}

/**
 * Lazy-loaded plugin module
 */
export type LazyPluginModule = () => Promise<{ default: PluginModule }>;

// ============================================================================
// Authentication Types
// ============================================================================

/**
 * User role
 */
export type UserRole = "admin" | "user" | "guest";

/**
 * User object
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  permissions: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Authentication state
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

/**
 * Authentication actions
 */
export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// ============================================================================
// Global State Types
// ============================================================================

/**
 * Command for command palette
 */
export interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  action: () => void;
  category?: string;
}

/**
 * Notification
 */
export interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Global hub state
 */
export interface HubState {
  /** Sidebar collapsed state */
  sidebarCollapsed: boolean;

  /** Current theme */
  theme: "light" | "dark" | "system";

  /** Active notifications */
  notifications: Notification[];

  /** Registered commands */
  commands: Command[];

  /** Shared state for plugin communication */
  sharedState: Record<string, unknown>;
}

/**
 * Global hub actions
 */
export interface HubActions {
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  addNotification: (notification: Omit<Notification, "id">) => string;
  removeNotification: (id: string) => void;
  registerCommand: (command: Command) => () => void;
  unregisterCommand: (id: string) => void;
  setSharedState: <T>(key: string, value: T) => void;
  getSharedState: <T>(key: string) => T | undefined;
}

// ============================================================================
// Plugin Registry Types
// ============================================================================

/**
 * Registered plugin entry in the registry
 */
export interface RegisteredPlugin {
  manifest: PluginManifest;
  status: PluginStatus;
  module?: PluginModule;
  error?: Error;
  loader: LazyPluginModule;
}

/**
 * Plugin registry state
 */
export interface PluginRegistryState {
  plugins: Map<string, RegisteredPlugin>;
  loadingPlugins: Set<string>;
  activePlugins: Set<string>;
}

/**
 * Plugin registry actions
 */
export interface PluginRegistryActions {
  register: (manifest: PluginManifest, loader: LazyPluginModule) => void;
  unregister: (pluginId: string) => void;
  load: (pluginId: string) => Promise<PluginModule | null>;
  unload: (pluginId: string) => Promise<void>;
  enable: (pluginId: string) => Promise<void>;
  disable: (pluginId: string) => Promise<void>;
  getPlugin: (pluginId: string) => RegisteredPlugin | undefined;
  getActivePlugins: () => RegisteredPlugin[];
  getAllPlugins: () => RegisteredPlugin[];
}

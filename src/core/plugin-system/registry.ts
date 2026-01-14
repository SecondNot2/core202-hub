/**
 * Plugin Registry - Manages plugin registration, loading, and lifecycle
 */

import { create } from "zustand";
import type {
  PluginManifest,
  PluginModule,
  LazyPluginModule,
  RegisteredPlugin,
  PluginStatus,
  PluginAPI,
} from "@shared/types";

// ============================================================================
// Plugin Registry Store
// ============================================================================

interface PluginRegistryStore {
  // State
  plugins: Record<string, RegisteredPlugin>;
  loadingPlugins: string[];
  activePlugins: string[];

  // Actions
  register: (manifest: PluginManifest, loader: LazyPluginModule) => void;
  unregister: (pluginId: string) => void;
  load: (pluginId: string, api: PluginAPI) => Promise<PluginModule | null>;
  unload: (pluginId: string) => Promise<void>;
  enable: (pluginId: string, api: PluginAPI) => Promise<void>;
  disable: (pluginId: string) => Promise<void>;
  setStatus: (pluginId: string, status: PluginStatus, error?: Error) => void;
  getPlugin: (pluginId: string) => RegisteredPlugin | undefined;
  getActivePlugins: () => RegisteredPlugin[];
  getAllPlugins: () => RegisteredPlugin[];
}

export const usePluginRegistry = create<PluginRegistryStore>((set, get) => ({
  plugins: {},
  loadingPlugins: [],
  activePlugins: [],

  register: (manifest, loader) => {
    const { plugins } = get();

    if (plugins[manifest.id]) {
      console.warn(`Plugin "${manifest.id}" is already registered`);
      return;
    }

    const plugin: RegisteredPlugin = {
      manifest,
      status: "registered",
      loader,
    };

    set((state) => ({
      plugins: { ...state.plugins, [manifest.id]: plugin },
    }));

    console.log(`[PluginRegistry] Registered: ${manifest.id}`);
  },

  unregister: (pluginId) => {
    const { plugins, activePlugins } = get();

    if (!plugins[pluginId]) {
      console.warn(`Plugin "${pluginId}" is not registered`);
      return;
    }

    if (activePlugins.includes(pluginId)) {
      console.warn(
        `Cannot unregister active plugin "${pluginId}". Disable it first.`
      );
      return;
    }

    set((state) => {
      const newPlugins = { ...state.plugins };
      delete newPlugins[pluginId];
      return { plugins: newPlugins };
    });

    console.log(`[PluginRegistry] Unregistered: ${pluginId}`);
  },

  load: async (pluginId, api) => {
    const { plugins, loadingPlugins } = get();
    const plugin = plugins[pluginId];

    if (!plugin) {
      console.error(`Plugin "${pluginId}" is not registered`);
      return null;
    }

    if (plugin.module) {
      return plugin.module;
    }

    if (loadingPlugins.includes(pluginId)) {
      console.warn(`Plugin "${pluginId}" is already loading`);
      return null;
    }

    // Set loading state
    set((state) => ({
      loadingPlugins: [...state.loadingPlugins, pluginId],
    }));
    get().setStatus(pluginId, "loading");

    try {
      // Load the plugin module
      const { default: module } = await plugin.loader();

      // Run lifecycle hook
      if (module.lifecycle?.onLoad) {
        await module.lifecycle.onLoad();
      }

      // Run setup with API
      if (module.setup) {
        await module.setup(api);
      }

      // Update plugin with loaded module
      set((state) => ({
        plugins: {
          ...state.plugins,
          [pluginId]: { ...state.plugins[pluginId], module, status: "active" },
        },
        loadingPlugins: state.loadingPlugins.filter((id) => id !== pluginId),
        activePlugins: [...state.activePlugins, pluginId],
      }));

      console.log(`[PluginRegistry] Loaded: ${pluginId}`);
      return module;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      get().setStatus(pluginId, "error", err);
      set((state) => ({
        loadingPlugins: state.loadingPlugins.filter((id) => id !== pluginId),
      }));

      console.error(`[PluginRegistry] Failed to load "${pluginId}":`, err);
      return null;
    }
  },

  unload: async (pluginId) => {
    const { plugins } = get();
    const plugin = plugins[pluginId];

    if (!plugin?.module) {
      return;
    }

    try {
      // Run lifecycle hook
      if (plugin.module.lifecycle?.onUnload) {
        await plugin.module.lifecycle.onUnload();
      }

      set((state) => ({
        plugins: {
          ...state.plugins,
          [pluginId]: {
            ...state.plugins[pluginId],
            module: undefined,
            status: "registered",
          },
        },
        activePlugins: state.activePlugins.filter((id) => id !== pluginId),
      }));

      console.log(`[PluginRegistry] Unloaded: ${pluginId}`);
    } catch (error) {
      console.error(`[PluginRegistry] Error unloading "${pluginId}":`, error);
    }
  },

  enable: async (pluginId, api) => {
    const { plugins } = get();
    const plugin = plugins[pluginId];

    if (!plugin) {
      console.error(`Plugin "${pluginId}" is not registered`);
      return;
    }

    if (plugin.status === "active") {
      return;
    }

    await get().load(pluginId, api);

    if (plugin.module?.lifecycle?.onActivate) {
      await plugin.module.lifecycle.onActivate();
    }
  },

  disable: async (pluginId) => {
    const { plugins } = get();
    const plugin = plugins[pluginId];

    if (!plugin?.module) {
      return;
    }

    if (plugin.module.lifecycle?.onDeactivate) {
      await plugin.module.lifecycle.onDeactivate();
    }

    get().setStatus(pluginId, "disabled");
    set((state) => ({
      activePlugins: state.activePlugins.filter((id) => id !== pluginId),
    }));

    console.log(`[PluginRegistry] Disabled: ${pluginId}`);
  },

  setStatus: (pluginId, status, error) => {
    set((state) => ({
      plugins: {
        ...state.plugins,
        [pluginId]: {
          ...state.plugins[pluginId],
          status,
          error,
        },
      },
    }));
  },

  getPlugin: (pluginId) => {
    return get().plugins[pluginId];
  },

  getActivePlugins: () => {
    const { plugins, activePlugins } = get();
    return activePlugins.map((id) => plugins[id]).filter(Boolean);
  },

  getAllPlugins: () => {
    return Object.values(get().plugins);
  },
}));

// ============================================================================
// Plugin Registration Helper
// ============================================================================

/**
 * Register a plugin with the registry
 */
export function registerPlugin(
  manifest: PluginManifest,
  loader: LazyPluginModule
): void {
  usePluginRegistry.getState().register(manifest, loader);
}

/**
 * Create a type-safe plugin definition
 */
export function definePlugin(module: PluginModule): PluginModule {
  return module;
}

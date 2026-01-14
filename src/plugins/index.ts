/**
 * Plugin Registry - Register all plugins here
 *
 * This file is the central place to register all plugins.
 * Plugins are lazy-loaded, so they won't be bundled until accessed.
 *
 * To register a new plugin:
 * 1. Import the manifest from the plugin folder
 * 2. Call registerPlugin with the manifest and a dynamic import
 */

import { registerPlugin } from "@core/plugin-system";

// Import manifests (these are small, so we import them eagerly)
import { manifest as templateManifest } from "./_template/manifest";

/**
 * Register all plugins
 *
 * Plugins are registered with their manifest and a lazy loader function.
 * The loader function returns a dynamic import of the plugin module.
 */
export function registerAllPlugins(): void {
  // Template plugin (for demonstration)
  // Comment out or remove in production
  registerPlugin(templateManifest, () => import("./_template"));

  // Add more plugins here:
  // registerPlugin(
  //   notesManifest,
  //   () => import('./notes')
  // );
  //
  // registerPlugin(
  //   tasksManifest,
  //   () => import('./tasks')
  // );
}

/**
 * Auto-load enabled plugins
 *
 * This function loads all plugins that have defaultEnabled: true
 * Call this after registering plugins to auto-load them.
 */
export async function autoLoadPlugins(): Promise<void> {
  const { usePluginRegistry } = await import("@core/plugin-system");
  const { createPluginAPI } = await import("@core/plugin-system");

  const registry = usePluginRegistry.getState();
  const plugins = registry.getAllPlugins();

  // Create a simple navigate function (will be replaced with actual router)
  const navigate = (path: string) => {
    window.location.href = path;
  };

  for (const plugin of plugins) {
    if (plugin.manifest.defaultEnabled && plugin.status === "registered") {
      const api = createPluginAPI(plugin.manifest.id, navigate);
      await registry.load(plugin.manifest.id, api);
    }
  }
}

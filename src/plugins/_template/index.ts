/**
 * Plugin Template - Use this as a starting point for new plugins
 *
 * To create a new plugin:
 * 1. Copy this folder and rename it
 * 2. Update the manifest in manifest.ts
 * 3. Define your routes in routes.tsx
 * 4. Build your components
 * 5. Register the plugin in plugins/index.ts
 */

import { definePlugin } from "@core/plugin-system";
import { manifest } from "./manifest";
import { routes } from "./routes";
import type { PluginAPI } from "@shared/types";

export default definePlugin({
  manifest,
  routes,

  lifecycle: {
    onLoad: () => {
      console.log(`[${manifest.id}] Plugin loaded`);
    },
    onUnload: () => {
      console.log(`[${manifest.id}] Plugin unloaded`);
    },
    onActivate: () => {
      console.log(`[${manifest.id}] Plugin activated`);
    },
    onDeactivate: () => {
      console.log(`[${manifest.id}] Plugin deactivated`);
    },
  },

  setup: (api: PluginAPI) => {
    // Register commands
    api.registerCommand({
      id: "hello",
      label: "Say Hello",
      description: "A sample command",
      action: () => {
        api.notify("Hello from the template plugin!", "info");
      },
    });

    // Subscribe to events
    api.on("some-event", (payload) => {
      console.log("Received event:", payload);
    });
  },
});

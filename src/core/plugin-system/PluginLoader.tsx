/**
 * Plugin Loader Component - Handles lazy loading and rendering of plugins
 */

import React, { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePluginRegistry } from "./registry";
import { createPluginAPI } from "./api";
import type { PluginModule } from "@shared/types";

interface PluginLoaderProps {
  pluginId: string;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

/**
 * Component that handles loading and rendering a plugin
 */
export const PluginLoader: React.FC<PluginLoaderProps> = ({
  pluginId,
  fallback = <PluginLoadingFallback />,
  errorFallback = <PluginErrorFallback pluginId={pluginId} />,
}) => {
  const navigate = useNavigate();
  const [module, setModule] = useState<PluginModule | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const { load, getPlugin } = usePluginRegistry();

  useEffect(() => {
    const loadPlugin = async () => {
      const plugin = getPlugin(pluginId);

      if (!plugin) {
        setError(new Error(`Plugin "${pluginId}" not found`));
        return;
      }

      if (plugin.module) {
        setModule(plugin.module);
        return;
      }

      const api = createPluginAPI(pluginId, navigate);
      const loadedModule = await load(pluginId, api);

      if (loadedModule) {
        setModule(loadedModule);
      } else {
        setError(new Error(`Failed to load plugin "${pluginId}"`));
      }
    };

    loadPlugin();
  }, [pluginId, load, getPlugin, navigate]);

  if (error) {
    return <>{errorFallback}</>;
  }

  if (!module) {
    return <>{fallback}</>;
  }

  // If plugin has a custom root component, use it
  if (module.RootComponent) {
    return (
      <Suspense fallback={fallback}>
        <module.RootComponent />
      </Suspense>
    );
  }

  // Otherwise, routes are handled by the router
  return null;
};

/**
 * Default loading fallback component
 */
const PluginLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-2 text-sm text-gray-500">Loading plugin...</p>
    </div>
  </div>
);

/**
 * Default error fallback component
 */
const PluginErrorFallback: React.FC<{ pluginId: string }> = ({ pluginId }) => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="text-red-500 text-4xl mb-2">⚠️</div>
      <h2 className="text-lg font-semibold text-gray-900">Plugin Load Error</h2>
      <p className="mt-1 text-sm text-gray-500">
        Failed to load plugin: <code>{pluginId}</code>
      </p>
    </div>
  </div>
);

export default PluginLoader;

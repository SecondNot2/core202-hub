/**
 * App - Root application component
 */

import React, { useEffect, useState } from "react";
import { AuthProvider } from "@core/auth";
import { AppRouter } from "@core/router";
import { registerAllPlugins, autoLoadPlugins } from "@plugins/index";

// Register plugins on app load
registerAllPlugins();

export const App: React.FC = () => {
  const [pluginsLoaded, setPluginsLoaded] = useState(false);

  useEffect(() => {
    // Auto-load enabled plugins
    autoLoadPlugins()
      .then(() => setPluginsLoaded(true))
      .catch((error) => {
        console.error("Failed to auto-load plugins:", error);
        setPluginsLoaded(true); // Continue anyway
      });
  }, []);

  if (!pluginsLoaded) {
    return <AppLoadingScreen />;
  }

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

/**
 * Loading screen shown while plugins are loading
 */
const AppLoadingScreen: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Loading Core202 Hub...
      </p>
    </div>
  </div>
);

export default App;

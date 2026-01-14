/**
 * App Router - Centralized routing with plugin route injection
 */

import React, { useMemo, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from "react-router-dom";
import { ShellLayout } from "@core/layout";
import { AuthGuard, GuestGuard } from "@core/auth";
import { usePluginRegistry } from "@core/plugin-system";

// Core pages
import { HomePage } from "@/pages/Home";
import { LoginPage } from "@/pages/Login";
import { SettingsPage } from "@/pages/Settings";
import { NotFoundPage } from "@/pages/NotFound";
import { UnauthorizedPage } from "@/pages/Unauthorized";

/**
 * Creates the application router with injected plugin routes
 */
export const AppRouter: React.FC = () => {
  const { getActivePlugins } = usePluginRegistry();
  const activePlugins = getActivePlugins();

  // Build router with plugin routes
  const router = useMemo(() => {
    // Collect all plugin routes
    const pluginRoutes: RouteObject[] = activePlugins.flatMap((plugin) => {
      if (!plugin.module?.routes) return [];

      // Wrap plugin routes with base path
      return plugin.module.routes.map((route) => ({
        ...route,
        path: route.path?.startsWith("/")
          ? route.path
          : `${plugin.manifest.basePath}/${route.path || ""}`.replace(
              /\/+/g,
              "/"
            ),
      }));
    });

    return createBrowserRouter([
      // Public routes (no auth required)
      {
        path: "/login",
        element: (
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        ),
      },

      // Protected routes (auth required)
      {
        path: "/",
        element: (
          <AuthGuard>
            <ShellLayout />
          </AuthGuard>
        ),
        children: [
          // Core routes
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
          {
            path: "unauthorized",
            element: <UnauthorizedPage />,
          },

          // Plugin routes (dynamically injected)
          ...pluginRoutes,

          // Catch-all 404
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ]);
  }, [activePlugins]);

  return (
    <Suspense fallback={<RouterLoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

/**
 * Loading fallback for router initialization
 */
const RouterLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

export default AppRouter;

/**
 * Shell Layout - Main application shell with sidebar and content area
 */

import React from "react";
import { Outlet } from "react-router-dom";
import { useHubStore } from "@core/store";

// Import sibling components
import Sidebar from "./Sidebar";
import Header from "./Header";
import NotificationContainer from "./NotificationContainer";

export const ShellLayout: React.FC = () => {
  const sidebarCollapsed = useHubStore((state) => state.sidebarCollapsed);

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden relative font-sans">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 bg-mesh z-0 pointer-events-none" />

      {/* Floating Sidebar */}
      <div
        className={`
        relative z-20 h-full py-4 pl-4 transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? "w-20" : "w-72"}
      `}
      >
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative z-10 overflow-hidden py-4 pr-4 pl-2">
        {/* Floating Header */}
        <div className="mb-4">
          <Header />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto rounded-3xl glass-panel p-6 shadow-inner border border-white/20 dark:border-white/5 relative scroll-smooth will-change-transform">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Notification Container */}
      <NotificationContainer />
    </div>
  );
};

export default ShellLayout;

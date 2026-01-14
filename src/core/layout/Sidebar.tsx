/**
 * Sidebar Component - Floating Glass Navigation
 */

import React from "react";
import { NavLink } from "react-router-dom";
import { usePluginRegistry } from "@core/plugin-system";
import { useHubStore } from "@core/store";

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const toggleSidebar = useHubStore((state) => state.toggleSidebar);
  const { getActivePlugins } = usePluginRegistry();
  const activePlugins = getActivePlugins();

  return (
    <aside className="h-full flex flex-col glass-panel rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
      {/* Brand / Logo Area */}
      <div className="flex h-20 items-center justify-between px-5 border-b border-white/10 dark:border-white/5">
        {!collapsed && (
          <div className="flex flex-col animate-fade-in">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
              Core202
            </span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
              Personal Hub
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-gray-500 hover:bg-white/50 hover:text-violet-600 dark:hover:bg-white/10 dark:hover:text-violet-400 transition-all duration-200"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            className="w-5 h-5 transform transition-transform duration-300"
            style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
        <div className="mb-2 px-3">
          {!collapsed && (
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Menu
            </p>
          )}
        </div>

        <NavItem
          to="/"
          icon={<HomeIcon />}
          label="Dashboard"
          collapsed={collapsed}
        />

        {activePlugins.length > 0 && (
          <>
            <div className="my-4 mx-2 border-t border-gray-200/50 dark:border-gray-700/50" />
            <div className="mb-2 px-3">
              {!collapsed && (
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Apps
                </p>
              )}
            </div>

            {activePlugins.map((plugin) => (
              <React.Fragment key={plugin.manifest.id}>
                {plugin.manifest.navItems?.map((item) => (
                  <NavItem
                    key={item.id}
                    to={item.path}
                    icon={<PluginIcon icon={item.icon} />}
                    label={item.label}
                    badge={item.badge}
                    collapsed={collapsed}
                  />
                ))}
                {!plugin.manifest.navItems && (
                  <NavItem
                    to={plugin.manifest.basePath}
                    icon={<PluginIcon icon={plugin.manifest.icon} />}
                    label={plugin.manifest.name}
                    collapsed={collapsed}
                  />
                )}
              </React.Fragment>
            ))}
          </>
        )}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-white/10 dark:border-white/5 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-md">
        <NavItem
          to="/settings"
          icon={<SettingsIcon />}
          label="Settings"
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
};

// ============================================================================
// Sub-components
// ============================================================================

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string | number;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  to,
  icon,
  label,
  badge,
  collapsed,
}) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group
      ${
        isActive
          ? "bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 text-violet-700 dark:text-violet-300 shadow-sm"
          : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200"
      }
      ${collapsed ? "justify-center" : ""}
    `}
    title={collapsed ? label : undefined}
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-r-full" />
        )}
        <span
          className={`flex-shrink-0 transition-transform duration-300 ${
            isActive ? "scale-110" : "group-hover:scale-110"
          }`}
        >
          {icon}
        </span>
        {!collapsed && (
          <span className="flex-1 truncate font-medium text-sm">{label}</span>
        )}
        {!collapsed && badge !== undefined && (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-violet-100 text-violet-600 rounded-full dark:bg-violet-900/50 dark:text-violet-300 shadow-sm border border-violet-200 dark:border-violet-800">
            {badge}
          </span>
        )}
      </>
    )}
  </NavLink>
);

// ============================================================================
// Icons (Using geometric shapes for modern look)
// ============================================================================

const HomeIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
    />
  </svg>
);

const PluginIcon: React.FC<{ icon?: string }> = ({ icon }) => {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  );
};

export default Sidebar;

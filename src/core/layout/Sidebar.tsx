/**
 * Sidebar Component - Floating Glass Navigation
 * Features: Nested menus, hover expansion, smooth animations
 */

import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { usePluginRegistry } from "@core/plugin-system";
import { useHubStore } from "@core/store";
import { useAuth } from "@core/auth";
import { useConfirm } from "@shared/components";

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const toggleSidebar = useHubStore((state) => state.toggleSidebar);
  const { getActivePlugins } = usePluginRegistry();
  const activePlugins = getActivePlugins();
  const { logout, isAuthenticated } = useAuth();
  const { confirm } = useConfirm();
  const location = useLocation();

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: "Log out?",
      message: "Are you sure you want to sign out of your session?",
      variant: "danger",
      confirmText: "Log Out",
      cancelText: "Stay",
      icon: "👋",
    });

    if (confirmed) {
      logout();
    }
  };

  return (
    <aside
      className={`
        h-full flex flex-col glass-panel rounded-3xl overflow-visible shadow-2xl 
        transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        ${collapsed ? "w-20" : "w-72"}
      `}
    >
      {/* Brand / Logo Area */}
      <div className="flex h-20 items-center justify-between px-5 border-b border-white/10 dark:border-white/5 flex-shrink-0">
        <div
          className={`flex flex-col transition-all duration-300 ${
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
          }`}
        >
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 whitespace-nowrap">
            Core202
          </span>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold whitespace-nowrap">
            Personal Hub
          </span>
        </div>

        <button
          onClick={toggleSidebar}
          className={`
            p-2 rounded-xl text-gray-500 hover:bg-white/50 hover:text-violet-600 dark:hover:bg-white/10 dark:hover:text-violet-400 
            transition-all duration-200 
            ${collapsed ? "mx-auto" : ""}
          `}
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
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6 custom-scrollbar overflow-x-visible">
        {/* Menu Section */}
        <div className="space-y-1">
          <SectionHeader label="Menu" collapsed={collapsed} />

          <div
            className={`space-y-1 ${
              !collapsed
                ? "bg-white/30 dark:bg-gray-800/30 rounded-2xl p-2"
                : ""
            }`}
          >
            <NavItem
              to="/"
              icon={<HomeIcon />}
              label="Dashboard"
              collapsed={collapsed}
              isActive={location.pathname === "/"}
            />
            <NavItem
              to="/settings"
              icon={<SettingsIcon />}
              label="Settings"
              collapsed={collapsed}
              isActive={location.pathname.startsWith("/settings")}
            />
          </div>
        </div>

        {/* Apps Section */}
        {activePlugins.length > 0 && (
          <div className="space-y-1">
            <SectionHeader label="Apps" collapsed={collapsed} />

            <div
              className={`space-y-1 ${
                !collapsed
                  ? "bg-white/30 dark:bg-gray-800/30 rounded-2xl p-2"
                  : ""
              }`}
            >
              {activePlugins.map((plugin) => (
                <PluginNavItem
                  key={plugin.manifest.id}
                  plugin={plugin}
                  collapsed={collapsed}
                  isActive={location.pathname.startsWith(
                    plugin.manifest.basePath
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Footer - Logout */}
      <div className="p-3 border-t border-white/10 dark:border-white/5 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-md flex-shrink-0">
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group
              text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600
              ${collapsed ? "justify-center" : ""}
            `}
            title={collapsed ? "Logout" : undefined}
          >
            <LogoutIcon />
            <span
              className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                collapsed
                  ? "w-0 opacity-0 overflow-hidden"
                  : "w-auto opacity-100"
              }`}
            >
              Logout
            </span>
          </button>
        )}
      </div>
    </aside>
  );
};

// ============================================================================
// Sub-components
// ============================================================================

const SectionHeader: React.FC<{ label: string; collapsed: boolean }> = ({
  label,
  collapsed,
}) => (
  <div
    className={`px-3 mb-2 flex items-center h-6 ${
      collapsed ? "justify-center" : ""
    }`}
  >
    {collapsed ? (
      <div className="w-4 h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
    ) : (
      <>
        <div className="w-1 h-4 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full mr-2" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
      </>
    )}
  </div>
);

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string | number;
  collapsed: boolean;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  to,
  icon,
  label,
  badge,
  collapsed,
  isActive,
}) => {
  return (
    <div className="relative group/item">
      <NavLink
        to={to}
        className={`
          relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300
          ${
            isActive
              ? "bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 text-violet-700 dark:text-violet-300 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-gray-200"
          }
          ${collapsed ? "justify-center" : ""}
        `}
      >
        {/* Active Indicator Line */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-r-full" />
        )}

        {/* Icon */}
        <span
          className={`
            flex-shrink-0 transition-transform duration-300 
            ${isActive ? "scale-110" : "group-hover/item:scale-110"}
          `}
        >
          {icon}
        </span>

        {/* Label (Collapsed: Hidden) */}
        <span
          className={`
            flex-1 truncate font-medium text-sm whitespace-nowrap transition-all duration-300
            ${
              collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
            }
          `}
        >
          {label}
        </span>

        {/* Badge */}
        {!collapsed && badge !== undefined && (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-violet-100 text-violet-600 rounded-full dark:bg-violet-900/50 dark:text-violet-300 shadow-sm border border-violet-200 dark:border-violet-800">
            {badge}
          </span>
        )}
      </NavLink>

      {/* Hover Tooltip / Submenu for Collapsed Mode */}
      {collapsed && (
        <div className="absolute left-full top-0 ml-2 z-50">
          <div className="bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 -translate-x-2 group-hover/item:translate-x-0">
            {label}
            {/* Render nested items in tooltip if needed here */}
          </div>
        </div>
      )}
    </div>
  );
};

interface PluginNavItemProps {
  plugin: any;
  collapsed: boolean;
  isActive: boolean;
}

const PluginNavItem: React.FC<PluginNavItemProps> = ({
  plugin,
  collapsed,
  isActive,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubItems =
    plugin.manifest.navItems && plugin.manifest.navItems.length > 0;

  // Auto-expand if active
  React.useEffect(() => {
    if (isActive && !collapsed) {
      setIsExpanded(true);
    }
  }, [isActive, collapsed]);

  return (
    <div className="relative group/plugin">
      <div
        className={`
          relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 cursor-pointer
          ${
            isActive
              ? "bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 text-violet-700 dark:text-violet-300 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-gray-200"
          }
          ${collapsed ? "justify-center" : ""}
        `}
        onClick={() => !collapsed && hasSubItems && setIsExpanded(!isExpanded)}
      >
        {/* Main Plugin Link/Toggle */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-r-full" />
        )}

        <NavLink to={plugin.manifest.basePath} className="contents">
          <span
            className={`flex-shrink-0 transition-transform duration-300 ${
              isActive ? "scale-110" : ""
            }`}
          >
            <PluginIcon icon={plugin.manifest.icon} />
          </span>
        </NavLink>

        <span
          className={`
            flex-1 truncate font-medium text-sm whitespace-nowrap transition-all duration-300
            ${
              collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
            }
          `}
        >
          {plugin.manifest.name}
        </span>

        {!collapsed && hasSubItems && (
          <span
            className={`transition-transform duration-200 ${
              isExpanded ? "rotate-90" : ""
            }`}
          >
            <ChevronRightIcon />
          </span>
        )}
      </div>

      {/* Sub-items (Active/Expanded) */}
      {!collapsed && isExpanded && hasSubItems && (
        <div className="ml-9 mt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-700 pl-2 animate-slide-down">
          {plugin.manifest.navItems.map((item: any) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive: isSubActive }) => `
                 block px-3 py-1.5 rounded-lg text-sm transition-colors
                 ${
                   isSubActive
                     ? "text-violet-600 dark:text-violet-400 font-medium bg-violet-50 dark:bg-violet-900/20"
                     : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                 }
               `}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}

      {/* Hover Menu for Sidebar Collapsed Mode */}
      {collapsed && (
        <div className="absolute left-full top-0 ml-2 z-[100]">
          <div
            className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 p-2 min-w-[180px]
             opacity-0 invisible group-hover/plugin:opacity-100 group-hover/plugin:visible 
             transition-all duration-200 -translate-x-2 group-hover/plugin:translate-x-0
           "
          >
            <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-800 mb-1">
              <p className="font-bold text-gray-900 dark:text-white">
                {plugin.manifest.name}
              </p>
            </div>
            {hasSubItems ? (
              plugin.manifest.navItems.map((item: any) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  {item.label}
                </NavLink>
              ))
            ) : (
              <NavLink
                to={plugin.manifest.basePath}
                className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                Open App
              </NavLink>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Icons
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

// Generic plugin icon
const PluginIcon: React.FC<{ icon?: string }> = ({ icon: _icon }) => (
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

const LogoutIcon = () => (
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
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export default Sidebar;

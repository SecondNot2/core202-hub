/**
 * Header Component - Floating Glass Header
 */

import React, { useState } from "react";
import { useAuth } from "@core/auth";
import { useHubStore } from "@core/store";
import { useConfirm } from "@shared/components";
import { NotificationPanel } from "./NotificationPanel";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const theme = useHubStore((state) => state.theme);
  const setTheme = useHubStore((state) => state.setTheme);
  const notifications = useHubStore((state) => state.notifications);
  const { confirm } = useConfirm();

  const [showNotifications, setShowNotifications] = useState(false);

  const toggleTheme = () => {
    const nextTheme =
      theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
    setTheme(nextTheme);
  };

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: "Log out?",
      message: "Are you sure you want to sign out?",
      variant: "danger",
      confirmText: "Log Out",
      cancelText: "Cancel",
      icon: "👋",
    });

    if (confirmed) {
      logout();
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <MoonIcon />;
      case "light":
        return <SunIcon />;
      default:
        return <SystemIcon />;
    }
  };

  return (
    <header className="glass-panel h-16 px-4 flex items-center justify-between rounded-2xl transition-all duration-300 relative z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-lg">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search commands... (Ctrl+K)"
            className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-200"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600 font-mono">
              Ctrl K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 ml-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all duration-200 active:scale-95"
          title={`Theme: ${theme}`}
        >
          {getThemeIcon()}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all duration-200 active:scale-95"
          >
            <BellIcon />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900 animate-pulse"></span>
            )}
          </button>

          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2" />

        {/* User Profile */}
        {isAuthenticated && user && (
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide font-medium">
                {user.role}
              </p>
            </div>

            <div className="group relative">
              <button className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-0.5 shadow-lg shadow-violet-500/20 transition-transform active:scale-95">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold">
                  {user.name.charAt(0)}
                </div>
              </button>

              {/* Dropdown */}
              <div className="absolute top-12 right-0 w-48 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                <Link
                  to="/settings"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-lg">👤</span>
                  Profile
                </Link>
                <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogoutIcon />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// ============================================================================
// Icons
// ============================================================================

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const BellIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

const SunIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const SystemIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

export default Header;

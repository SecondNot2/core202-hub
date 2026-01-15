/**
 * Home Page - Bento Grid Dashboard with Glassmorphism
 */

import React from "react";
import { useAuth } from "@core/auth";
import { usePluginRegistry } from "@core/plugin-system";
import { Link } from "react-router-dom";

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { getActivePlugins } = usePluginRegistry();

  const activePlugins = getActivePlugins();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl glass-card p-8 sm:p-12">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-64 h-64 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            {getGreeting()},{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
              {user?.name || "Traveler"}
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
            Welcome to your{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Personal Hub
            </span>
            . All your tools, metrics, and workflows are synced and ready.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/settings" className="glass-button">
              Explore Apps
            </Link>
            <Link
              to="/settings"
              className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium text-gray-700 dark:text-gray-300"
            >
              Customize Layout
            </Link>
          </div>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Plugins"
          value={activePlugins.length}
          trend="+2 this week"
          color="violet"
          icon={<PluginIcon />}
        />
        <StatCard
          title="System Health"
          value="98%"
          trend="All systems operational"
          color="emerald"
          icon={<ActivityIcon />}
        />
        <StatCard
          title="Tasks Pending"
          value="12"
          trend="4 high priority"
          color="amber"
          icon={<CheckSquareIcon />}
        />
        <StatCard
          title="Usage Time"
          value="4h 30m"
          trend="+15% vs yesterday"
          color="blue"
          icon={<ClockIcon />}
        />
      </div>

      {/* Apps Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-8 rounded-full bg-gradient-to-b from-blue-500 to-cyan-500 block" />
            Your Applications
          </h2>
          <Link
            to="/settings"
            className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline"
          >
            View All
          </Link>
        </div>

        {activePlugins.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-12 text-center bg-gray-50/50 dark:bg-gray-800/50">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PluginIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No apps active
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
              Your hub is empty. Head to the registry to install new plugins and
              extend your workspace.
            </p>
            <Link
              to="/settings"
              className="px-6 py-2.5 bg-gray-900 dark:bg-gray-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Browse Registry
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePlugins.map((plugin) => (
              <PluginCard key={plugin.manifest.id} plugin={plugin} />
            ))}

            {/* Add New Card */}
            <Link
              to="/settings"
              className="group relative flex flex-col items-center justify-center p-8 h-full rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 group-hover:scale-110 transition-all duration-300">
                <PlusIcon className="w-6 h-6 text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400" />
              </div>
              <span className="font-semibold text-gray-600 dark:text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400">
                Install New App
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Sub-components
// ============================================================================

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  color: "violet" | "emerald" | "amber" | "blue";
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  color,
  icon,
}) => {
  const colorClasses = {
    violet:
      "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
    emerald:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    amber:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  }[color];

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorClasses}`}>{icon}</div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          Daily
        </span>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          {title}
        </h4>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white leading-none">
            {value}
          </span>
        </div>
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
          <TrendIcon /> {trend}
        </p>
      </div>
    </div>
  );
};

interface PluginCardProps {
  plugin: {
    manifest: {
      id: string;
      name: string;
      description?: string;
      basePath: string;
      version: string;
      icon?: string;
    };
  };
}

const PluginCard: React.FC<PluginCardProps> = ({ plugin }) => (
  <Link
    to={plugin.manifest.basePath}
    className="group relative glass-card rounded-3xl p-6 overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-700/50"
  >
    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 dark:opacity-5 transition-opacity pointer-events-none">
      <PluginIcon className="w-32 h-32 rotate-12 -mr-10 -mt-10" />
    </div>

    <div className="flex items-start justify-between mb-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-0.5 shadow-lg group-hover:shadow-violet-500/30 transition-shadow">
        <div className="w-full h-full bg-white dark:bg-gray-900 rounded-[14px] flex items-center justify-center">
          <PluginIcon className="w-7 h-7 text-transparent bg-clip-text bg-gradient-to-br from-violet-600 to-fuchsia-600" />
        </div>
      </div>
      <span className="px-3 py-1 text-xs font-bold tracking-wide bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full border border-gray-200 dark:border-gray-700">
        v{plugin.manifest.version}
      </span>
    </div>

    <div className="mt-auto">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
        {plugin.manifest.name}
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
        {plugin.manifest.description || "Powerful tool for your workflow."}
      </p>
    </div>

    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center text-sm font-semibold text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
      Launch App <ArrowRightIcon className="w-4 h-4 ml-2" />
    </div>
  </Link>
);

// ============================================================================
// Icons
// ============================================================================

const PluginIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
    />
  </svg>
);

const ActivityIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const CheckSquareIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const TrendIcon = () => (
  <svg
    className="w-3 h-3 text-emerald-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>
);

export default HomePage;

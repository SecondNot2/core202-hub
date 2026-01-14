/**
 * Settings Page - Application and user settings
 */

import React from "react";
import { useAuth } from "@core/auth";
import { useHubStore } from "@core/store";
import { usePluginRegistry } from "@core/plugin-system";

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const theme = useHubStore((state) => state.theme);
  const setTheme = useHubStore((state) => state.setTheme);
  const { getAllPlugins } = usePluginRegistry();

  const allPlugins = getAllPlugins();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Manage your hub preferences
        </p>
      </div>

      {/* Appearance section */}
      <SettingsSection
        title="Appearance"
        description="Customize the look and feel"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <div className="flex gap-3">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`
                    px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors
                    ${
                      theme === t
                        ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Profile section */}
      <SettingsSection title="Profile" description="Your account information">
        <div className="space-y-4">
          <InfoRow label="Name" value={user?.name || "N/A"} />
          <InfoRow label="Email" value={user?.email || "N/A"} />
          <InfoRow label="Role" value={user?.role || "N/A"} />
          <InfoRow
            label="Permissions"
            value={user?.permissions.join(", ") || "None"}
          />
        </div>
      </SettingsSection>

      {/* Plugins section */}
      <SettingsSection title="Plugins" description="Manage installed plugins">
        <div className="space-y-3">
          {allPlugins.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No plugins registered
            </p>
          ) : (
            allPlugins.map((plugin) => (
              <div
                key={plugin.manifest.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {plugin.manifest.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    v{plugin.manifest.version} • {plugin.manifest.basePath}
                  </p>
                </div>
                <span
                  className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${
                      plugin.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                        : plugin.status === "error"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                    }
                  `}
                >
                  {plugin.status}
                </span>
              </div>
            ))
          )}
        </div>
      </SettingsSection>

      {/* About section */}
      <SettingsSection title="About" description="Application information">
        <div className="space-y-4">
          <InfoRow label="Application" value="Core202 Hub" />
          <InfoRow label="Version" value="0.1.0" />
          <InfoRow label="Framework" value="React + TypeScript + Tailwind" />
        </div>
      </SettingsSection>
    </div>
  );
};

// ============================================================================
// Sub-components
// ============================================================================

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  children,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    {children}
  </div>
);

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm font-medium text-gray-900 dark:text-white">
      {value}
    </span>
  </div>
);

export default SettingsPage;

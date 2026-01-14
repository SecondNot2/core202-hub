/**
 * Template Home Component
 */

import React from "react";

export const TemplateHome: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Template Plugin
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          This is a template plugin. Use it as a starting point for your own
          plugins.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Getting Started
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
          <li>
            Copy the{" "}
            <code className="px-1 bg-gray-100 dark:bg-gray-700 rounded">
              _template
            </code>{" "}
            folder
          </li>
          <li>Rename it to your plugin name</li>
          <li>Update the manifest with your plugin details</li>
          <li>Define your routes</li>
          <li>Build your components</li>
          <li>
            Register the plugin in{" "}
            <code className="px-1 bg-gray-100 dark:bg-gray-700 rounded">
              plugins/index.ts
            </code>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default TemplateHome;

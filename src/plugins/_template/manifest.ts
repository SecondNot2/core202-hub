/**
 * Plugin Manifest - Defines plugin metadata and configuration
 */

import type { PluginManifest } from "@shared/types";

export const manifest: PluginManifest = {
  // Unique identifier (kebab-case recommended)
  id: "template-plugin",

  // Display name
  name: "Template Plugin",

  // Semantic version
  version: "0.1.0",

  // Brief description
  description: "A template plugin to help you get started",

  // Plugin author
  author: "Your Name",

  // Base route path (all plugin routes are relative to this)
  basePath: "/template",

  // Icon identifier (optional)
  // Can be a string ID that maps to an icon, or an SVG path
  icon: "template",

  // Navigation items for the sidebar
  navItems: [
    {
      id: "template-home",
      label: "Template",
      path: "/template",
      icon: "template",
    },
    // Add more nav items as needed
    // {
    //   id: 'template-settings',
    //   label: 'Settings',
    //   path: '/template/settings',
    //   icon: 'settings',
    // },
  ],

  // Required permissions (optional)
  // Users without these permissions won't be able to access the plugin
  permissions: [
    // { id: 'template:read', name: 'Read Template', description: 'View template data' },
    // { id: 'template:write', name: 'Write Template', description: 'Modify template data' },
  ],

  // Plugin dependencies (other plugin IDs that must be loaded first)
  dependencies: [],

  // Whether plugin is enabled by default
  defaultEnabled: true,

  // Loading priority (higher = loaded first)
  priority: 0,
};

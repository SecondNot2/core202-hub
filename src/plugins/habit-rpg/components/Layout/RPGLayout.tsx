/**
 * RPG Layout - Root wrapper for RPG plugin
 * Ensures cloud sync is initialized for all RPG pages
 */

import React from "react";
import { Outlet } from "react-router-dom";
import { useSyncStore } from "../../store";
import { useItemsLoader } from "../../hooks/useItemsLoader";

/**
 * This layout wraps all RPG routes to ensure:
 * 1. Cloud sync is initialized (useSyncStore)
 * 2. Item definitions are loaded (useItemsLoader)
 */
export const RPGLayout: React.FC = () => {
  // Initialize cloud sync - this will load from cloud on first mount
  useSyncStore();

  // Preload item definitions from database
  useItemsLoader();

  return <Outlet />;
};

export default RPGLayout;

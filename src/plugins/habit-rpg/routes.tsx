/**
 * Plugin Routes - Habit RPG
 */

import type { RouteObject } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";

export const routes: RouteObject[] = [
  {
    index: true,
    element: <Dashboard />,
  },
  // Future routes:
  // { path: 'character', element: <CharacterPage /> },
  // { path: 'skills', element: <SkillTreePage /> },
  // { path: 'boss', element: <BossPage /> },
  // { path: 'history', element: <HistoryPage /> },
];

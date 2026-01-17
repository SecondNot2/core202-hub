/**
 * Plugin Routes - Habit RPG
 */

import type { RouteObject } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { SkillTreePage } from "./components/SkillTree";
import { BossPage } from "./components/Boss";
import { CharacterPage } from "./components/Character";
import { CraftingPanel } from "./components/Crafting";
import { GuidePage } from "./components/Guide";
import { ShopPanel } from "./components/Shop/ShopPanel";
import { InventoryPanel } from "./components/Inventory/InventoryPanel";

export const routes: RouteObject[] = [
  {
    index: true,
    element: <Dashboard />,
  },
  {
    path: "skills",
    element: <SkillTreePage />,
  },
  {
    path: "boss",
    element: <BossPage />,
  },
  {
    path: "character",
    element: <CharacterPage />,
  },
  {
    path: "craft",
    element: <CraftingPanel />,
  },
  {
    path: "guide",
    element: <GuidePage />,
  },
  {
    path: "shop",
    element: <ShopPanel />,
  },
  {
    path: "inventory",
    element: <InventoryPanel />,
  },
];

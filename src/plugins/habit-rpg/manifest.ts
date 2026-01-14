/**
 * Plugin Manifest - Habit RPG
 */

import type { PluginManifest } from "@shared/types";

export const manifest: PluginManifest = {
  id: "habit-rpg",
  name: "Gamified Habits",
  version: "2.0.0",
  description:
    "Turn your daily habits into an epic RPG adventure. Level up, defeat bosses, and become the hero of your own life!",
  author: "SecondNot2",
  basePath: "/rpg",
  icon: "gamepad",

  navItems: [
    {
      id: "rpg-dashboard",
      label: "RPG Dashboard",
      path: "/rpg",
      icon: "gamepad",
    },
    {
      id: "rpg-character",
      label: "Character",
      path: "/rpg/character",
      icon: "user",
    },
    {
      id: "rpg-skills",
      label: "Skill Tree",
      path: "/rpg/skills",
      icon: "zap",
    },
    {
      id: "rpg-boss",
      label: "Boss",
      path: "/rpg/boss",
      icon: "skull",
    },
    {
      id: "rpg-craft",
      label: "Crafting",
      path: "/rpg/craft",
      icon: "flask-conical",
    },
  ],

  permissions: [],
  dependencies: [],
  defaultEnabled: true,
  priority: 10,
};

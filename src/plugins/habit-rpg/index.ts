/**
 * Habit RPG Plugin - Main Entry Point
 */

import { definePlugin } from "@core/plugin-system";
import { manifest } from "./manifest";
import { routes } from "./routes";
import type { PluginAPI } from "@shared/types";
import { useGameStore } from "./store";
import { startAutoSync, stopAutoSync } from "./hooks";
import { useAuthStore } from "@core/auth/store";

export default definePlugin({
  manifest,
  routes,

  lifecycle: {
    onLoad: () => {
      console.log(`[${manifest.id}] 🎮 Plugin loaded v${manifest.version}`);
      // Initialize game state
      useGameStore.getState().initializeGame();
    },
    onUnload: () => {
      console.log(`[${manifest.id}] Plugin unloaded`);
      stopAutoSync();
    },
    onActivate: () => {
      console.log(`[${manifest.id}] Plugin activated`);
      // Run scheduler to check resets
      useGameStore.getState().runScheduler();

      // Start auto-sync if user is authenticated
      const authState = useAuthStore.getState();
      if (authState.isAuthenticated && authState.user?.id) {
        startAutoSync(authState.user.id);
      }
    },
    onDeactivate: () => {
      console.log(`[${manifest.id}] Plugin deactivated`);
      stopAutoSync();
    },
  },

  setup: (api: PluginAPI) => {
    // Register commands for command palette
    api.registerCommand({
      id: "habit-rpg:quick-complete",
      label: "Complete Top Quest",
      description: "Complete the first pending quest for today",
      action: () => {
        const state = useGameStore.getState();
        const pendingQuest = state.quests.find((q) => q.status === "pending");
        if (pendingQuest) {
          state.completeQuest(pendingQuest.id);
          api.notify(`Completed: ${pendingQuest.habitTitle}`, "success");
        } else {
          api.notify("No pending quests!", "info");
        }
      },
    });

    api.registerCommand({
      id: "habit-rpg:open-dashboard",
      label: "Open RPG Dashboard",
      description: "Navigate to the Gamified Habits dashboard",
      action: () => {
        api.navigate("/rpg");
      },
    });

    api.registerCommand({
      id: "habit-rpg:check-stats",
      label: "Show Character Stats",
      description: "Display current character statistics",
      action: () => {
        const { character, streak } = useGameStore.getState();
        api.notify(
          `Level ${character.level} | ${character.xp}/${character.xpToNextLevel} XP | 🔥 ${streak.currentStreak} day streak`,
          "info"
        );
      },
    });

    // Emit shared state for hub widgets
    const updateSharedState = () => {
      const state = useGameStore.getState();
      const todayQuests = state.quests.filter(
        (q) => q.status !== "skipped" && q.status !== "grace"
      );
      const completed = todayQuests.filter(
        (q) => q.status === "completed"
      ).length;
      const total = todayQuests.length;

      api.setSharedState(
        "habitRpg.todayProgress",
        total > 0 ? completed / total : 0
      );
      api.setSharedState("habitRpg.levelSnapshot", {
        level: state.character.level,
        xp: state.character.xp,
        xpToNext: state.character.xpToNextLevel,
      });
    };

    // Update shared state initially
    updateSharedState();

    // Subscribe to store changes
    useGameStore.subscribe(updateSharedState);

    // Listen for quest completion events to emit to hub
    api.on("habitRpg.quest.completed", (payload) => {
      console.log("[HabitRPG] Quest completed event:", payload);
    });
  },
});

// Re-export store and types
export { useGameStore } from "./store";
export * from "./domain/types";

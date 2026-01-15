/**
 * useRpgSync Hook
 * Connects the local game store with Supabase cloud sync
 */

import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "@core/auth";
import { useGameStore } from "../store/game.store";
import {
  loadFromCloud,
  saveCharacterToCloud,
  saveHabitToCloud,
  deleteHabitFromCloud,
  saveQuestToCloud,
  saveGeneralStateToCloud,
} from "../services/rpg-sync.service";

// ============================================================================
// Hook
// ============================================================================

export function useRpgSync() {
  const { user, isAuthenticated } = useAuth();
  const isSyncing = useRef(false);
  const lastSyncTime = useRef(0);

  // Load data from cloud on mount (when authenticated)
  useEffect(() => {
    async function loadCloudData() {
      if (!isAuthenticated || !user?.id) return;
      if (isSyncing.current) return;

      isSyncing.current = true;

      try {
        const cloudData = await loadFromCloud(user.id);

        if (cloudData) {
          // Merge cloud data with local state
          useGameStore.setState((state) => ({
            ...state,
            ...cloudData,
          }));
          console.log("[RPG Sync] Loaded data from cloud");
        } else {
          // New user - save initial state to cloud
          await saveInitialStateToCloud(user.id);
          console.log("[RPG Sync] Saved initial state for new user");
        }
      } catch (error) {
        console.error("[RPG Sync] Failed to sync:", error);
      } finally {
        isSyncing.current = false;
      }
    }

    loadCloudData();
  }, [isAuthenticated, user?.id]);

  // Save initial state for new users
  async function saveInitialStateToCloud(userId: string) {
    const state = useGameStore.getState();

    await Promise.all([
      saveCharacterToCloud(userId, state.character),
      saveGeneralStateToCloud(userId, {
        inventory: state.inventory,
        streak: state.streak,
        skillTree: state.skillTree,
        boss: state.boss,
        season: state.season,
        settings: state.settings,
      }),
    ]);
  }

  // Debounced save function
  const debouncedSave = useCallback(
    async (saveFunction: () => Promise<boolean>) => {
      if (!isAuthenticated || !user?.id) return;

      const now = Date.now();
      if (now - lastSyncTime.current < 1000) {
        // Debounce: wait at least 1 second between saves
        return;
      }

      lastSyncTime.current = now;
      await saveFunction();
    },
    [isAuthenticated, user?.id]
  );

  // Sync character changes
  const syncCharacter = useCallback(async () => {
    if (!user?.id) return;
    await debouncedSave(() =>
      saveCharacterToCloud(user.id, useGameStore.getState().character)
    );
  }, [user?.id, debouncedSave]);

  // Sync habit changes
  const syncHabit = useCallback(
    async (habitId: string) => {
      if (!user?.id) return;
      const habit = useGameStore
        .getState()
        .habits.find((h) => h.id === habitId);
      if (habit) {
        await saveHabitToCloud(user.id, habit);
      }
    },
    [user?.id]
  );

  // Sync habit deletion
  const syncDeleteHabit = useCallback(async (habitId: string) => {
    await deleteHabitFromCloud(habitId);
  }, []);

  // Sync quest changes
  const syncQuest = useCallback(
    async (questId: string) => {
      if (!user?.id) return;
      const quest = useGameStore
        .getState()
        .quests.find((q) => q.id === questId);
      if (quest) {
        await saveQuestToCloud(user.id, quest);
      }
    },
    [user?.id]
  );

  // Sync general state (inventory, streak, etc.)
  const syncGeneralState = useCallback(async () => {
    if (!user?.id) return;
    const state = useGameStore.getState();
    await debouncedSave(() =>
      saveGeneralStateToCloud(user.id, {
        inventory: state.inventory,
        streak: state.streak,
        skillTree: state.skillTree,
        boss: state.boss,
        season: state.season,
        settings: state.settings,
      })
    );
  }, [user?.id, debouncedSave]);

  return {
    syncCharacter,
    syncHabit,
    syncDeleteHabit,
    syncQuest,
    syncGeneralState,
    isAuthenticated,
    userId: user?.id,
  };
}

// ============================================================================
// Auto-sync subscriber (subscribe to store changes)
// ============================================================================

let unsubscribe: (() => void) | null = null;

export function startAutoSync(userId: string) {
  if (unsubscribe) return; // Already started

  unsubscribe = useGameStore.subscribe((state, prevState) => {
    // Character changed
    if (state.character !== prevState.character) {
      saveCharacterToCloud(userId, state.character);
    }

    // Habits changed
    if (state.habits !== prevState.habits) {
      // Find changed habits
      state.habits.forEach((habit) => {
        const prev = prevState.habits.find((h) => h.id === habit.id);
        if (!prev || habit.updatedAt !== prev.updatedAt) {
          saveHabitToCloud(userId, habit);
        }
      });
    }

    // General state changed
    if (
      state.inventory !== prevState.inventory ||
      state.streak !== prevState.streak ||
      state.skillTree !== prevState.skillTree
    ) {
      saveGeneralStateToCloud(userId, {
        inventory: state.inventory,
        streak: state.streak,
        skillTree: state.skillTree,
        boss: state.boss,
        season: state.season,
        settings: state.settings,
      });
    }
  });

  console.log("[RPG Sync] Auto-sync started");
}

export function stopAutoSync() {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
    console.log("[RPG Sync] Auto-sync stopped");
  }
}

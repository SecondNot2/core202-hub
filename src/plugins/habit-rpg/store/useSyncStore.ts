/**
 * Habit RPG - Sync Hook
 * Integrates cloud sync with the game store
 */

import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "@core/auth/AuthContext";
import { useGameStore } from "./game.store";
import {
  loadFromCloud,
  saveCharacterToCloud,
  saveHabitToCloud,
  saveQuestToCloud,
  saveGeneralStateToCloud,
  deleteHabitFromCloud,
} from "../services/rpg-sync.service";

// Debounce time for auto-save (ms)
const SAVE_DEBOUNCE_MS = 2000;

/**
 * Hook to handle cloud synchronization for RPG data
 * Should be used once at the root of RPG plugin
 */
export function useSyncStore() {
  const { user } = useAuth();
  const userId = user?.id;

  // Track if initial load has happened
  const hasLoaded = useRef(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get store state and actions
  const character = useGameStore((s) => s.character);
  const habits = useGameStore((s) => s.habits);
  const quests = useGameStore((s) => s.quests);
  const inventory = useGameStore((s) => s.inventory);
  const streak = useGameStore((s) => s.streak);
  const skillTree = useGameStore((s) => s.skillTree);
  const boss = useGameStore((s) => s.boss);
  const season = useGameStore((s) => s.season);
  const settings = useGameStore((s) => s.settings);

  // ============================================================================
  // Load from Cloud on Login
  // ============================================================================
  useEffect(() => {
    if (!userId || hasLoaded.current) return;

    const loadData = async () => {
      console.log("[RPG Sync] Loading from cloud...");
      const cloudData = await loadFromCloud(userId);

      if (cloudData) {
        console.log("[RPG Sync] Cloud data found, merging...");
        // Merge cloud data with local (cloud takes priority for now)
        useGameStore.setState((state) => ({
          ...state,
          ...cloudData,
          // Always keep local habits if cloud is empty
          habits: cloudData.habits?.length ? cloudData.habits : state.habits,
        }));
      } else {
        console.log("[RPG Sync] No cloud data, using local state");
      }

      hasLoaded.current = true;
    };

    loadData();
  }, [userId]);

  // ============================================================================
  // Auto-save Character Changes
  // ============================================================================
  const saveCharacter = useCallback(async () => {
    if (!userId) return;
    await saveCharacterToCloud(userId, character);
  }, [userId, character]);

  // Debounced save on character change
  useEffect(() => {
    if (!userId || !hasLoaded.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveCharacter();
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    userId,
    saveCharacter,
    character.level,
    character.xp,
    character.archetypeId,
  ]);

  // ============================================================================
  // Save General State (inventory, streak, etc.)
  // ============================================================================
  const saveGeneralState = useCallback(async () => {
    if (!userId) return;
    await saveGeneralStateToCloud(userId, {
      inventory,
      streak,
      skillTree,
      boss,
      season,
      settings,
    });
  }, [userId, inventory, streak, skillTree, boss, season, settings]);

  // Auto-save general state when key values change
  useEffect(() => {
    if (!userId || !hasLoaded.current) return;

    const timeout = setTimeout(() => {
      saveGeneralState();
    }, SAVE_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [
    userId,
    saveGeneralState,
    inventory.gold,
    streak.currentStreak,
    skillTree.unlockedSkillIds.length,
  ]);

  // ============================================================================
  // Manual Save Functions (for immediate saves)
  // ============================================================================
  const syncHabit = useCallback(
    async (habit: (typeof habits)[0]) => {
      if (!userId) return;
      await saveHabitToCloud(userId, habit);
    },
    [userId]
  );

  const syncQuest = useCallback(
    async (quest: (typeof quests)[0]) => {
      if (!userId) return;
      await saveQuestToCloud(userId, quest);
    },
    [userId]
  );

  const removeHabit = useCallback(
    async (habitId: string) => {
      if (!userId) return;
      await deleteHabitFromCloud(habitId);
    },
    [userId]
  );

  const forceSync = useCallback(async () => {
    if (!userId) return;
    console.log("[RPG Sync] Force syncing all data...");
    await Promise.all([saveCharacter(), saveGeneralState()]);
    console.log("[RPG Sync] Force sync complete");
  }, [userId, saveCharacter, saveGeneralState]);

  return {
    isLoggedIn: !!userId,
    hasLoaded: hasLoaded.current,
    syncHabit,
    syncQuest,
    removeHabit,
    forceSync,
  };
}

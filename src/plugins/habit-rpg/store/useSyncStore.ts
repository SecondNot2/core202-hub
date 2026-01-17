/**
 * Habit RPG - Sync Hook
 * Integrates cloud sync with the game store
 */

import { useEffect, useCallback, useRef, useState } from "react";
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
import type { Inventory, ShopState } from "../domain/types";

// Debounce time for auto-save (ms)
const SAVE_DEBOUNCE_MS = 1000;

// Track if initial load has happened - MUST be module-scoped to persist across navigations
let hasLoadedFromCloud = false;

/**
 * Hook to handle cloud synchronization for RPG data
 * Should be used once at the root of RPG plugin
 */
export function useSyncStore() {
  const { user } = useAuth();
  const userId = user?.id;

  // Track if initial load has happened (local ref for compatibility)
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevUserIdRef = useRef<string | undefined>(undefined);

  // Reset load flag when user changes (logout/login)
  useEffect(() => {
    if (
      prevUserIdRef.current !== undefined &&
      prevUserIdRef.current !== userId
    ) {
      // User changed, reset the flag so we reload from cloud
      hasLoadedFromCloud = false;
    }
    prevUserIdRef.current = userId;
  }, [userId]);

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
  const shop = useGameStore((s) => s.shop);

  // ============================================================================
  // Load from Cloud on Login
  // ============================================================================
  useEffect(() => {
    if (!userId || hasLoadedFromCloud) return;

    const loadData = async () => {
      console.log("[RPG Sync] Loading from cloud...");
      const cloudData = await loadFromCloud(userId);

      if (cloudData) {
        console.log("[RPG Sync] Cloud data found, merging...");

        // Migrate legacy inventory to include new fields
        const migratedInventory: Inventory = {
          gold: cloudData.inventory?.gold || 0,
          essenceShards: cloudData.inventory?.essenceShards || 0,
          relics: cloudData.inventory?.relics || [],
          consumables: cloudData.inventory?.consumables || [],
          items: cloudData.inventory?.items || [],
          equipment: cloudData.inventory?.equipment || [],
          loadout: cloudData.inventory?.loadout || {
            tool: null,
            environment: null,
            accessory: null,
          },
        };

        // Migrate shop state
        const migratedShop: ShopState = cloudData.shop || {
          dailyRotation: [],
          lastRotationDate: new Date().toISOString().split("T")[0],
          purchaseHistory: [],
          gachaPity: 0,
        };

        // Merge cloud data with local (cloud takes priority for now)
        useGameStore.setState((state) => ({
          ...state,
          ...cloudData,
          // Always keep local habits if cloud is empty
          habits: cloudData.habits?.length ? cloudData.habits : state.habits,
          // Use migrated data
          inventory: migratedInventory,
          shop: migratedShop,
        }));
      } else {
        console.log("[RPG Sync] No cloud data, using local state");
      }

      hasLoadedFromCloud = true;
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
    if (!userId || !hasLoadedFromCloud) return;

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
    setIsSaving(true);
    await saveGeneralStateToCloud(userId, {
      inventory,
      streak,
      skillTree,
      boss,
      season,
      settings,
      shop,
    });
    setIsSaving(false);
  }, [userId, inventory, streak, skillTree, boss, season, settings, shop]);

  // Auto-save general state when key values change
  useEffect(() => {
    if (!userId || !hasLoadedFromCloud) return;

    const timeout = setTimeout(() => {
      saveGeneralState();
    }, SAVE_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [
    userId,
    saveGeneralState,
    // Deep watch inventory triggers
    inventory.gold,
    inventory.essenceShards,
    inventory.items,
    inventory.equipment,
    inventory.loadout,
    // Other state triggers
    streak.currentStreak,
    skillTree.unlockedSkillIds.length,
    boss.weeklyDamageDealt,
    shop.purchaseHistory.length, // Trigger on purchase
    shop.gachaPity,
  ]);

  // ============================================================================
  // Manual Save Functions (for immediate saves)
  // ============================================================================
  const syncHabit = useCallback(
    async (habit: (typeof habits)[0]) => {
      if (!userId) return;
      await saveHabitToCloud(userId, habit);
    },
    [userId],
  );

  const syncQuest = useCallback(
    async (quest: (typeof quests)[0]) => {
      if (!userId) return;
      await saveQuestToCloud(userId, quest);
    },
    [userId],
  );

  const removeHabit = useCallback(
    async (habitId: string) => {
      if (!userId) return;
      await deleteHabitFromCloud(habitId);
    },
    [userId],
  );

  const forceSync = useCallback(async () => {
    if (!userId) return;
    console.log("[RPG Sync] Force syncing all data...");
    await Promise.all([saveCharacter(), saveGeneralState()]);
    console.log("[RPG Sync] Force sync complete");
  }, [userId, saveCharacter, saveGeneralState]);

  return {
    isLoggedIn: !!userId,
    hasLoaded: hasLoadedFromCloud,
    isSaving,
    syncHabit,
    syncQuest,
    removeHabit,
    forceSync,
  };
}

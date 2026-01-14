/**
 * Habit RPG - Storage & Persistence
 * localStorage wrapper with versioning and migration support
 */

import type { GameState } from "../domain/types";

const STORAGE_KEY = "core202-habit-rpg";
const CURRENT_VERSION = 1;

// ============================================================================
// Storage Interface
// ============================================================================

export interface StoredData {
  version: number;
  state: GameState;
  lastSaved: number;
}

// ============================================================================
// Save & Load
// ============================================================================

export function saveGameState(state: GameState): void {
  try {
    const data: StoredData = {
      version: CURRENT_VERSION,
      state,
      lastSaved: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("[HabitRPG] Failed to save game state:", error);
  }
}

export function loadGameState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data: StoredData = JSON.parse(raw);

    // Run migrations if needed
    if (data.version < CURRENT_VERSION) {
      return migrateState(data);
    }

    return data.state;
  } catch (error) {
    console.error("[HabitRPG] Failed to load game state:", error);
    return null;
  }
}

export function clearGameState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ============================================================================
// Migrations
// ============================================================================

function migrateState(data: StoredData): GameState {
  let state = data.state;
  let version = data.version;

  // Migration chain
  while (version < CURRENT_VERSION) {
    switch (version) {
      case 0:
        // Migration from v0 to v1
        state = migrateV0ToV1(state);
        break;
      // Add more migrations as needed
    }
    version++;
  }

  // Save migrated state
  saveGameState(state);

  return state;
}

function migrateV0ToV1(state: GameState): GameState {
  // Example migration - add new fields with defaults
  return {
    ...state,
    version: 1,
  };
}

// ============================================================================
// Backup & Export
// ============================================================================

export function exportGameData(): string {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw || "";
}

export function importGameData(jsonString: string): boolean {
  try {
    const data: StoredData = JSON.parse(jsonString);

    // Validate structure
    if (!data.version || !data.state) {
      throw new Error("Invalid game data format");
    }

    localStorage.setItem(STORAGE_KEY, jsonString);
    return true;
  } catch (error) {
    console.error("[HabitRPG] Failed to import game data:", error);
    return false;
  }
}

/**
 * Habit RPG - Scheduler System
 * Handles daily, weekly, and monthly resets with timezone support
 */

import {
  getGameDate,
  isNewDay,
  isNewWeek,
  getWeekNumber,
} from "../domain/rules";
import { GRACE_TOKENS_PER_WEEK } from "../domain/constants";
import type { GameState, QuestInstance } from "../domain/types";

// ============================================================================
// Reset Functions
// ============================================================================

export interface ResetResult {
  dailyReset: boolean;
  weeklyReset: boolean;
  monthlyReset: boolean;
  missedQuests: QuestInstance[];
  newFeatures: string[];
}

/**
 * Main scheduler function - checks and applies all resets
 * This is deterministic: same input always produces same output
 *
 * NOTE: Feature unlocks are now derived from character.level via getUnlockedFeaturesForLevel()
 * and are no longer processed here.
 */
export function processScheduledResets(
  state: GameState,
  currentDate: string
): { newState: Partial<GameState>; result: ResetResult } {
  const result: ResetResult = {
    dailyReset: false,
    weeklyReset: false,
    monthlyReset: false,
    missedQuests: [],
    newFeatures: [],
  };

  let updates: Partial<GameState> = {};

  const lastDate = state.streak.lastCompletedDate || state.season.startDate;

  // Daily Reset
  if (isNewDay(lastDate, currentDate)) {
    result.dailyReset = true;
    const dailyUpdates = processDailyReset(state, currentDate);
    updates = { ...updates, ...dailyUpdates.updates };
    result.missedQuests = dailyUpdates.missedQuests;
  }

  // Weekly Reset
  if (isNewWeek(lastDate, currentDate)) {
    result.weeklyReset = true;
    const weeklyUpdates = processWeeklyReset(state, currentDate);
    updates = { ...updates, ...weeklyUpdates };
  }

  // Update week number (for tracking purposes only, not for unlocks)
  const currentWeek = getWeekNumber(state.season.startDate, currentDate);
  if (currentWeek !== state.season.currentWeek) {
    updates.season = {
      ...state.season,
      ...(updates.season || {}),
      currentWeek,
    };
  }

  return { newState: updates, result };
}

// ============================================================================
// Daily Reset
// ============================================================================

interface DailyResetResult {
  updates: Partial<GameState>;
  missedQuests: QuestInstance[];
}

function processDailyReset(
  state: GameState,
  currentDate: string
): DailyResetResult {
  const updates: Partial<GameState> = {};

  // Find incomplete quests from previous day(s)
  const missedQuests = state.quests.filter(
    (q) => q.status === "pending" && q.date < currentDate
  );

  // Process streak for missed quests
  let newStreak = { ...state.streak };

  if (missedQuests.length > 0 && !state.streak.isRecoveryDay) {
    // Check if we can use grace token
    if (newStreak.graceTokens > 0) {
      newStreak.graceTokens -= 1;
      // Mark quests as grace
      updates.quests = state.quests.map((q) =>
        missedQuests.find((m) => m.id === q.id)
          ? { ...q, status: "grace" as const }
          : q
      );
    } else if (newStreak.streakShields > 0) {
      newStreak.streakShields -= 1;
      updates.quests = state.quests.map((q) =>
        missedQuests.find((m) => m.id === q.id)
          ? { ...q, status: "skipped" as const }
          : q
      );
    } else {
      // Streak broken
      newStreak.currentStreak = 0;
      updates.quests = state.quests.map((q) =>
        missedQuests.find((m) => m.id === q.id)
          ? { ...q, status: "skipped" as const }
          : q
      );

      // Morale hit
      updates.character = {
        ...state.character,
        morale: Math.max(0, state.character.morale - 10),
      };
    }
  }

  // Reset recovery day flag
  newStreak.isRecoveryDay = false;
  newStreak.lastCompletedDate = currentDate;

  updates.streak = newStreak;

  // Reset energy
  updates.character = {
    ...state.character,
    ...(updates.character || {}),
    energy: state.character.maxEnergy,
  };

  return { updates, missedQuests };
}

// ============================================================================
// Weekly Reset
// ============================================================================

function processWeeklyReset(
  state: GameState,
  currentDate: string
): Partial<GameState> {
  const updates: Partial<GameState> = {};

  // Refresh grace tokens
  const newGraceTokens = Math.min(
    state.streak.graceTokens + GRACE_TOKENS_PER_WEEK,
    state.streak.maxGraceTokens
  );

  updates.streak = {
    ...state.streak,
    graceTokens: newGraceTokens,
    weeklyGraceRefreshDate: currentDate,
  };

  // Reset weekly boss damage counter
  updates.boss = {
    ...state.boss,
    weeklyDamageDealt: 0,
    weeklyQuestsCompleted: 0,
  };

  return updates;
}

// ============================================================================
// Streak Shield Earning
// ============================================================================

export function checkStreakShieldEarned(
  streak: number,
  interval: number,
  currentShields: number
): boolean {
  // Earn a shield every [interval] days of streak
  const shouldHaveShields = Math.floor(streak / interval);
  return shouldHaveShields > currentShields;
}

// ============================================================================
// Day Boundary Check
// ============================================================================

export function shouldTriggerReset(
  lastResetDate: string,
  timezone: string,
  dayBoundaryHour: number
): boolean {
  const currentGameDate = getGameDate(timezone, dayBoundaryHour);
  return currentGameDate !== lastResetDate;
}

/**
 * Habit RPG - Domain Rules
 * Business logic and calculations
 */

import type { Habit, QuestInstance, Stats } from "./types";
import {
  BASE_XP,
  BASE_GOLD,
  DIFFICULTY_MULTIPLIERS,
  effortFactor,
  streakBonus,
  xpToLevel,
  DAILY_XP_CAP_BASE,
  DAILY_XP_CAP_PER_LEVEL,
  LOW_MORALE_THRESHOLD,
  LOW_MORALE_PENALTY,
  ARCHETYPES,
  CATEGORY_TO_STAT,
} from "./constants";

// ============================================================================
// XP Calculations
// ============================================================================

export interface XpCalculationParams {
  difficulty: number;
  effortMinutes: number;
  streak: number;
  morale: number;
  hasProof: boolean;
  archetypeId: string | null;
  unlockedSkillIds: string[];
}

export function calculateXpReward(params: XpCalculationParams): number {
  const {
    difficulty,
    effortMinutes,
    streak,
    morale,
    hasProof,
    archetypeId,
    unlockedSkillIds,
  } = params;

  let xp = BASE_XP;

  // Difficulty multiplier
  xp *= DIFFICULTY_MULTIPLIERS[difficulty] ?? 1;

  // Effort factor
  xp *= effortFactor(effortMinutes);

  // Streak bonus
  xp *= streakBonus(streak);

  // Morale penalty
  if (morale < LOW_MORALE_THRESHOLD) {
    xp *= LOW_MORALE_PENALTY;
  }

  // Proof bonus (skill: focus-2-1)
  if (hasProof && unlockedSkillIds.includes("focus-2-1")) {
    xp *= 1.15;
  }

  // Archetype bonus
  if (archetypeId && ARCHETYPES[archetypeId]) {
    xp *= ARCHETYPES[archetypeId].bonuses.xpMultiplier;
  }

  // Deep work bonus (skill: focus-1-1)
  if (effortMinutes >= 45 && unlockedSkillIds.includes("focus-1-1")) {
    xp *= 1.2;
  }

  return Math.floor(xp);
}

export function calculateGoldReward(params: XpCalculationParams): number {
  const { difficulty, effortMinutes, unlockedSkillIds } = params;

  let gold = BASE_GOLD;

  gold *= DIFFICULTY_MULTIPLIERS[difficulty] ?? 1;
  gold *= effortFactor(effortMinutes) * 0.7; // Gold scales less than XP

  // Project focus bonus (skill: focus-1-2)
  if (unlockedSkillIds.includes("focus-1-2")) {
    gold *= 1.1;
  }

  return Math.floor(gold);
}

// ============================================================================
// Level Calculations
// ============================================================================

export function calculateLevel(totalXp: number): {
  level: number;
  currentXp: number;
  xpToNext: number;
} {
  let level = 1;
  let remainingXp = totalXp;

  while (remainingXp >= xpToLevel(level)) {
    remainingXp -= xpToLevel(level);
    level++;
  }

  return {
    level,
    currentXp: remainingXp,
    xpToNext: xpToLevel(level),
  };
}

export function getDailyXpCap(level: number): number {
  return DAILY_XP_CAP_BASE + level * DAILY_XP_CAP_PER_LEVEL;
}

// ============================================================================
// Stat Growth
// ============================================================================

export function getStatGrowth(
  habit: Habit,
  archetypeId: string | null
): Partial<Stats> {
  const baseStat = habit.statAffinity || CATEGORY_TO_STAT[habit.category];
  let growth = 1;

  // Archetype bonus
  if (archetypeId && ARCHETYPES[archetypeId]) {
    const archetype = ARCHETYPES[archetypeId];
    const archetypeGrowth = archetype.bonuses.statGrowth[baseStat];
    if (archetypeGrowth) {
      growth *= archetypeGrowth;
    }
  }

  return {
    [baseStat]: Math.floor(growth),
  } as Partial<Stats>;
}

// ============================================================================
// Quest Generation
// ============================================================================

export function generateDailyQuests(
  habits: Habit[],
  date: string,
  params: XpCalculationParams
): QuestInstance[] {
  const activeHabits = habits.filter((h) => h.isActive);

  return activeHabits.map((habit) => {
    const questParams = {
      ...params,
      difficulty: habit.difficulty,
      effortMinutes: habit.effortMinutes,
    };

    return {
      id: `${date}-${habit.id}`,
      habitId: habit.id,
      habitTitle: habit.title,
      type: "daily" as const,
      date,
      status: "pending" as const,
      difficulty: habit.difficulty,
      effortMinutes: habit.effortMinutes,
      xpReward: calculateXpReward(questParams),
      goldReward: calculateGoldReward(questParams),
    };
  });
}

// ============================================================================
// Energy Calculations
// ============================================================================

export function calculateEnergyCost(
  effortMinutes: number,
  unlockedSkillIds: string[]
): number {
  let cost = Math.ceil(effortMinutes / 4); // ~15 energy per 60 min

  // Flow state skill reduces cost for long quests
  if (effortMinutes >= 45 && unlockedSkillIds.includes("focus-3-1")) {
    cost *= 0.75;
  }

  return Math.floor(cost);
}

// ============================================================================
// Boss Damage
// ============================================================================

export function calculateBossDamage(quest: QuestInstance): number {
  // Base damage from quest difficulty and effort
  let damage = quest.difficulty * 5;
  damage += Math.floor(quest.effortMinutes / 10);

  return damage;
}

// ============================================================================
// Date Utilities
// ============================================================================

export function getGameDate(timezone: string, dayBoundaryHour: number): string {
  const now = new Date();

  // Simple timezone offset (for full support, use a library)
  const utcOffset = getTimezoneOffset(timezone);
  const localTime = new Date(now.getTime() + utcOffset * 60 * 1000);

  // If before day boundary, it's still "yesterday" in game terms
  if (localTime.getHours() < dayBoundaryHour) {
    localTime.setDate(localTime.getDate() - 1);
  }

  return localTime.toISOString().split("T")[0];
}

function getTimezoneOffset(timezone: string): number {
  // Simplified timezone handling
  const offsets: Record<string, number> = {
    "Asia/Bangkok": 7 * 60,
    "Asia/Ho_Chi_Minh": 7 * 60,
    UTC: 0,
    "America/New_York": -5 * 60,
  };
  return offsets[timezone] ?? 7 * 60; // Default to +7
}

export function getWeekNumber(startDate: string, currentDate: string): number {
  const start = new Date(startDate);
  const current = new Date(currentDate);
  const diffTime = current.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7) + 1;
}

export function isNewDay(lastDate: string, currentDate: string): boolean {
  return lastDate !== currentDate;
}

export function isNewWeek(lastDate: string, currentDate: string): boolean {
  const last = new Date(lastDate);
  const current = new Date(currentDate);

  // Get Monday of each week
  const getMonday = (d: Date) => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff)).toISOString().split("T")[0];
  };

  return getMonday(last) !== getMonday(current);
}

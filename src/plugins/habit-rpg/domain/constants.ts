/**
 * Habit RPG - Constants & Configuration
 * Game balance values and configuration
 */

import type { Archetype, SkillNode, StatKey } from "./types";

// ============================================================================
// XP & Level System
// ============================================================================

export const BASE_XP = 10;
export const DAILY_XP_CAP_BASE = 250;
export const DAILY_XP_CAP_PER_LEVEL = 10;

/**
 * Calculate XP required to reach a level
 * Formula: 100 * n^1.35
 */
export const xpToLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.35));
};

/**
 * Calculate effort factor based on minutes
 * effortFactor = 1 + ln(minutes/10) * 0.6
 */
export const effortFactor = (minutes: number): number => {
  if (minutes <= 0) return 1;
  return 1 + Math.log(minutes / 10) * 0.6;
};

// Difficulty multipliers
export const DIFFICULTY_MULTIPLIERS: Record<number, number> = {
  1: 0.5,
  2: 0.8,
  3: 1.0,
  4: 1.3,
  5: 1.6,
};

// ============================================================================
// Streak System
// ============================================================================

export const MAX_GRACE_TOKENS = 2;
export const GRACE_TOKENS_PER_WEEK = 1;
export const STREAK_SHIELD_INTERVAL = 14; // Days between shield earnings

/**
 * Calculate streak bonus multiplier
 * Max +60% at 30-day streak
 */
export const streakBonus = (streak: number): number => {
  return 1 + Math.min(streak, 30) * 0.02;
};

// ============================================================================
// Energy & Morale
// ============================================================================

export const MAX_ENERGY = 100;
export const ENERGY_PER_QUEST = 15;
export const ENERGY_REGEN_PER_HOUR = 5;

export const MAX_MORALE = 100;
export const MORALE_DECAY_PER_MISS = 5;
export const MORALE_GAIN_PER_COMPLETE = 2;
export const LOW_MORALE_THRESHOLD = 30;
export const LOW_MORALE_PENALTY = 0.8; // 20% less rewards

// ============================================================================
// Currency
// ============================================================================

export const BASE_GOLD = 5;
export const QUEST_REROLL_COST = 20;
export const GRACE_TOKEN_CRAFT_COST = 50;

// Essence Shards from bosses
export const WEEKLY_BOSS_SHARDS = 10;
export const RAID_BOSS_SHARDS = 25;

// ============================================================================
// Archetypes
// ============================================================================

export const ARCHETYPES: Record<string, Archetype> = {
  builder: {
    id: "builder",
    name: "Builder",
    description: "Masters of consistency and steady progress",
    primaryStat: "STR",
    secondaryStat: "VIT",
    bonuses: {
      xpMultiplier: 1.1,
      statGrowth: { STR: 1.2, VIT: 1.1 },
    },
  },
  scholar: {
    id: "scholar",
    name: "Scholar",
    description: "Seekers of knowledge and deep understanding",
    primaryStat: "INT",
    secondaryStat: "WIS",
    bonuses: {
      xpMultiplier: 1.1,
      statGrowth: { INT: 1.2, WIS: 1.1 },
    },
  },
  athlete: {
    id: "athlete",
    name: "Athlete",
    description: "Champions of physical excellence",
    primaryStat: "VIT",
    secondaryStat: "DEX",
    bonuses: {
      xpMultiplier: 1.1,
      statGrowth: { VIT: 1.2, DEX: 1.1 },
    },
  },
  creator: {
    id: "creator",
    name: "Creator",
    description: "Artisans who bring ideas to life",
    primaryStat: "DEX",
    secondaryStat: "INT",
    bonuses: {
      xpMultiplier: 1.1,
      statGrowth: { DEX: 1.2, INT: 1.1 },
    },
  },
};

// ============================================================================
// Stat Affinity Mapping
// ============================================================================

export const CATEGORY_TO_STAT: Record<string, StatKey> = {
  ritual: "STR",
  practice: "DEX",
  project: "INT",
  recovery: "WIS",
};

// ============================================================================
// Skill Tree Nodes
// ============================================================================

export const SKILL_NODES: SkillNode[] = [
  // ===== Discipline Branch =====
  {
    id: "disc-1-1",
    branch: "discipline",
    tier: 1,
    name: "Early Riser",
    description: "Bonus XP for morning quests",
    effect: "+15% XP for morning window quests",
    cost: 5,
    prerequisiteIds: [],
    weekUnlock: 1,
  },
  {
    id: "disc-1-2",
    branch: "discipline",
    tier: 1,
    name: "Routine Master",
    description: "Streak protection starts earlier",
    effect: "Grace tokens refresh +1 day earlier",
    cost: 5,
    prerequisiteIds: [],
    weekUnlock: 1,
  },
  {
    id: "disc-2-1",
    branch: "discipline",
    tier: 2,
    name: "Streak Shield",
    description: "Earn streak shields faster",
    effect: "Streak shields every 10 days (was 14)",
    cost: 10,
    prerequisiteIds: ["disc-1-1", "disc-1-2"],
    weekUnlock: 3,
  },
  {
    id: "disc-2-2",
    branch: "discipline",
    tier: 2,
    name: "Quest Chain",
    description: "Auto-suggest next quest",
    effect: "Completing quest A suggests related quest B",
    cost: 10,
    prerequisiteIds: ["disc-1-2"],
    weekUnlock: 3,
  },
  {
    id: "disc-3-1",
    branch: "discipline",
    tier: 3,
    name: "Iron Will",
    description: "Reduced morale decay",
    effect: "Morale decay -50%",
    cost: 15,
    prerequisiteIds: ["disc-2-1"],
    weekUnlock: 6,
  },
  {
    id: "disc-4-1",
    branch: "discipline",
    tier: 4,
    name: "Capstone: Unstoppable",
    description: "Ultimate consistency",
    effect: "First miss each week costs no streak",
    cost: 25,
    prerequisiteIds: ["disc-3-1"],
    weekUnlock: 9,
  },

  // ===== Focus Branch =====
  {
    id: "focus-1-1",
    branch: "focus",
    tier: 1,
    name: "Deep Work",
    description: "Bonus for long sessions",
    effect: "+20% XP for 45+ min quests",
    cost: 5,
    prerequisiteIds: [],
    weekUnlock: 1,
  },
  {
    id: "focus-1-2",
    branch: "focus",
    tier: 1,
    name: "Project Focus",
    description: "Enhanced project rewards",
    effect: "+10% Gold from project quests",
    cost: 5,
    prerequisiteIds: [],
    weekUnlock: 1,
  },
  {
    id: "focus-2-1",
    branch: "focus",
    tier: 2,
    name: "Proof Bonus",
    description: "Rewards for documented work",
    effect: "+15% XP when quest has proof",
    cost: 10,
    prerequisiteIds: ["focus-1-1"],
    weekUnlock: 3,
  },
  {
    id: "focus-2-2",
    branch: "focus",
    tier: 2,
    name: "Session Quest",
    description: "Unlock timed session quests",
    effect: "Access to 45/60/90 min deep sessions",
    cost: 10,
    prerequisiteIds: ["focus-1-1", "focus-1-2"],
    weekUnlock: 5,
  },
  {
    id: "focus-3-1",
    branch: "focus",
    tier: 3,
    name: "Flow State",
    description: "Energy efficiency",
    effect: "-25% energy cost for long quests",
    cost: 15,
    prerequisiteIds: ["focus-2-1", "focus-2-2"],
    weekUnlock: 6,
  },
  {
    id: "focus-4-1",
    branch: "focus",
    tier: 4,
    name: "Capstone: Mastery",
    description: "Ultimate focus",
    effect: "Double XP from first 90-min session daily",
    cost: 25,
    prerequisiteIds: ["focus-3-1"],
    weekUnlock: 9,
  },

  // ===== Resilience Branch =====
  {
    id: "resil-1-1",
    branch: "resilience",
    tier: 1,
    name: "Quick Recovery",
    description: "Faster energy regeneration",
    effect: "+20% energy regen rate",
    cost: 5,
    prerequisiteIds: [],
    weekUnlock: 1,
  },
  {
    id: "resil-1-2",
    branch: "resilience",
    tier: 1,
    name: "Grace Extended",
    description: "More grace tokens",
    effect: "+1 max grace tokens",
    cost: 5,
    prerequisiteIds: [],
    weekUnlock: 2,
  },
  {
    id: "resil-2-1",
    branch: "resilience",
    tier: 2,
    name: "Recovery Day+",
    description: "Enhanced recovery",
    effect: "Recovery days give +10 morale",
    cost: 10,
    prerequisiteIds: ["resil-1-1", "resil-1-2"],
    weekUnlock: 3,
  },
  {
    id: "resil-2-2",
    branch: "resilience",
    tier: 2,
    name: "Bounce Back",
    description: "Reduced streak break penalty",
    effect: "After streak break, start at streak 3",
    cost: 10,
    prerequisiteIds: ["resil-1-2"],
    weekUnlock: 4,
  },
  {
    id: "resil-3-1",
    branch: "resilience",
    tier: 3,
    name: "Mental Fortitude",
    description: "Morale protection",
    effect: "Morale cannot drop below 20",
    cost: 15,
    prerequisiteIds: ["resil-2-1"],
    weekUnlock: 6,
  },
  {
    id: "resil-4-1",
    branch: "resilience",
    tier: 4,
    name: "Capstone: Phoenix",
    description: "Ultimate resilience",
    effect: "Once per season: full streak restore",
    cost: 25,
    prerequisiteIds: ["resil-3-1"],
    weekUnlock: 9,
  },
];

// ============================================================================
// Boss Templates
// ============================================================================

export const WEEKLY_BOSS_TEMPLATES = [
  {
    id: "dawn-sloth",
    name: "Dawn Sloth",
    description: "Born from missed morning routines",
    weakness: "morning",
    baseHealth: 100,
  },
  {
    id: "the-drift",
    name: "The Drift",
    description: "Manifested from procrastinated projects",
    weakness: "project",
    baseHealth: 120,
  },
  {
    id: "entropy",
    name: "Entropy",
    description: "Feeds on broken habits",
    weakness: "ritual",
    baseHealth: 100,
  },
  {
    id: "burnout",
    name: "Burnout",
    description: "Thrives when recovery is neglected",
    weakness: "recovery",
    baseHealth: 110,
  },
];

// ============================================================================
// Week-Gated Features
// ============================================================================

export const FEATURE_UNLOCKS: Record<number, string[]> = {
  1: ["daily_quests", "basic_habits", "xp_level"],
  2: ["streak_system", "grace_tokens", "calendar"],
  3: ["archetypes", "skill_tree_t2"],
  4: ["weekly_boss", "items"],
  5: ["project_quests", "deep_sessions"],
  6: ["crafting", "skill_tree_t3"],
  7: ["class_hybrid"],
  8: ["monthly_raid", "relics"],
  9: ["skill_tree_t4", "capstones"],
  10: ["dynamic_difficulty"],
  11: ["prestige_lite"],
  12: ["season_finale"],
};

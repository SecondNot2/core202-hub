/**
 * Habit RPG - Domain Types
 * Core type definitions for the gamified habits system
 */

// ============================================================================
// Character & Stats
// ============================================================================

export type StatKey = "STR" | "INT" | "DEX" | "WIS" | "VIT";

export interface Stats {
  STR: number; // Strength - physical habits
  INT: number; // Intelligence - learning/study
  DEX: number; // Dexterity - skill practice
  WIS: number; // Wisdom - reflection/recovery
  VIT: number; // Vitality - health habits
}

export type ArchetypeId = "builder" | "scholar" | "athlete" | "creator";

export interface Archetype {
  id: ArchetypeId;
  name: string;
  description: string;
  primaryStat: StatKey;
  secondaryStat: StatKey;
  bonuses: {
    xpMultiplier: number;
    statGrowth: Partial<Record<StatKey, number>>;
  };
}

export interface Character {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXpEarned: number;
  stats: Stats;
  energy: number;
  maxEnergy: number;
  morale: number;
  archetypeId: ArchetypeId | null;
  hybridArchetypeId: ArchetypeId | null;
  createdAt: number;
  weekNumber: number; // Tracks progression week
}

// ============================================================================
// Habit System
// ============================================================================

export type HabitCategory = "ritual" | "practice" | "project" | "recovery";
export type HabitWindow = "anytime" | "morning" | "afternoon" | "evening";
export type ProofMode = "none" | "timer" | "checklist" | "note";

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  effortMinutes: number;
  window: HabitWindow;
  proofMode: ProofMode;
  statAffinity: StatKey;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// Quest System
// ============================================================================

export type QuestStatus = "pending" | "completed" | "skipped" | "grace";
export type QuestType = "daily" | "weekly" | "challenge";

export interface QuestInstance {
  id: string;
  habitId: string;
  habitTitle: string;
  type: QuestType;
  date: string; // YYYY-MM-DD
  status: QuestStatus;
  difficulty: number;
  effortMinutes: number;
  xpReward: number;
  goldReward: number;
  completedAt?: number;
  proof?: string;
}

// ============================================================================
// Streak System
// ============================================================================

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  graceTokens: number;
  maxGraceTokens: number;
  streakShields: number;
  lastCompletedDate: string;
  isRecoveryDay: boolean;
  weeklyGraceRefreshDate: string;
}

// ============================================================================
// Currency & Inventory
// ============================================================================

export type RelicRarity = "common" | "rare" | "epic" | "legendary";

export interface Relic {
  id: string;
  name: string;
  description: string;
  rarity: RelicRarity;
  effect: string;
  obtainedAt: number;
  source: "boss" | "raid" | "achievement";
}

export type ConsumableType =
  | "grace_token"
  | "energy_boost"
  | "morale_boost"
  | "xp_boost";

export interface Consumable {
  id: string;
  type: ConsumableType;
  name: string;
  quantity: number;
}

export interface Inventory {
  gold: number;
  essenceShards: number;
  relics: Relic[];
  consumables: Consumable[];
}

// ============================================================================
// Skill Tree
// ============================================================================

export type SkillBranch = "discipline" | "focus" | "resilience";
export type SkillTier = 1 | 2 | 3 | 4;

export interface SkillNode {
  id: string;
  branch: SkillBranch;
  tier: SkillTier;
  name: string;
  description: string;
  effect: string;
  cost: number; // Essence Shards
  prerequisiteIds: string[];
  levelUnlock: number; // Level when this node becomes available
}

export interface SkillTreeState {
  unlockedSkillIds: string[];
  availableShards: number;
}

// ============================================================================
// Boss System
// ============================================================================

export type BossType = "weekly" | "raid";

export interface Boss {
  id: string;
  name: string;
  description: string;
  type: BossType;
  maxHealth: number;
  currentHealth: number;
  difficulty: number;
  weakness?: string; // Based on habit analysis
  rewards: {
    gold: number;
    shards: number;
    relicId?: string;
  };
  spawnDate: string;
  expiresAt: number;
  isDefeated: boolean;
}

export interface BossState {
  currentBoss: Boss | null;
  defeatedBossIds: string[];
  weeklyDamageDealt: number;
  weeklyQuestsCompleted: number;
}

// ============================================================================
// Season & Progression
// ============================================================================

export interface SeasonState {
  seasonNumber: number;
  currentWeek: number;
  startDate: string;
  unlockedFeatures: string[];
}

// ============================================================================
// Event Log
// ============================================================================

export type EventType =
  | "quest_completed"
  | "quest_skipped"
  | "grace_used"
  | "level_up"
  | "feature_unlocked"
  | "boss_damaged"
  | "boss_defeated"
  | "skill_unlocked"
  | "item_purchased"
  | "item_crafted"
  | "streak_broken"
  | "streak_milestone"
  | "github_quest_completed";

export interface GameEvent {
  id: string;
  type: EventType;
  timestamp: number;
  data: Record<string, unknown>;
}

// ============================================================================
// Daily Snapshot
// ============================================================================

export interface DailySnapshot {
  date: string;
  level: number;
  xp: number;
  streak: number;
  questsCompleted: number;
  questsTotal: number;
  xpEarned: number;
  goldEarned: number;
}

// ============================================================================
// GitHub Integration
// ============================================================================

export interface GitHubConfig {
  username: string | null;
  enabled: boolean;
  minCommitsForQuest: number;
  bonusXpPerCommit: number;
  lastQuestCompletedDate?: string;
}

// ============================================================================
// Game State (Root)
// ============================================================================

export interface GameState {
  version: number;
  character: Character;
  habits: Habit[];
  quests: QuestInstance[];
  streak: StreakState;
  inventory: Inventory;
  skillTree: SkillTreeState;
  boss: BossState;
  season: SeasonState;
  events: GameEvent[];
  snapshots: DailySnapshot[];
  settings: GameSettings;
  github: GitHubConfig;
}

export interface GameSettings {
  timezone: string;
  dayBoundaryHour: number; // e.g., 4 = 4:00 AM
  notifications: boolean;
}

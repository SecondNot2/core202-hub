/**
 * Habit RPG - Boss System
 * Weekly boss generation and combat logic
 */

import type { Boss, QuestInstance, Relic } from "../domain/types";
import { WEEKLY_BOSS_TEMPLATES, WEEKLY_BOSS_SHARDS } from "../domain/constants";
import { calculateBossDamage } from "../domain/rules";

// ============================================================================
// Boss Generation
// ============================================================================

export interface HabitAnalysis {
  missedMorning: number;
  missedProject: number;
  missedRitual: number;
  missedRecovery: number;
  totalMissed: number;
  totalCompleted: number;
}

/**
 * Analyze the past week's performance to determine boss type
 */
export function analyzeWeeklyPerformance(
  quests: QuestInstance[]
): HabitAnalysis {
  const analysis: HabitAnalysis = {
    missedMorning: 0,
    missedProject: 0,
    missedRitual: 0,
    missedRecovery: 0,
    totalMissed: 0,
    totalCompleted: 0,
  };

  for (const quest of quests) {
    if (quest.status === "completed") {
      analysis.totalCompleted++;
    } else if (quest.status === "skipped") {
      analysis.totalMissed++;
      // Note: In full implementation, we'd track quest window/category
      // For now, distribute evenly
    }
  }

  return analysis;
}

/**
 * Generate a weekly boss based on player weaknesses
 */
export function generateWeeklyBoss(
  analysis: HabitAnalysis,
  playerLevel: number,
  weekNumber: number
): Boss {
  // Find the category with most misses
  const weaknesses = [
    { type: "morning", count: analysis.missedMorning, template: "dawn-sloth" },
    { type: "project", count: analysis.missedProject, template: "the-drift" },
    { type: "ritual", count: analysis.missedRitual, template: "entropy" },
    { type: "recovery", count: analysis.missedRecovery, template: "burnout" },
  ];

  // Sort by weakness count, or random if tied
  weaknesses.sort((a, b) => b.count - a.count);

  // Pick template (highest weakness, or random if no clear weakness)
  const selectedId =
    weaknesses[0].count > 0
      ? weaknesses[0].template
      : WEEKLY_BOSS_TEMPLATES[
          Math.floor(Math.random() * WEEKLY_BOSS_TEMPLATES.length)
        ].id;

  const template =
    WEEKLY_BOSS_TEMPLATES.find((t) => t.id === selectedId) ||
    WEEKLY_BOSS_TEMPLATES[0];

  // Scale health with player level and week
  const healthScale = 1 + (playerLevel - 1) * 0.1 + weekNumber * 0.05;
  const maxHealth = Math.floor(template.baseHealth * healthScale);

  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  return {
    id: `boss-w${weekNumber}-${template.id}`,
    name: template.name,
    description: template.description,
    type: "weekly",
    maxHealth,
    currentHealth: maxHealth,
    difficulty: Math.min(5, Math.ceil(weekNumber / 2)),
    weakness: template.weakness,
    rewards: {
      gold: 50 + weekNumber * 10,
      shards: WEEKLY_BOSS_SHARDS,
      relicId: weekNumber >= 4 ? generateRelicId(weekNumber) : undefined,
    },
    spawnDate: new Date().toISOString().split("T")[0],
    expiresAt: now + oneWeek,
    isDefeated: false,
  };
}

// ============================================================================
// Boss Combat
// ============================================================================

export interface BossCombatResult {
  damageDealt: number;
  isDefeated: boolean;
  rewards?: {
    gold: number;
    shards: number;
    relic?: Relic;
  };
}

/**
 * Deal damage to boss from completed quest
 */
export function dealBossDamage(
  boss: Boss,
  quest: QuestInstance
): BossCombatResult {
  const damage = calculateBossDamage(quest);

  // Bonus damage if quest matches boss weakness
  let finalDamage = damage;
  // In full implementation, check if quest.habitCategory matches boss.weakness

  const newHealth = Math.max(0, boss.currentHealth - finalDamage);
  const isDefeated = newHealth <= 0;

  const result: BossCombatResult = {
    damageDealt: finalDamage,
    isDefeated,
  };

  if (isDefeated) {
    result.rewards = {
      gold: boss.rewards.gold,
      shards: boss.rewards.shards,
      relic: boss.rewards.relicId
        ? generateRelic(boss.rewards.relicId, boss.name)
        : undefined,
    };
  }

  return result;
}

// ============================================================================
// Relic Generation
// ============================================================================

function generateRelicId(weekNumber: number): string {
  return `relic-w${weekNumber}-${Date.now()}`;
}

function generateRelic(id: string, bossName: string): Relic {
  const relicNames: Record<string, string> = {
    "dawn-sloth": "Sloth's Timepiece",
    "the-drift": "Anchor of Focus",
    entropy: "Shard of Order",
    burnout: "Ember of Renewal",
  };

  const baseName = Object.keys(relicNames).find((key) =>
    bossName.toLowerCase().includes(key.replace("-", " "))
  );

  return {
    id,
    name: baseName ? relicNames[baseName] : `Trophy of ${bossName}`,
    description: `A rare artifact obtained by defeating ${bossName}`,
    rarity: "rare",
    effect: "+5% XP from all quests",
    obtainedAt: Date.now(),
    source: "boss",
  };
}

// ============================================================================
// Boss State Updates
// ============================================================================

export function updateBossHealth(boss: Boss, damage: number): Boss {
  return {
    ...boss,
    currentHealth: Math.max(0, boss.currentHealth - damage),
    isDefeated: boss.currentHealth - damage <= 0,
  };
}

export function isBossExpired(boss: Boss): boolean {
  return Date.now() > boss.expiresAt;
}

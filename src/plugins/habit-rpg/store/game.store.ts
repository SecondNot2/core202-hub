/**
 * Habit RPG - Main Game Store
 * Unified Zustand store for all game state
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  GameState,
  Character,
  Habit,
  StreakState,
  Inventory,
  SkillTreeState,
  BossState,
  SeasonState,
  GameEvent,
  GameSettings,
  StatKey,
  ArchetypeId,
} from "../domain/types";
import {
  xpToLevel,
  MAX_GRACE_TOKENS,
  MAX_ENERGY,
  MAX_MORALE,
  STREAK_SHIELD_INTERVAL,
} from "../domain/constants";
import {
  calculateXpReward,
  calculateGoldReward,
  getStatGrowth,
  generateDailyQuests,
  calculateEnergyCost,
  getGameDate,
} from "../domain/rules";
import {
  processScheduledResets,
  checkStreakShieldEarned,
} from "../systems/scheduler.system";
import { dealBossDamage, updateBossHealth } from "../systems/boss.system";

// ============================================================================
// Initial State Factory
// ============================================================================

const createInitialCharacter = (): Character => ({
  id: `char-${Date.now()}`,
  name: "Hero",
  avatar: "default",
  level: 1,
  xp: 0,
  xpToNextLevel: xpToLevel(1),
  totalXpEarned: 0,
  stats: { STR: 1, INT: 1, DEX: 1, WIS: 1, VIT: 1 },
  energy: MAX_ENERGY,
  maxEnergy: MAX_ENERGY,
  morale: MAX_MORALE,
  archetypeId: null,
  hybridArchetypeId: null,
  createdAt: Date.now(),
  weekNumber: 1,
});

const createInitialStreak = (): StreakState => ({
  currentStreak: 0,
  longestStreak: 0,
  graceTokens: MAX_GRACE_TOKENS,
  maxGraceTokens: MAX_GRACE_TOKENS,
  streakShields: 0,
  lastCompletedDate: new Date().toISOString().split("T")[0],
  isRecoveryDay: false,
  weeklyGraceRefreshDate: new Date().toISOString().split("T")[0],
});

const createInitialInventory = (): Inventory => ({
  gold: 0,
  essenceShards: 0,
  relics: [],
  consumables: [],
});

const createInitialSkillTree = (): SkillTreeState => ({
  unlockedSkillIds: [],
  availableShards: 0,
});

const createInitialBoss = (): BossState => ({
  currentBoss: null,
  defeatedBossIds: [],
  weeklyDamageDealt: 0,
  weeklyQuestsCompleted: 0,
});

const createInitialSeason = (): SeasonState => ({
  seasonNumber: 1,
  currentWeek: 1,
  startDate: new Date().toISOString().split("T")[0],
  unlockedFeatures: ["daily_quests", "basic_habits", "xp_level"],
});

const createInitialSettings = (): GameSettings => ({
  timezone: "Asia/Bangkok",
  dayBoundaryHour: 4,
  notifications: true,
});

const createInitialState = (): GameState => ({
  version: 1,
  character: createInitialCharacter(),
  habits: [],
  quests: [],
  streak: createInitialStreak(),
  inventory: createInitialInventory(),
  skillTree: createInitialSkillTree(),
  boss: createInitialBoss(),
  season: createInitialSeason(),
  events: [],
  snapshots: [],
  settings: createInitialSettings(),
  github: {
    username: null,
    enabled: true,
    minCommitsForQuest: 1,
    bonusXpPerCommit: 5,
  },
});

// ============================================================================
// Store Actions Interface
// ============================================================================

interface GameActions {
  // Initialization
  initializeGame: () => void;
  resetGame: () => void;

  // Character
  setCharacterName: (name: string) => void;
  setArchetype: (archetypeId: ArchetypeId) => void;
  gainXp: (amount: number) => void;
  spendEnergy: (amount: number) => boolean;
  restoreEnergy: (amount: number) => void;
  adjustMorale: (delta: number) => void;

  // Habits
  addHabit: (
    habit: Omit<Habit, "id" | "createdAt" | "updatedAt" | "isActive">
  ) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string) => void;

  // Quests
  generateTodayQuests: () => void;
  completeQuest: (questId: string, proof?: string) => void;
  skipQuest: (questId: string) => void;
  useGraceToken: (questId: string) => boolean;

  // Streak
  triggerRecoveryDay: () => void;

  // Inventory
  earnGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  earnShards: (amount: number) => void;

  // Skills
  unlockSkill: (skillId: string) => boolean;

  // Boss
  checkBossSpawn: () => void;

  // Scheduler
  runScheduler: () => void;

  // Events
  logEvent: (type: GameEvent["type"], data: Record<string, unknown>) => void;

  // GitHub
  setGitHubUsername: (username: string | null) => void;
  setGitHubEnabled: (enabled: boolean) => void;
  completeGitHubQuest: (commits: number) => void;

  // Helpers
  getXpParams: () => {
    streak: number;
    morale: number;
    archetypeId: string | null;
    unlockedSkillIds: string[];
  };
}

type GameStore = GameState & GameActions;

// ============================================================================
// Store Implementation
// ============================================================================

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      // ===== Initialization =====
      initializeGame: () => {
        const state = get();
        const currentDate = getGameDate(
          state.settings.timezone,
          state.settings.dayBoundaryHour
        );

        // Run scheduler to check for resets
        const { newState } = processScheduledResets(state, currentDate);

        if (Object.keys(newState).length > 0) {
          set(newState as Partial<GameStore>);
        }

        // Generate today's quests if needed
        get().generateTodayQuests();
      },

      resetGame: () => set(createInitialState()),

      // ===== Character =====
      setCharacterName: (name) =>
        set((state) => ({
          character: { ...state.character, name },
        })),

      setArchetype: (archetypeId) =>
        set((state) => ({
          character: { ...state.character, archetypeId },
        })),

      gainXp: (amount) =>
        set((state) => {
          let { xp, xpToNextLevel, level, totalXpEarned } = state.character;

          xp += amount;
          totalXpEarned += amount;

          // Level up check
          while (xp >= xpToNextLevel) {
            xp -= xpToNextLevel;
            level++;
            xpToNextLevel = xpToLevel(level);

            // Log level up event
            get().logEvent("level_up", { newLevel: level });
          }

          return {
            character: {
              ...state.character,
              xp,
              xpToNextLevel,
              level,
              totalXpEarned,
              // Full energy on level up
              energy:
                level !== state.character.level
                  ? state.character.maxEnergy
                  : state.character.energy,
            },
          };
        }),

      spendEnergy: (amount) => {
        const state = get();
        if (state.character.energy < amount) return false;

        set({
          character: {
            ...state.character,
            energy: state.character.energy - amount,
          },
        });
        return true;
      },

      restoreEnergy: (amount) =>
        set((state) => ({
          character: {
            ...state.character,
            energy: Math.min(
              state.character.maxEnergy,
              state.character.energy + amount
            ),
          },
        })),

      adjustMorale: (delta) =>
        set((state) => ({
          character: {
            ...state.character,
            morale: Math.max(
              0,
              Math.min(MAX_MORALE, state.character.morale + delta)
            ),
          },
        })),

      // ===== Habits =====
      addHabit: (habitData) => {
        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...habitData,
              id: `habit-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 7)}`,
              isActive: true,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          ],
        }));
        // Generate quest for the newly added habit
        get().generateTodayQuests();
      },

      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...updates, updatedAt: Date.now() } : h
          ),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),

      toggleHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id
              ? { ...h, isActive: !h.isActive, updatedAt: Date.now() }
              : h
          ),
        })),

      // ===== Quests =====
      generateTodayQuests: () => {
        const state = get();
        const today = getGameDate(
          state.settings.timezone,
          state.settings.dayBoundaryHour
        );

        // Get existing quest habit IDs for today
        const todayQuests = state.quests.filter((q) => q.date === today);
        const existingHabitIds = new Set(todayQuests.map((q) => q.habitId));

        // Find habits that don't have quests yet
        const habitsWithoutQuests = state.habits.filter(
          (h) => h.isActive && !existingHabitIds.has(h.id)
        );

        // If no new habits need quests, return early
        if (habitsWithoutQuests.length === 0) return;

        const params = get().getXpParams();
        const newQuests = generateDailyQuests(habitsWithoutQuests, today, {
          ...params,
          difficulty: 1,
          effortMinutes: 10,
          hasProof: false,
        });

        set({ quests: [...state.quests, ...newQuests] });
      },

      completeQuest: (questId, proof) => {
        const state = get();
        const quest = state.quests.find((q) => q.id === questId);
        if (!quest || quest.status !== "pending") return;

        const habit = state.habits.find((h) => h.id === quest.habitId);
        if (!habit) return;

        // Calculate rewards
        const params = {
          ...get().getXpParams(),
          difficulty: quest.difficulty,
          effortMinutes: quest.effortMinutes,
          hasProof: !!proof,
        };

        const xpReward = calculateXpReward(params);
        const goldReward = calculateGoldReward(params);
        const energyCost = calculateEnergyCost(
          quest.effortMinutes,
          state.skillTree.unlockedSkillIds
        );

        // Check energy
        if (state.character.energy < energyCost) return;

        // Update quest
        set((s) => ({
          quests: s.quests.map((q) =>
            q.id === questId
              ? {
                  ...q,
                  status: "completed" as const,
                  completedAt: Date.now(),
                  proof,
                  xpReward,
                  goldReward,
                }
              : q
          ),
        }));

        // Apply rewards
        get().spendEnergy(energyCost);
        get().gainXp(xpReward);
        get().earnGold(goldReward);
        get().adjustMorale(2);

        // Update streak - only increment once per day
        set((s) => {
          const today = getGameDate(
            state.settings.timezone,
            state.settings.dayBoundaryHour
          );
          const isNewDayCompletion = s.streak.lastCompletedDate !== today;
          const newStreak = isNewDayCompletion
            ? s.streak.currentStreak + 1
            : s.streak.currentStreak;

          const earnedShield = isNewDayCompletion
            ? checkStreakShieldEarned(
                newStreak,
                STREAK_SHIELD_INTERVAL,
                s.streak.streakShields
              )
            : false;

          return {
            streak: {
              ...s.streak,
              currentStreak: newStreak,
              longestStreak: Math.max(s.streak.longestStreak, newStreak),
              lastCompletedDate: today,
              streakShields: earnedShield
                ? s.streak.streakShields + 1
                : s.streak.streakShields,
            },
          };
        });

        // Update stats
        const statGrowth = getStatGrowth(habit, state.character.archetypeId);
        set((s) => ({
          character: {
            ...s.character,
            stats: {
              ...s.character.stats,
              ...Object.fromEntries(
                Object.entries(statGrowth).map(([key, val]) => [
                  key,
                  (s.character.stats[key as StatKey] || 0) + (val || 0),
                ])
              ),
            },
          },
        }));

        // Boss damage
        const bossState = get().boss;
        if (bossState.currentBoss && !bossState.currentBoss.isDefeated) {
          const result = dealBossDamage(bossState.currentBoss, quest);

          set((s) => ({
            boss: {
              ...s.boss,
              currentBoss: updateBossHealth(
                s.boss.currentBoss!,
                result.damageDealt
              ),
              weeklyQuestsCompleted: s.boss.weeklyQuestsCompleted + 1,
              weeklyDamageDealt: s.boss.weeklyDamageDealt + result.damageDealt,
            },
          }));

          if (result.isDefeated && result.rewards) {
            get().earnGold(result.rewards.gold);
            get().earnShards(result.rewards.shards);
            get().logEvent("boss_defeated", {
              bossId: bossState.currentBoss.id,
            });
          }
        }

        get().logEvent("quest_completed", { questId, xpReward, goldReward });
      },

      skipQuest: (questId) =>
        set((state) => ({
          quests: state.quests.map((q) =>
            q.id === questId ? { ...q, status: "skipped" as const } : q
          ),
        })),

      useGraceToken: (questId) => {
        const state = get();
        if (state.streak.graceTokens <= 0) return false;

        set({
          streak: {
            ...state.streak,
            graceTokens: state.streak.graceTokens - 1,
          },
          quests: state.quests.map((q) =>
            q.id === questId ? { ...q, status: "grace" as const } : q
          ),
        });

        get().logEvent("grace_used", { questId });
        return true;
      },

      // ===== Streak =====
      triggerRecoveryDay: () =>
        set((state) => ({
          streak: { ...state.streak, isRecoveryDay: true },
        })),

      // ===== Inventory =====
      earnGold: (amount) =>
        set((state) => ({
          inventory: {
            ...state.inventory,
            gold: state.inventory.gold + amount,
          },
        })),

      spendGold: (amount) => {
        const state = get();
        if (state.inventory.gold < amount) return false;
        set({
          inventory: {
            ...state.inventory,
            gold: state.inventory.gold - amount,
          },
        });
        return true;
      },

      earnShards: (amount) =>
        set((state) => ({
          inventory: {
            ...state.inventory,
            essenceShards: state.inventory.essenceShards + amount,
          },
        })),

      // ===== Skills =====
      unlockSkill: (skillId) => {
        const state = get();
        // In full implementation, check cost and prerequisites
        if (state.skillTree.unlockedSkillIds.includes(skillId)) return false;

        set({
          skillTree: {
            ...state.skillTree,
            unlockedSkillIds: [...state.skillTree.unlockedSkillIds, skillId],
          },
        });

        get().logEvent("skill_unlocked", { skillId });
        return true;
      },

      // ===== Boss =====
      checkBossSpawn: () => {
        // Placeholder - full implementation in boss.system.ts
      },

      // ===== Scheduler =====
      runScheduler: () => {
        const state = get();
        const currentDate = getGameDate(
          state.settings.timezone,
          state.settings.dayBoundaryHour
        );
        const { newState, result } = processScheduledResets(state, currentDate);

        if (Object.keys(newState).length > 0) {
          set(newState as Partial<GameStore>);
        }

        if (result.dailyReset) {
          get().generateTodayQuests();
        }
      },

      // ===== Events =====
      logEvent: (type, data) =>
        set((state) => ({
          events: [
            ...state.events.slice(-99), // Keep last 100 events
            {
              id: `event-${Date.now()}`,
              type,
              timestamp: Date.now(),
              data,
            },
          ],
        })),

      // ===== GitHub =====
      setGitHubUsername: (username) =>
        set((state) => ({
          github: { ...state.github, username },
        })),

      setGitHubEnabled: (enabled) =>
        set((state) => ({
          github: { ...state.github, enabled },
        })),

      completeGitHubQuest: (commits) => {
        const state = get();
        if (
          !state.github.enabled ||
          commits < state.github.minCommitsForQuest
        ) {
          return;
        }

        // Base reward
        const baseXp = 25;
        const baseGold = 10;

        // Bonus for extra commits
        const extraCommits = Math.max(
          0,
          commits - state.github.minCommitsForQuest
        );
        const bonusXp = extraCommits * state.github.bonusXpPerCommit;
        const bonusGold = extraCommits * 2;

        const totalXp = baseXp + bonusXp;
        const totalGold = baseGold + bonusGold;

        // Apply rewards
        get().gainXp(totalXp);
        get().earnGold(totalGold);
        get().logEvent("github_quest_completed", {
          commits,
          xpEarned: totalXp,
          goldEarned: totalGold,
        });
      },

      // ===== Helpers =====
      getXpParams: () => {
        const state = get();
        return {
          streak: state.streak.currentStreak,
          morale: state.character.morale,
          archetypeId: state.character.archetypeId,
          unlockedSkillIds: state.skillTree.unlockedSkillIds,
        };
      },
    }),
    {
      name: "core202-habit-rpg",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

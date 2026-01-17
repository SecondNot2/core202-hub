/**
 * Habit RPG - Sync Service
 * Handles data synchronization between local state and Supabase
 */

import { supabase } from "@core/supabase/client";
import type { GameState, Habit, QuestInstance } from "../domain/types";

// ============================================================================
// Load from Cloud
// ============================================================================

export async function loadFromCloud(
  userId: string,
): Promise<Partial<GameState> | null> {
  try {
    // Load character
    const { data: character, error: charError } = await supabase
      .from("rpg_characters")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (charError && charError.code !== "PGRST116") {
      console.error("[RPG Sync] Failed to load character:", charError);
    }

    // Load habits
    const { data: habits, error: habitError } = await supabase
      .from("rpg_habits")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true);

    if (habitError) {
      console.error("[RPG Sync] Failed to load habits:", habitError);
    }

    // Load today's quests
    const today = new Date().toISOString().split("T")[0];
    const { data: quests, error: questError } = await supabase
      .from("rpg_quests")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today);

    if (questError) {
      console.error("[RPG Sync] Failed to load quests:", questError);
    }

    // Load general state
    const { data: generalState, error: stateError } = await supabase
      .from("rpg_general_state")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (stateError && stateError.code !== "PGRST116") {
      console.error("[RPG Sync] Failed to load general state:", stateError);
    }

    // If no data exists, return null (new user)
    if (!character && !habits?.length && !generalState) {
      return null;
    }

    // Transform cloud data to local format
    const result: Partial<GameState> = {};

    if (character) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stats = character.stats as any;
      result.character = {
        id: userId,
        name: character.name || "Hero",
        avatar: "default",
        level: character.level || 1,
        xp: character.xp || 0,
        xpToNextLevel: character.xp_to_next_level || 100,
        totalXpEarned: character.xp || 0,
        stats: stats || { STR: 1, INT: 1, DEX: 1, WIS: 1, VIT: 1 },
        energy: character.energy || 100,
        maxEnergy: character.max_energy || 100,
        morale: character.morale || 100,
        archetypeId:
          character.archetype_id as GameState["character"]["archetypeId"],
        hybridArchetypeId: null,
        createdAt: Date.now(),
        weekNumber: 1,
      };
    }

    if (habits?.length) {
      result.habits = habits.map((h) => ({
        id: h.id,
        title: h.title,
        description: h.description || undefined,
        category: (h.category || "ritual") as Habit["category"],
        difficulty: (h.difficulty || 1) as Habit["difficulty"],
        effortMinutes: h.effort_minutes || 10,
        window: (h.time_window || "anytime") as Habit["window"],
        proofMode: (h.proof_mode || "none") as Habit["proofMode"],
        statAffinity: (h.stat_affinity || "STR") as Habit["statAffinity"],
        isActive: h.is_active ?? true,
        createdAt: h.created_at ? new Date(h.created_at).getTime() : Date.now(),
        updatedAt: h.updated_at ? new Date(h.updated_at).getTime() : Date.now(),
      }));
    }

    if (quests?.length) {
      result.quests = quests.map((q) => ({
        id: q.id,
        habitId: q.habit_id || "",
        habitTitle: "",
        type: (q.quest_type || "daily") as QuestInstance["type"],
        date: q.date,
        status: (q.status || "pending") as QuestInstance["status"],
        difficulty: q.difficulty || 1,
        effortMinutes: q.effort_minutes || 10,
        xpReward: q.xp_reward || 0,
        goldReward: q.gold_reward || 0,
        completedAt: q.completed_at
          ? new Date(q.completed_at).getTime()
          : undefined,
        proof: q.proof_content || undefined,
      }));
    }

    if (generalState) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gs = generalState as any;
      if (gs.inventory) result.inventory = gs.inventory;
      if (gs.streak) result.streak = gs.streak;
      if (gs.skill_tree) result.skillTree = gs.skill_tree;
      if (gs.boss_state) result.boss = gs.boss_state;
      if (gs.season_state) result.season = gs.season_state;
      if (gs.game_settings) result.settings = gs.game_settings;
      if (gs.shop) result.shop = gs.shop;
    }

    return result;
  } catch (error) {
    console.error("[RPG Sync] Load failed:", error);
    return null;
  }
}

// ============================================================================
// Save to Cloud
// ============================================================================

export async function saveCharacterToCloud(
  userId: string,
  character: GameState["character"],
): Promise<boolean> {
  try {
    const { error } = await supabase.from("rpg_characters").upsert({
      user_id: userId,
      name: character.name,
      level: character.level,
      xp: character.xp,
      xp_to_next_level: character.xpToNextLevel,
      energy: character.energy,
      max_energy: character.maxEnergy,
      morale: character.morale,
      archetype_id: character.archetypeId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      stats: character.stats as any,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("[RPG Sync] Save character failed:", error);
    return false;
  }
}

export async function saveHabitToCloud(
  userId: string,
  habit: Habit,
): Promise<boolean> {
  try {
    const { error } = await supabase.from("rpg_habits").upsert({
      id: habit.id,
      user_id: userId,
      title: habit.title,
      description: habit.description,
      category: habit.category,
      difficulty: habit.difficulty,
      effort_minutes: habit.effortMinutes,
      time_window: habit.window,
      proof_mode: habit.proofMode,
      stat_affinity: habit.statAffinity,
      is_active: habit.isActive,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("[RPG Sync] Save habit failed:", error);
    return false;
  }
}

export async function deleteHabitFromCloud(habitId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("rpg_habits")
      .delete()
      .eq("id", habitId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("[RPG Sync] Delete habit failed:", error);
    return false;
  }
}

export async function saveQuestToCloud(
  userId: string,
  quest: QuestInstance,
): Promise<boolean> {
  try {
    const { error } = await supabase.from("rpg_quests").upsert({
      id: quest.id,
      user_id: userId,
      habit_id: quest.habitId,
      date: quest.date,
      quest_type: quest.type,
      status: quest.status,
      difficulty: quest.difficulty,
      effort_minutes: quest.effortMinutes,
      xp_reward: quest.xpReward,
      gold_reward: quest.goldReward,
      proof_content: quest.proof,
      completed_at: quest.completedAt
        ? new Date(quest.completedAt).toISOString()
        : null,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("[RPG Sync] Save quest failed:", error);
    return false;
  }
}

export async function saveGeneralStateToCloud(
  userId: string,
  state: Pick<
    GameState,
    | "inventory"
    | "streak"
    | "skillTree"
    | "boss"
    | "season"
    | "settings"
    | "shop"
  >,
): Promise<boolean> {
  try {
    const { error } = await supabase.from("rpg_general_state").upsert({
      user_id: userId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      inventory: state.inventory as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      streak: state.streak as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      skill_tree: state.skillTree as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      boss_state: state.boss as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      season_state: state.season as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      game_settings: state.settings as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      shop: state.shop as any,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("[RPG Sync] Save general state failed:", error);
    return false;
  }
}

// ============================================================================
// Log Event
// ============================================================================

export async function logEventToCloud(
  userId: string,
  type: string,
  data: Record<string, unknown>,
): Promise<void> {
  try {
    await supabase.from("rpg_events").insert({
      user_id: userId,
      type,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
    });
  } catch (error) {
    console.error("[RPG Sync] Log event failed:", error);
  }
}

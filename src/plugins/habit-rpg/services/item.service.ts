/**
 * RPG Item Service
 * Fetches item definitions from Supabase database
 */

import { supabase } from "@core/supabase/client";
import type {
  EquipmentDefinition,
  ItemDefinition,
  Rarity,
} from "../domain/types";

// Cache for fetched items
let cachedEquipment: EquipmentDefinition[] | null = null;
let cachedConsumables: ItemDefinition[] | null = null;

/**
 * Fetch all equipment definitions from Supabase
 */
export async function fetchEquipmentDefinitions(): Promise<
  EquipmentDefinition[]
> {
  if (cachedEquipment) return cachedEquipment;

  // Cast to any because rpg_items table is not in generated types yet
  const { data, error } = await (supabase as any)
    .from("rpg_items")
    .select("*")
    .eq("type", "equipment");

  if (error) {
    console.error("[ItemService] Failed to fetch equipment:", error);
    return [];
  }

  const mapped = ((data as any[]) || []).map(mapDbToEquipment);
  cachedEquipment = mapped;
  return mapped;
}

/**
 * Fetch all consumable definitions from Supabase
 */
export async function fetchConsumableDefinitions(): Promise<ItemDefinition[]> {
  if (cachedConsumables) return cachedConsumables;

  // Cast to any because rpg_items table is not in generated types yet
  const { data, error } = await (supabase as any)
    .from("rpg_items")
    .select("*")
    .eq("type", "consumable");

  if (error) {
    console.error("[ItemService] Failed to fetch consumables:", error);
    return [];
  }

  const mapped = ((data as any[]) || []).map(mapDbToItem);
  cachedConsumables = mapped;
  return mapped;
}

/**
 * Get equipment by ID (from cache or fetch)
 */
export async function getEquipmentByIdAsync(
  id: string,
): Promise<EquipmentDefinition | undefined> {
  const equipment = await fetchEquipmentDefinitions();
  return equipment.find((eq) => eq.id === id);
}

/**
 * Get equipment by rarity (from cache or fetch)
 */
export async function getEquipmentsByRarityAsync(
  rarity: Rarity,
): Promise<EquipmentDefinition[]> {
  const equipment = await fetchEquipmentDefinitions();
  return equipment.filter((eq) => eq.rarity === rarity);
}

/**
 * Get item by ID (equipment or consumable)
 */
export async function getItemByIdAsync(
  id: string,
): Promise<ItemDefinition | undefined> {
  const equipment = await fetchEquipmentDefinitions();
  const consumables = await fetchConsumableDefinitions();
  return (
    equipment.find((eq) => eq.id === id) ||
    consumables.find((item) => item.id === id)
  );
}

/**
 * Clear cache (useful when admin updates items)
 */
export function clearItemCache() {
  cachedEquipment = null;
  cachedConsumables = null;
}

// ============================================================================
// Mappers: DB row -> TypeScript types
// ============================================================================

function mapDbToEquipment(row: any): EquipmentDefinition {
  return {
    id: row.id,
    type: "equipment",
    name: row.name,
    description: row.description || "",
    rarity: row.rarity as Rarity,
    slot: row.slot,
    iconPath: row.icon_url || "",
    sellPrice: row.sell_price || 0,
    stats: row.stats || {},
    affinity: row.affinity || null,
    affinityBonus: row.affinity_bonus || 0,
    maxDurability: row.max_durability || 100,
    decayRate: row.decay_rate || 0.1,
  };
}

function mapDbToItem(row: any): ItemDefinition {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    description: row.description || "",
    rarity: row.rarity as Rarity,
    iconPath: row.icon_url || "",
    sellPrice: row.sell_price || 0,
    maxStack: row.max_stack || 1,
  };
}

// ============================================================================
// Synchronous getters with fallback (for backwards compatibility)
// ============================================================================

// These use the cached data if available, otherwise return undefined
// Use fetchEquipmentDefinitions() first to populate cache

export function getEquipmentByIdSync(
  id: string,
): EquipmentDefinition | undefined {
  return cachedEquipment?.find((eq) => eq.id === id);
}

export function getItemByIdSync(
  id: string,
): EquipmentDefinition | ItemDefinition | undefined {
  return (
    cachedEquipment?.find((eq) => eq.id === id) ||
    cachedConsumables?.find((item) => item.id === id)
  );
}

export function getEquipmentsByRaritySync(
  rarity: Rarity,
): EquipmentDefinition[] {
  return cachedEquipment?.filter((eq) => eq.rarity === rarity) || [];
}

export function isCacheReady(): boolean {
  return cachedEquipment !== null && cachedConsumables !== null;
}

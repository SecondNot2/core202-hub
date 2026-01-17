/**
 * Habit RPG - Item Definitions
 * Static data for all items in the game
 */

import type { EquipmentDefinition, ItemDefinition, Rarity } from "./types";

// ============================================================================
// Rarity Configuration
// ============================================================================

export const RARITY_CONFIG: Record<
  Rarity,
  { color: string; glowColor: string; sellMultiplier: number }
> = {
  common: {
    color: "#9ca3af",
    glowColor: "rgba(156, 163, 175, 0.3)",
    sellMultiplier: 1,
  },
  uncommon: {
    color: "#22c55e",
    glowColor: "rgba(34, 197, 94, 0.3)",
    sellMultiplier: 2,
  },
  rare: {
    color: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.3)",
    sellMultiplier: 4,
  },
  epic: {
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.3)",
    sellMultiplier: 8,
  },
  legendary: {
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.5)",
    sellMultiplier: 20,
  },
};

// ============================================================================
// Equipment Definitions
// ============================================================================

export const EQUIPMENT_DEFINITIONS: EquipmentDefinition[] = [
  // === TIER 1: COMMON ===
  {
    id: "eq_graphite_pencil",
    type: "equipment",
    name: "Graphite Pencil",
    description: "A simple but reliable writing tool. Great for quick notes.",
    rarity: "common",
    slot: "tool",
    iconPath: "/assets/rpg/items/common_graphite_pencil.png",
    sellPrice: 10,
    stats: { INT: 1 },
    affinity: "INT",
    affinityBonus: 0.05,
    maxDurability: 50,
    decayRate: 0.15,
  },
  {
    id: "eq_sticky_notes",
    type: "equipment",
    name: "Sticky Note Pad",
    description: "Colorful reminders to keep your thoughts organized.",
    rarity: "common",
    slot: "tool",
    iconPath: "/assets/rpg/items/common_sticky_notes.png",
    sellPrice: 8,
    stats: { INT: 1 },
    affinity: "INT",
    affinityBonus: 0.03,
    maxDurability: 40,
    decayRate: 0.2,
  },
  {
    id: "eq_water_bottle",
    type: "equipment",
    name: "Water Bottle",
    description: "Stay hydrated, stay focused.",
    rarity: "common",
    slot: "accessory",
    iconPath: "/assets/rpg/items/common_water_bottle.png",
    sellPrice: 12,
    stats: { VIT: 2 },
    affinity: "VIT",
    affinityBonus: 0.05,
    maxDurability: 60,
    decayRate: 0.1,
  },
  {
    id: "eq_lucky_coin",
    type: "equipment",
    name: "Lucky Coin",
    description:
      "A tarnished coin with a four-leaf clover. Brings minor fortune.",
    rarity: "common",
    slot: "accessory",
    iconPath: "/assets/rpg/items/common_lucky_coin.png",
    sellPrice: 15,
    stats: {},
    affinity: null,
    affinityBonus: 0,
    maxDurability: 100,
    decayRate: 0.05,
  },

  // === TIER 2: UNCOMMON ===
  {
    id: "eq_dumbbell",
    type: "equipment",
    name: "5kg Dumbbell",
    description: "A reliable weight for building strength habits.",
    rarity: "uncommon",
    slot: "tool",
    iconPath: "/assets/rpg/items/uncommon_dumbbell.png",
    sellPrice: 35,
    stats: { STR: 3 },
    affinity: "STR",
    affinityBonus: 0.1,
    maxDurability: 80,
    decayRate: 0.08,
  },
  {
    id: "eq_ebook_reader",
    type: "equipment",
    name: "eBook Reader",
    description: "A portable library in your pocket. +INT for reading habits.",
    rarity: "uncommon",
    slot: "tool",
    iconPath: "/assets/rpg/items/uncommon_ebook_reader.png",
    sellPrice: 50,
    stats: { INT: 4 },
    affinity: "INT",
    affinityBonus: 0.1,
    maxDurability: 70,
    decayRate: 0.1,
  },
  {
    id: "eq_blue_light_glasses",
    type: "equipment",
    name: "Blue Light Glasses",
    description: "Protect your eyes during long work sessions.",
    rarity: "uncommon",
    slot: "accessory",
    iconPath: "/assets/rpg/items/uncommon_blue_light_glasses.png",
    sellPrice: 45,
    stats: { VIT: 2, INT: 2 },
    affinity: "VIT",
    affinityBonus: 0.08,
    maxDurability: 60,
    decayRate: 0.12,
  },
  {
    id: "eq_digital_watch",
    type: "equipment",
    name: "Digital Watch",
    description: "Time management is the key to productivity.",
    rarity: "uncommon",
    slot: "accessory",
    iconPath: "/assets/rpg/items/uncommon_digital_watch.png",
    sellPrice: 40,
    stats: { DEX: 2 },
    affinity: null,
    affinityBonus: 0,
    maxDurability: 100,
    decayRate: 0.05,
  },

  // === TIER 3: RARE ===
  {
    id: "eq_mechanical_keyboard",
    type: "equipment",
    name: "Mechanical Keyboard",
    description: "RGB-lit keys that make coding feel epic.",
    rarity: "rare",
    slot: "tool",
    iconPath: "/assets/rpg/items/rare_mechanical_keyboard.png",
    sellPrice: 120,
    stats: { INT: 5, DEX: 3 },
    affinity: "INT",
    affinityBonus: 0.15,
    maxDurability: 100,
    decayRate: 0.06,
  },
  {
    id: "eq_lofi_radio",
    type: "equipment",
    name: "Lo-Fi Radio",
    description: "Vintage vibes for deep focus sessions.",
    rarity: "rare",
    slot: "environment",
    iconPath: "/assets/rpg/items/rare_lofi_radio.png",
    sellPrice: 100,
    stats: { WIS: 4, INT: 3 },
    affinity: "WIS",
    affinityBonus: 0.12,
    maxDurability: 80,
    decayRate: 0.08,
  },
  {
    id: "eq_headphones",
    type: "equipment",
    name: "Noise-Canceling Headphones",
    description: "Block out distractions. Enter the zone.",
    rarity: "rare",
    slot: "accessory",
    iconPath: "/assets/rpg/items/rare_headphones.png",
    sellPrice: 150,
    stats: { INT: 4, WIS: 2 },
    affinity: "INT",
    affinityBonus: 0.12,
    maxDurability: 90,
    decayRate: 0.07,
  },
  {
    id: "eq_yoga_mat",
    type: "equipment",
    name: "Yoga Mat",
    description: "Foundation for flexibility and mindfulness.",
    rarity: "rare",
    slot: "environment",
    iconPath: "/assets/rpg/items/rare_yoga_mat.png",
    sellPrice: 80,
    stats: { DEX: 4, WIS: 3 },
    affinity: "DEX",
    affinityBonus: 0.12,
    maxDurability: 70,
    decayRate: 0.1,
  },

  // === TIER 4: EPIC ===
  {
    id: "eq_fountain_pen",
    type: "equipment",
    name: "Gold Nib Fountain Pen",
    description: "Write with elegance. Every stroke is a masterpiece.",
    rarity: "epic",
    slot: "tool",
    iconPath: "/assets/rpg/items/epic_fountain_pen.png",
    sellPrice: 300,
    stats: { DEX: 6, INT: 4 },
    affinity: "DEX",
    affinityBonus: 0.18,
    maxDurability: 120,
    decayRate: 0.05,
  },
  {
    id: "eq_adjustable_dumbbells",
    type: "equipment",
    name: "Adjustable Dumbbells",
    description: "Scale your workouts. Scale your strength.",
    rarity: "epic",
    slot: "tool",
    iconPath: "/assets/rpg/items/epic_adjustable_dumbbells.png",
    sellPrice: 280,
    stats: { STR: 8, VIT: 3 },
    affinity: "STR",
    affinityBonus: 0.18,
    maxDurability: 150,
    decayRate: 0.04,
  },
  {
    id: "eq_standing_desk",
    type: "equipment",
    name: "Standing Desk Setup",
    description: "Ergonomic perfection for the dedicated worker.",
    rarity: "epic",
    slot: "environment",
    iconPath: "/assets/rpg/items/epic_standing_desk.png",
    sellPrice: 400,
    stats: { VIT: 5, INT: 4 },
    affinity: "VIT",
    affinityBonus: 0.15,
    maxDurability: 200,
    decayRate: 0.03,
  },
  {
    id: "eq_smartwatch",
    type: "equipment",
    name: "Smart Watch Pro",
    description: "Track every metric. Optimize every moment.",
    rarity: "epic",
    slot: "accessory",
    iconPath: "/assets/rpg/items/epic_smartwatch.png",
    sellPrice: 350,
    stats: { VIT: 4, DEX: 3, INT: 2 },
    affinity: null,
    affinityBonus: 0,
    maxDurability: 100,
    decayRate: 0.06,
  },

  // === TIER 5: LEGENDARY ===
  {
    id: "eq_excalibur_quill",
    type: "equipment",
    name: "Excalibur Quill",
    description:
      "A crystalline quill imbued with ancient wisdom. Legends say it writes destiny.",
    rarity: "legendary",
    slot: "tool",
    iconPath: "/assets/rpg/items/legendary_excalibur_quill.png",
    sellPrice: 1000,
    stats: { INT: 10, WIS: 8, DEX: 5 },
    affinity: "INT",
    affinityBonus: 0.25,
    maxDurability: 200,
    decayRate: 0.02,
  },
  {
    id: "eq_quantum_laptop",
    type: "equipment",
    name: "Quantum Laptop",
    description:
      "Holographic displays. Infinite compute power. The future is now.",
    rarity: "legendary",
    slot: "tool",
    iconPath: "/assets/rpg/items/legendary_quantum_laptop.png",
    sellPrice: 1200,
    stats: { INT: 12, DEX: 6 },
    affinity: "INT",
    affinityBonus: 0.25,
    maxDurability: 180,
    decayRate: 0.02,
  },
  {
    id: "eq_zen_garden",
    type: "equipment",
    name: "Mystical Zen Garden",
    description:
      "A pocket dimension of tranquility. Floating crystals hum with serenity.",
    rarity: "legendary",
    slot: "environment",
    iconPath: "/assets/rpg/items/legendary_zen_garden.png",
    sellPrice: 1500,
    stats: { WIS: 15, VIT: 5 },
    affinity: "WIS",
    affinityBonus: 0.25,
    maxDurability: 250,
    decayRate: 0.01,
  },
  {
    id: "eq_phoenix_feather",
    type: "equipment",
    name: "Phoenix Feather",
    description:
      "Burns with eternal flame. Protects your streak from breaking once per week.",
    rarity: "legendary",
    slot: "accessory",
    iconPath: "/assets/rpg/items/legendary_phoenix_feather.png",
    sellPrice: 2000,
    stats: { VIT: 5, WIS: 5 },
    affinity: null,
    affinityBonus: 0,
    maxDurability: 300,
    decayRate: 0.01,
  },
  {
    id: "eq_hourglass_of_flow",
    type: "equipment",
    name: "Hourglass of Flow",
    description: "Time bends around the wearer. Enter the flow state at will.",
    rarity: "legendary",
    slot: "accessory",
    iconPath: "/assets/rpg/items/legendary_hourglass.png",
    sellPrice: 1800,
    stats: { INT: 6, DEX: 6, WIS: 6 },
    affinity: null,
    affinityBonus: 0,
    maxDurability: 200,
    decayRate: 0.015,
  },
];

// ============================================================================
// Consumable Definitions
// ============================================================================

export const CONSUMABLE_DEFINITIONS: ItemDefinition[] = [
  {
    id: "item_repair_kit_basic",
    type: "consumable",
    name: "Basic Repair Kit",
    description: "Restores 25% durability to one piece of equipment.",
    rarity: "common",
    iconPath: "/assets/rpg/items/consumable_repair_kit.png",
    sellPrice: 15,
    maxStack: 10,
  },
  {
    id: "item_repair_kit_advanced",
    type: "consumable",
    name: "Advanced Repair Kit",
    description: "Fully restores durability to one piece of equipment.",
    rarity: "rare",
    iconPath: "/assets/rpg/items/consumable_repair_kit_advanced.png",
    sellPrice: 80,
    maxStack: 5,
  },
  {
    id: "item_mystery_box",
    type: "consumable",
    name: "Mystery Box",
    description:
      "A chest brimming with magical energy. Contains random equipment or materials.",
    rarity: "rare",
    iconPath: "/assets/rpg/items/consumable_mystery_box.png",
    sellPrice: 0, // Cannot sell
    maxStack: 5,
  },
  {
    id: "item_mystery_box_premium",
    type: "consumable",
    name: "Premium Mystery Box",
    description: "A golden chest. Guaranteed Rare or higher equipment.",
    rarity: "epic",
    iconPath: "/assets/rpg/items/consumable_mystery_box_premium.png",
    sellPrice: 0, // Cannot sell
    maxStack: 3,
  },
  {
    id: "item_energy_potion",
    type: "consumable",
    name: "Energy Potion",
    description: "Restores 25 Energy instantly.",
    rarity: "uncommon",
    iconPath: "/assets/rpg/items/consumable_energy_potion.png",
    sellPrice: 20,
    maxStack: 10,
  },
  {
    id: "item_morale_boost",
    type: "consumable",
    name: "Morale Boost",
    description: "Increases Morale by 15 points.",
    rarity: "uncommon",
    iconPath: "/assets/rpg/items/consumable_morale_boost.png",
    sellPrice: 25,
    maxStack: 10,
  },
];

// ============================================================================
// Shop Configuration
// ============================================================================

export const SHOP_LISTINGS = {
  // Always available
  permanent: [
    { itemId: "item_repair_kit_basic", price: 30, priceType: "gold" as const },
    {
      itemId: "item_repair_kit_advanced",
      price: 150,
      priceType: "gold" as const,
    },
    { itemId: "item_energy_potion", price: 40, priceType: "gold" as const },
    { itemId: "item_morale_boost", price: 50, priceType: "gold" as const },
    { itemId: "item_mystery_box", price: 200, priceType: "gold" as const },
    {
      itemId: "item_mystery_box_premium",
      price: 50,
      priceType: "essence" as const,
    },
  ],
  // Level-gated equipment (base prices)
  equipment: {
    common: { basePrice: 50, levelRequired: 1 },
    uncommon: { basePrice: 150, levelRequired: 5 },
    rare: { basePrice: 400, levelRequired: 10 },
    epic: { basePrice: 1000, levelRequired: 15 },
    legendary: { basePrice: 3000, levelRequired: 20 },
  },
};

// ============================================================================
// Gacha Configuration
// ============================================================================

export const GACHA_CONFIG = {
  standardBox: {
    // Weights for standard mystery box
    common: 50,
    uncommon: 30,
    rare: 15,
    epic: 4,
    legendary: 1,
  },
  premiumBox: {
    // Weights for premium mystery box
    common: 0,
    uncommon: 0,
    rare: 60,
    epic: 35,
    legendary: 5,
  },
  pityThreshold: 10, // Guaranteed Epic after 10 standard boxes without Epic+
};

// ============================================================================
// Helper Functions (Service-backed with static fallback)
// ============================================================================

import {
  getEquipmentByIdSync,
  getItemByIdSync,
  getEquipmentsByRaritySync,
  isCacheReady,
} from "../services/item.service";

export function getEquipmentById(id: string): EquipmentDefinition | undefined {
  // Prefer service cache if available
  if (isCacheReady()) {
    return getEquipmentByIdSync(id);
  }
  // Fallback to static data
  return EQUIPMENT_DEFINITIONS.find((eq) => eq.id === id);
}

export function getItemById(id: string): ItemDefinition | undefined {
  if (isCacheReady()) {
    return getItemByIdSync(id);
  }
  return (
    CONSUMABLE_DEFINITIONS.find((item) => item.id === id) ||
    EQUIPMENT_DEFINITIONS.find((eq) => eq.id === id)
  );
}

export function getEquipmentsByRarity(rarity: Rarity): EquipmentDefinition[] {
  if (isCacheReady()) {
    return getEquipmentsByRaritySync(rarity);
  }
  return EQUIPMENT_DEFINITIONS.filter((eq) => eq.rarity === rarity);
}

export function calculateRepairCost(
  equipment: EquipmentDefinition,
  currentDurability: number,
): number {
  const missingDurability = equipment.maxDurability - currentDurability;
  const baseCost = RARITY_CONFIG[equipment.rarity].sellMultiplier * 5;
  return Math.ceil(missingDurability * baseCost * 0.5);
}

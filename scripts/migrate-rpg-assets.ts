/**
 * RPG Assets Migration Script
 * Uploads local assets to Supabase Storage and seeds rpg_items table
 *
 * Usage: npx tsx scripts/migrate-rpg-assets.ts
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Item definitions from domain/items.ts (simplified for migration)
const EQUIPMENT_DEFINITIONS = [
  // COMMON
  {
    id: "eq_graphite_pencil",
    type: "equipment",
    name: "Graphite Pencil",
    description: "A simple but reliable writing tool.",
    rarity: "common",
    slot: "tool",
    filename: "common_graphite_pencil.png",
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
    filename: "common_sticky_notes.png",
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
    filename: "common_water_bottle.png",
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
    description: "A tarnished coin with a four-leaf clover.",
    rarity: "common",
    slot: "accessory",
    filename: "common_lucky_coin.png",
    sellPrice: 15,
    stats: {},
    affinity: null,
    affinityBonus: 0,
    maxDurability: 100,
    decayRate: 0.05,
  },
  // UNCOMMON
  {
    id: "eq_dumbbell",
    type: "equipment",
    name: "5kg Dumbbell",
    description: "A reliable weight for building strength habits.",
    rarity: "uncommon",
    slot: "tool",
    filename: "uncommon_dumbbell.png",
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
    description: "A portable library in your pocket.",
    rarity: "uncommon",
    slot: "tool",
    filename: "uncommon_ebook_reader.png",
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
    filename: "uncommon_blue_light_glasses.png",
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
    filename: "uncommon_digital_watch.png",
    sellPrice: 40,
    stats: { DEX: 2 },
    affinity: null,
    affinityBonus: 0,
    maxDurability: 100,
    decayRate: 0.05,
  },
  // RARE
  {
    id: "eq_mechanical_keyboard",
    type: "equipment",
    name: "Mechanical Keyboard",
    description: "RGB-lit keys that make coding feel epic.",
    rarity: "rare",
    slot: "tool",
    filename: "rare_mechanical_keyboard.png",
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
    filename: "rare_lofi_radio.png",
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
    filename: "rare_headphones.png",
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
    filename: "rare_yoga_mat.png",
    sellPrice: 80,
    stats: { DEX: 4, WIS: 3 },
    affinity: "DEX",
    affinityBonus: 0.12,
    maxDurability: 70,
    decayRate: 0.1,
  },
  // EPIC
  {
    id: "eq_fountain_pen",
    type: "equipment",
    name: "Gold Nib Fountain Pen",
    description: "Write with elegance. Every stroke is a masterpiece.",
    rarity: "epic",
    slot: "tool",
    filename: "epic_fountain_pen.png",
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
    filename: "epic_adjustable_dumbbells.png",
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
    filename: "epic_standing_desk.png",
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
    filename: "epic_smartwatch.png",
    sellPrice: 350,
    stats: { VIT: 4, DEX: 3, INT: 2 },
    affinity: null,
    affinityBonus: 0,
    maxDurability: 100,
    decayRate: 0.06,
  },
  // LEGENDARY
  {
    id: "eq_excalibur_quill",
    type: "equipment",
    name: "Excalibur Quill",
    description: "A crystalline quill imbued with ancient wisdom.",
    rarity: "legendary",
    slot: "tool",
    filename: "legendary_excalibur_quill.png",
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
    description: "Holographic displays. Infinite compute power.",
    rarity: "legendary",
    slot: "tool",
    filename: "legendary_quantum_laptop.png",
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
    description: "A pocket dimension of tranquility.",
    rarity: "legendary",
    slot: "environment",
    filename: "legendary_zen_garden.png",
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
    description: "Burns with eternal flame. Protects your streak.",
    rarity: "legendary",
    slot: "accessory",
    filename: "legendary_phoenix_feather.png",
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
    description: "Time bends around the wearer.",
    rarity: "legendary",
    slot: "accessory",
    filename: "legendary_hourglass.png",
    sellPrice: 1800,
    stats: { INT: 6, DEX: 6, WIS: 6 },
    affinity: null,
    affinityBonus: 0,
    maxDurability: 200,
    decayRate: 0.015,
  },
];

const CONSUMABLE_DEFINITIONS = [
  {
    id: "item_repair_kit_basic",
    type: "consumable",
    name: "Basic Repair Kit",
    description: "Restores 25% durability.",
    rarity: "common",
    filename: "consumable_repair_kit.png",
    sellPrice: 15,
    maxStack: 10,
  },
  {
    id: "item_repair_kit_advanced",
    type: "consumable",
    name: "Advanced Repair Kit",
    description: "Fully restores durability.",
    rarity: "rare",
    filename: "consumable_repair_kit_advanced.png",
    sellPrice: 80,
    maxStack: 5,
  },
  {
    id: "item_mystery_box",
    type: "consumable",
    name: "Mystery Box",
    description: "Contains random equipment or materials.",
    rarity: "rare",
    filename: "consumable_mystery_box.png",
    sellPrice: 0,
    maxStack: 5,
  },
  {
    id: "item_mystery_box_premium",
    type: "consumable",
    name: "Premium Mystery Box",
    description: "Guaranteed Rare or higher equipment.",
    rarity: "epic",
    filename: "consumable_mystery_box_premium.png",
    sellPrice: 0,
    maxStack: 3,
  },
  {
    id: "item_energy_potion",
    type: "consumable",
    name: "Energy Potion",
    description: "Restores 25 Energy instantly.",
    rarity: "uncommon",
    filename: "consumable_energy_potion.png",
    sellPrice: 20,
    maxStack: 10,
  },
  {
    id: "item_morale_boost",
    type: "consumable",
    name: "Morale Boost",
    description: "Increases Morale by 15 points.",
    rarity: "uncommon",
    filename: "consumable_morale_boost.png",
    sellPrice: 25,
    maxStack: 10,
  },
];

const BUCKET_NAME = "rpg-assets";
// ESM-compatible __dirname (Windows-safe)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_ASSETS_PATH = path.join(__dirname, "../public/assets/rpg/items");

async function createBucketIfNotExists() {
  console.log("📦 Checking storage bucket...");

  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET_NAME);

  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
    });
    if (error) {
      console.error("❌ Failed to create bucket:", error.message);
      return false;
    }
    console.log("✅ Created bucket:", BUCKET_NAME);
  } else {
    console.log("✅ Bucket already exists:", BUCKET_NAME);
  }
  return true;
}

async function uploadAsset(filename: string): Promise<string | null> {
  const filePath = path.join(LOCAL_ASSETS_PATH, filename);

  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File not found: ${filename}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(filePath);
  const storagePath = `items/${filename}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) {
    console.error(`❌ Upload failed for ${filename}:`, error.message);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  console.log(`✅ Uploaded: ${filename}`);
  return urlData.publicUrl;
}

async function seedDatabase(items: any[], iconUrls: Map<string, string>) {
  console.log("\n📝 Seeding database...");

  for (const item of items) {
    const iconUrl = iconUrls.get(item.filename) || null;

    const { error } = await supabase.from("rpg_items").upsert({
      id: item.id,
      type: item.type,
      name: item.name,
      description: item.description,
      rarity: item.rarity,
      slot: item.slot || null,
      icon_url: iconUrl,
      sell_price: item.sellPrice,
      stats: item.stats || {},
      affinity: item.affinity || null,
      affinity_bonus: item.affinityBonus || 0,
      max_durability: item.maxDurability || null,
      decay_rate: item.decayRate || null,
      max_stack: item.maxStack || 1,
    });

    if (error) {
      console.error(`❌ Failed to insert ${item.id}:`, error.message);
    } else {
      console.log(`✅ Seeded: ${item.name}`);
    }
  }
}

async function main() {
  console.log("🚀 Starting RPG Assets Migration\n");

  // Step 1: Create bucket
  const bucketReady = await createBucketIfNotExists();
  if (!bucketReady) return;

  // Step 2: Upload all assets
  console.log("\n📤 Uploading assets...");
  const allItems = [...EQUIPMENT_DEFINITIONS, ...CONSUMABLE_DEFINITIONS];
  const iconUrls = new Map<string, string>();

  for (const item of allItems) {
    const url = await uploadAsset(item.filename);
    if (url) {
      iconUrls.set(item.filename, url);
    }
  }

  // Step 3: Seed database
  await seedDatabase(allItems, iconUrls);

  console.log("\n🎉 Migration complete!");
  console.log(`📊 Total items: ${allItems.length}`);
  console.log(`📁 Assets uploaded: ${iconUrls.size}`);
}

main().catch(console.error);

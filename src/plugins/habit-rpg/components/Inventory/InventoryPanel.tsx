/**
 * Inventory Panel Component
 * Displays player's items, equipment, and loadout management
 */

import type { ReactNode } from "react";
import { useState } from "react";
import {
  Backpack,
  Wrench,
  Sword,
  Home,
  Gem,
  AlertTriangle,
  Check,
  X,
  Coins,
} from "lucide-react";
import { useGameStore } from "../../store";
import {
  RARITY_CONFIG,
  getEquipmentById,
  getItemById,
  calculateRepairCost,
} from "../../domain/items";
import type {
  EquipmentInstance,
  EquipmentSlot,
  Rarity,
} from "../../domain/types";

type InventoryTab = "equipment" | "consumables";

export function InventoryPanel() {
  const [activeTab, setActiveTab] = useState<InventoryTab>("equipment");
  const { inventory, equipItem, unequipItem, repairItem, useConsumable } =
    useGameStore();

  const tabs: { id: InventoryTab; label: string; icon: ReactNode }[] = [
    {
      id: "equipment",
      label: "Equipment",
      icon: <Sword className="w-4 h-4" />,
    },
    {
      id: "consumables",
      label: "Items",
      icon: <Backpack className="w-4 h-4" />,
    },
  ];

  const getSlotIcon = (slot: EquipmentSlot) => {
    switch (slot) {
      case "tool":
        return <Wrench className="w-5 h-5" />;
      case "environment":
        return <Home className="w-5 h-5" />;
      case "accessory":
        return <Gem className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Backpack className="w-8 h-8 text-emerald-500" />
            Inventory
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your equipment and items
          </p>
        </div>

        {/* Loadout Display */}
        <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Current Loadout
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {(["tool", "environment", "accessory"] as EquipmentSlot[]).map(
              (slot) => {
                const loadout = inventory.loadout || {
                  tool: null,
                  environment: null,
                  accessory: null,
                };
                const equipment = inventory.equipment || [];
                const equippedId = loadout[slot];
                const equipped = equippedId
                  ? equipment.find((e) => e.instanceId === equippedId)
                  : null;
                const definition = equipped
                  ? getEquipmentById(equipped.definitionId)
                  : null;
                const config = definition
                  ? RARITY_CONFIG[definition.rarity]
                  : null;

                return (
                  <div
                    key={slot}
                    className={`relative p-4 rounded-xl border-2 border-dashed ${
                      equipped
                        ? "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                      {getSlotIcon(slot)}
                      <span className="capitalize font-medium">{slot}</span>
                    </div>

                    {equipped && definition ? (
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${config?.color}20` }}
                        >
                          <img
                            src={definition.iconPath}
                            alt={definition.name}
                            className="w-9 h-9 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-medium truncate"
                            style={{ color: config?.color }}
                          >
                            {definition.name}
                          </p>
                          <DurabilityBar
                            current={equipped.currentDurability}
                            max={definition.maxDurability}
                          />
                        </div>
                        <button
                          onClick={() => unequipItem(slot)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          title="Unequip"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                        No {slot} equipped
                      </p>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          {activeTab === "equipment" && (
            <EquipmentList
              equipment={inventory.equipment || []}
              loadout={
                inventory.loadout || {
                  tool: null,
                  environment: null,
                  accessory: null,
                }
              }
              gold={inventory.gold || 0}
              onEquip={equipItem}
              onRepair={repairItem}
            />
          )}
          {activeTab === "consumables" && (
            <ConsumablesList
              items={inventory.items || []}
              consumables={inventory.consumables || []}
              onUse={useConsumable}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function DurabilityBar({ current, max }: { current: number; max: number }) {
  const percentage = (current / max) * 100;
  const color =
    percentage > 50
      ? "bg-emerald-500"
      : percentage > 20
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {current}/{max}
      </span>
    </div>
  );
}

function EquipmentList({
  equipment,
  loadout,
  gold,
  onEquip,
  onRepair,
}: {
  equipment: EquipmentInstance[];
  loadout: Record<EquipmentSlot, string | null>;
  gold: number;
  onEquip: (instanceId: string) => void;
  onRepair: (instanceId: string) => void;
}) {
  if (equipment.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        <Backpack className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No equipment yet. Visit the shop to buy some gear!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {equipment.map((eq) => {
        const definition = getEquipmentById(eq.definitionId);
        if (!definition) return null;

        const config = RARITY_CONFIG[definition.rarity];
        const isEquipped = Object.values(loadout).includes(eq.instanceId);
        const needsRepair =
          eq.currentDurability < definition.maxDurability * 0.3;
        const repairCost = calculateRepairCost(
          definition,
          eq.currentDurability,
        );
        const canRepair =
          gold >= repairCost && eq.currentDurability < definition.maxDurability;

        return (
          <div
            key={eq.instanceId}
            className={`relative bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border transition-all ${
              isEquipped
                ? "border-emerald-400 dark:border-emerald-600"
                : "border-slate-200 dark:border-slate-700"
            }`}
          >
            {/* Equipped Badge */}
            {isEquipped && (
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" />
                Equipped
              </div>
            )}

            {/* Low Durability Warning */}
            {needsRepair && (
              <div className="absolute -top-2 -left-2 bg-yellow-500 text-white p-1 rounded-full">
                <AlertTriangle className="w-3 h-3" />
              </div>
            )}

            <div className="flex items-start gap-3">
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <img
                  src={definition.iconPath}
                  alt={definition.name}
                  className="w-10 h-10 object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className="font-semibold truncate"
                  style={{ color: config.color }}
                >
                  {definition.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mb-2">
                  {definition.slot}
                </p>
                <DurabilityBar
                  current={eq.currentDurability}
                  max={definition.maxDurability}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              {!isEquipped ? (
                <button
                  onClick={() => onEquip(eq.instanceId)}
                  className="flex-1 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
                >
                  Equip
                </button>
              ) : (
                <div className="flex-1 py-2 text-center text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                  In Use
                </div>
              )}

              {eq.currentDurability < definition.maxDurability && (
                <button
                  onClick={() => canRepair && onRepair(eq.instanceId)}
                  disabled={!canRepair}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    canRepair
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                  }`}
                  title={`Repair for ${repairCost} Gold`}
                >
                  <Wrench className="w-4 h-4" />
                  <Coins className="w-3 h-3" />
                  {repairCost}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ConsumablesList({
  items,
  consumables,
  onUse,
}: {
  items: Array<{ itemId: string; quantity: number }>;
  consumables: Array<{
    id: string;
    type: string;
    name: string;
    quantity: number;
  }>;
  onUse: (itemId: string) => void;
}) {
  const allItems = [
    ...items.map((i) => {
      const def = getItemById(i.itemId);
      return { ...i, definition: def };
    }),
    ...consumables.map((c) => ({
      itemId: c.id,
      quantity: c.quantity,
      definition: {
        id: c.id,
        name: c.name,
        type: "consumable" as const,
        rarity: "common" as Rarity,
        iconPath: `/assets/rpg/items/${c.type}.png`,
        description: "",
        sellPrice: 0,
      },
    })),
  ].filter((i) => i.quantity > 0);

  if (allItems.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        <Backpack className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No consumables in your inventory.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {allItems.map((item) => {
        const config = item.definition
          ? RARITY_CONFIG[item.definition.rarity]
          : RARITY_CONFIG.common;

        return (
          <div
            key={item.itemId}
            className="relative bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center group hover:border-amber-400 transition-all"
          >
            {/* Quantity Badge */}
            <div className="absolute -top-2 -right-2 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {item.quantity}
            </div>

            <div
              className="w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${config.color}20` }}
            >
              <img
                src={
                  item.definition?.iconPath ||
                  "/assets/rpg/items/placeholder.png"
                }
                alt={item.definition?.name || "Item"}
                className="w-9 h-9 object-contain"
              />
            </div>

            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
              {item.definition?.name || "Unknown"}
            </p>

            <button
              onClick={() => onUse(item.itemId)}
              className="mt-2 w-full py-1 text-xs bg-emerald-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Use
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default InventoryPanel;

/**
 * Shop Panel Component
 * Main shop interface for buying items and opening mystery boxes
 */

import { useState } from "react";
import {
  ShoppingBag,
  Package,
  Sparkles,
  Coins,
  Diamond,
  Gift,
  Loader2,
} from "lucide-react";
import { useGameStore } from "../../store";
import { useItemsLoader } from "../../hooks/useItemsLoader";
import { useConfirm, useToast } from "@shared/components";
import {
  RARITY_CONFIG,
  SHOP_LISTINGS,
  getItemById,
  getEquipmentsByRarity,
} from "../../domain/items";
import type { Rarity } from "../../domain/types";

type ShopTab = "consumables" | "equipment" | "gacha";

export function ShopPanel() {
  const [activeTab, setActiveTab] = useState<ShopTab>("consumables");
  const [selectedRarity, setSelectedRarity] = useState<Rarity>("common");
  const { inventory, character, buyItem } = useGameStore();
  const { confirm } = useConfirm();
  const { toast } = useToast();

  // Preload item definitions from Supabase
  const { isLoading, error } = useItemsLoader();

  const tabs: { id: ShopTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "consumables",
      label: "Consumables",
      icon: <Package className="w-4 h-4" />,
    },
    {
      id: "equipment",
      label: "Equipment",
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    { id: "gacha", label: "Mystery Box", icon: <Gift className="w-4 h-4" /> },
  ];

  const rarityTabs: Rarity[] = [
    "common",
    "uncommon",
    "rare",
    "epic",
    "legendary",
  ];

  const canAfford = (price: number, priceType: "gold" | "essence") => {
    if (priceType === "gold") return inventory.gold >= price;
    return inventory.essenceShards >= price;
  };

  const handleBuy = async (
    itemId: string,
    price: number,
    priceType: "gold" | "essence",
  ) => {
    if (!canAfford(price, priceType)) {
      toast.error(
        `Insufficient Funds: You need ${price} ${priceType} to buy this item.`,
      );
      return;
    }

    const item =
      getItemById(itemId) ||
      getEquipmentsByRarity(selectedRarity).find((e) => e.id === itemId);
    const itemName = item?.name || "Item";

    const confirmed = await confirm({
      title: "Confirm Purchase",
      message: `Are you sure you want to buy ${itemName} for ${price} ${priceType}?`,
      confirmText: "Buy Now",
      cancelText: "Cancel",
    });

    if (confirmed) {
      buyItem(itemId, price, priceType);

      // Get updated balance
      const newBalance =
        useGameStore.getState().inventory[
          priceType === "gold" ? "gold" : "essenceShards"
        ];
      const currencyName = priceType === "gold" ? "Gold" : "Essence";

      toast.success(
        `Bought ${itemName} for ${price} ${currencyName}. Remaining: ${newBalance} ${currencyName}.`,
      );
    }
  };

  // Show loading state while fetching items
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Loading shop items...
          </p>
        </div>
      </div>
    );
  }

  // Show error if failed to load
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-amber-500" />
              Habitus Shop
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Upgrade your productivity toolkit
            </p>
          </div>

          {/* Currency Display */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <Coins className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="font-bold text-yellow-700 dark:text-yellow-300">
                {inventory.gold.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Diamond className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="font-bold text-purple-700 dark:text-purple-300">
                {inventory.essenceShards}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
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
          {activeTab === "consumables" && (
            <ConsumablesGrid onBuy={handleBuy} canAfford={canAfford} />
          )}
          {activeTab === "equipment" && (
            <div>
              {/* Rarity Filter */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {rarityTabs.map((rarity) => {
                  const config = RARITY_CONFIG[rarity];
                  const levelReq =
                    SHOP_LISTINGS.equipment[rarity].levelRequired;
                  const isLocked = character.level < levelReq;

                  return (
                    <button
                      key={rarity}
                      onClick={() => !isLocked && setSelectedRarity(rarity)}
                      disabled={isLocked}
                      className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                        selectedRarity === rarity
                          ? "ring-2 ring-offset-2 dark:ring-offset-slate-800"
                          : ""
                      } ${isLocked ? "opacity-40 cursor-not-allowed" : ""}`}
                      style={{
                        backgroundColor: `${config.color}20`,
                        color: config.color,
                        borderColor: config.color,
                        ...(selectedRarity === rarity
                          ? { ringColor: config.color }
                          : {}),
                      }}
                    >
                      {rarity}
                      {isLocked && ` (Lv.${levelReq})`}
                    </button>
                  );
                })}
              </div>
              <EquipmentGrid
                rarity={selectedRarity}
                onBuy={handleBuy}
                canAfford={canAfford}
              />
            </div>
          )}
          {activeTab === "gacha" && (
            <GachaSection
              gold={inventory.gold}
              essence={inventory.essenceShards}
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

function ConsumablesGrid({
  onBuy,
  canAfford,
}: {
  onBuy: (itemId: string, price: number, priceType: "gold" | "essence") => void;
  canAfford: (price: number, priceType: "gold" | "essence") => boolean;
}) {
  const listings = SHOP_LISTINGS.permanent;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => {
        const item = getItemById(listing.itemId);
        if (!item) return null;

        const config = RARITY_CONFIG[item.rarity];
        const affordable = canAfford(listing.price, listing.priceType);

        return (
          <div
            key={listing.itemId}
            className="relative bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 transition-all group"
          >
            {/* Rarity Glow */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ boxShadow: `inset 0 0 20px ${config.glowColor}` }}
            />

            <div className="relative flex items-center gap-4">
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <img
                  src={item.iconPath}
                  alt={item.name}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/rpg/items/placeholder.png";
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Price & Buy */}
              <button
                onClick={() =>
                  onBuy(listing.itemId, listing.price, listing.priceType)
                }
                disabled={!affordable}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  affordable
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                {listing.priceType === "gold" ? (
                  <Coins className="w-4 h-4" />
                ) : (
                  <Diamond className="w-4 h-4" />
                )}
                {listing.price}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EquipmentGrid({
  rarity,
  onBuy,
  canAfford,
}: {
  rarity: Rarity;
  onBuy: (itemId: string, price: number, priceType: "gold" | "essence") => void;
  canAfford: (price: number, priceType: "gold" | "essence") => boolean;
}) {
  // Use getEquipmentsByRarity to get equipment with Supabase icon URLs
  const equipment = getEquipmentsByRarity(rarity);
  const basePrice = SHOP_LISTINGS.equipment[rarity].basePrice;
  const config = RARITY_CONFIG[rarity];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {equipment.map((eq) => {
        const affordable = canAfford(basePrice, "gold");

        return (
          <div
            key={eq.id}
            className="relative bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:scale-[1.02] transition-all group overflow-hidden"
          >
            {/* Rarity Border Glow */}
            <div
              className="absolute inset-0 rounded-xl opacity-30"
              style={{ boxShadow: `inset 0 0 30px ${config.glowColor}` }}
            />

            <div className="relative">
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  <img
                    src={eq.iconPath}
                    alt={eq.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/rpg/items/placeholder.png";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold truncate"
                    style={{ color: config.color }}
                  >
                    {eq.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {eq.slot} • {eq.rarity}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-2 mb-3">
                {Object.entries(eq.stats).map(([stat, value]) => (
                  <span
                    key={stat}
                    className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    +{value} {stat}
                  </span>
                ))}
                {eq.affinity && (
                  <span className="text-xs px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                    +{Math.round(eq.affinityBonus * 100)}% {eq.affinity} XP
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {eq.description}
              </p>

              {/* Buy Button */}
              <button
                onClick={() => onBuy(eq.id, basePrice, "gold")}
                disabled={!affordable}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  affordable
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                <Coins className="w-4 h-4" />
                {basePrice.toLocaleString()} Gold
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GachaSection({ gold, essence }: { gold: number; essence: number }) {
  const [isOpening, setIsOpening] = useState(false);
  const [result, setResult] = useState<{ name: string; rarity: Rarity } | null>(
    null,
  );
  const { openMysteryBox } = useGameStore();
  const { confirm } = useConfirm();
  const { toast } = useToast();

  // Get mystery box icons from item definitions
  const standardBoxItem = getItemById("item_mystery_box");
  const premiumBoxItem = getItemById("item_mystery_box_premium");
  const standardBoxIcon =
    standardBoxItem?.iconPath || "/assets/rpg/items/consumable_mystery_box.png";
  const premiumBoxIcon =
    premiumBoxItem?.iconPath ||
    "/assets/rpg/items/consumable_mystery_box_premium.png";

  const handleOpen = async (type: "standard" | "premium") => {
    const cost = type === "standard" ? 200 : 50;
    const currency = type === "standard" ? "gold" : "essence";

    if (
      (currency === "gold" && gold < cost) ||
      (currency === "essence" && essence < cost)
    ) {
      toast.error(
        `Insufficient Funds: You do not have enough ${currency} to open this box.`,
      );
      return;
    }

    const confirmed = await confirm({
      title: "Open Mystery Box",
      message: `Spend ${cost} ${currency} to open a ${type} mystery box?`,
      confirmText: "Open It!",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    setIsOpening(true);
    // Simulate animation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const resultItem = openMysteryBox(type);
    if (resultItem) {
      setResult(resultItem);

      // Get updated balance
      const newBalance =
        useGameStore.getState().inventory[
          currency === "gold" ? "gold" : "essenceShards"
        ];
      const currencyName = currency === "gold" ? "Gold" : "Essence";

      toast.success(
        `Found ${resultItem.name} (${type})! -${cost} ${currencyName}. Remaining: ${newBalance}.`,
      );
    }
    setIsOpening(false);
  };

  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        <Sparkles className="w-6 h-6 inline-block text-amber-500 mr-2" />
        Mystery Box
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Test your luck! Open boxes to discover rare equipment.
      </p>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        {/* Standard Box */}
        <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 w-72 border-2 border-slate-300 dark:border-slate-600">
          <img
            src={standardBoxIcon}
            alt="Mystery Box"
            className="w-32 h-32 mx-auto mb-4 drop-shadow-lg"
          />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
            Standard Box
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Chance for all rarities
          </p>
          <button
            onClick={() => handleOpen("standard")}
            disabled={gold < 200 || isOpening}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
              gold >= 200 && !isOpening
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Coins className="w-5 h-5" />
            200 Gold
          </button>
        </div>

        {/* Premium Box */}
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl p-6 w-72 border-2 border-purple-400 dark:border-purple-600">
          <div className="relative">
            <img
              src={premiumBoxIcon}
              alt="Premium Mystery Box"
              className="w-32 h-32 mx-auto mb-4 drop-shadow-lg"
              style={{ filter: "hue-rotate(45deg) saturate(1.5)" }}
            />
            <span className="absolute top-0 right-4 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              PREMIUM
            </span>
          </div>
          <h3 className="font-bold text-lg text-purple-900 dark:text-purple-100 mb-1">
            Premium Box
          </h3>
          <p className="text-sm text-purple-600 dark:text-purple-300 mb-4">
            Guaranteed Rare+
          </p>
          <button
            onClick={() => handleOpen("premium")}
            disabled={essence < 50 || isOpening}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
              essence >= 50 && !isOpening
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Diamond className="w-5 h-5" />
            50 Essence
          </button>
        </div>
      </div>

      {/* Result Modal */}
      {result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center max-w-sm mx-4 animate-bounce-in"
            style={{
              boxShadow: `0 0 60px ${RARITY_CONFIG[result.rarity].glowColor}`,
            }}
          >
            <h3
              className="text-2xl font-bold mb-4 capitalize"
              style={{ color: RARITY_CONFIG[result.rarity].color }}
            >
              {result.rarity}!
            </h3>
            <p className="text-lg text-slate-900 dark:text-white mb-6">
              {result.name}
            </p>
            <button
              onClick={() => setResult(null)}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopPanel;

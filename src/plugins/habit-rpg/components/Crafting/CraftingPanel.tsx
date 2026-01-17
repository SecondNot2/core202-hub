/**
 * CraftingPanel - Main crafting UI
 */

import React from "react";
import { Link } from "react-router-dom";
import { useGameStore } from "../../store";
import { CRAFTING_RECIPES } from "../../domain/constants";
import { RecipeCard } from "./RecipeCard";
import { useConfirm, useToast } from "@shared/components";

export const CraftingPanel: React.FC = () => {
  const gold = useGameStore((s) => s.inventory.gold);
  const playerLevel = useGameStore((s) => s.character.level);
  const restoreEnergy = useGameStore((s) => s.restoreEnergy);
  const adjustMorale = useGameStore((s) => s.adjustMorale);
  const spendGold = useGameStore((s) => s.spendGold);
  const { confirm } = useConfirm();
  const { toast } = useToast();

  // Crafting is unlocked at Level 10
  const isUnlocked = playerLevel >= 10;

  const handleCraft = async (recipeId: string) => {
    const recipe = CRAFTING_RECIPES.find((r) => r.id === recipeId);
    if (!recipe) return;

    // Check gold
    if (gold < recipe.goldCost) {
      toast.error(
        `Insufficient Gold: You need ${recipe.goldCost} gold to craft this item.`,
      );
      return;
    }

    const confirmed = await confirm({
      title: "Craft Item",
      message: `Spend ${recipe.goldCost} Gold to craft ${recipe.name}?`,
      confirmText: "Craft",
      cancelText: "Cancel",
    });

    if (confirmed) {
      if (!spendGold(recipe.goldCost)) return; // Double check

      // Apply effect
      switch (recipeId) {
        case "grace-token":
          useGameStore.setState((state) => ({
            streak: {
              ...state.streak,
              graceTokens: Math.min(
                state.streak.graceTokens + 1,
                state.streak.maxGraceTokens + 1,
              ),
            },
          }));
          break;
        case "energy-potion":
          restoreEnergy(25);
          break;
        case "morale-boost":
          adjustMorale(15);
          break;
      }

      // Log event
      useGameStore.getState().logEvent("item_crafted", { recipeId });

      const newBalance = useGameStore.getState().inventory.gold;

      toast.success(
        `Crafting Successful: Crafted ${recipe.name} (-${recipe.goldCost} Gold). Remaining: ${newBalance} Gold.`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-100 dark:from-slate-950 dark:via-amber-950/20 dark:to-slate-950 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/rpg"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 text-sm mb-2 inline-block transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-3xl">⚗️</span> Crafting
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Spend gold to craft useful items
            </p>
          </div>

          {/* Gold Display */}
          <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-md rounded-xl px-6 py-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Available Gold
            </div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              💰 {gold}
            </div>
          </div>
        </div>

        {/* Level Lock Warning */}
        {!isUnlocked && (
          <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg">
            <span className="text-amber-700 dark:text-amber-300">
              🔒 Crafting unlocks at Level 10. You're currently Level{" "}
              {playerLevel}.
            </span>
          </div>
        )}

        {/* Recipes */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            📜 Available Recipes
          </h2>
          {CRAFTING_RECIPES.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              canAfford={gold >= recipe.goldCost}
              isLocked={!isUnlocked}
              onCraft={handleCraft}
            />
          ))}
        </div>

        {/* Info */}
        <div className="bg-white/80 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
            ℹ️ Crafting Tips
          </h3>
          <ul className="text-slate-500 dark:text-slate-400 text-sm space-y-2">
            <li>• Complete quests to earn gold</li>
            <li>• Grace tokens protect your streak when you miss quests</li>
            <li>• Energy potions let you complete more quests per day</li>
            <li>• High morale gives bonus XP rewards</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

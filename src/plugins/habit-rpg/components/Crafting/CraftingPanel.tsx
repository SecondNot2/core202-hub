/**
 * CraftingPanel - Main crafting UI
 */

import React from "react";
import { Link } from "react-router-dom";
import { useGameStore } from "../../store";
import { CRAFTING_RECIPES } from "../../domain/constants";
import { RecipeCard } from "./RecipeCard";

export const CraftingPanel: React.FC = () => {
  const gold = useGameStore((s) => s.inventory.gold);
  const currentWeek = useGameStore((s) => s.season.currentWeek);
  const spendGold = useGameStore((s) => s.spendGold);
  const restoreEnergy = useGameStore((s) => s.restoreEnergy);
  const adjustMorale = useGameStore((s) => s.adjustMorale);

  // Crafting is unlocked at Week 6
  const isUnlocked = currentWeek >= 6;

  const handleCraft = (recipeId: string) => {
    const recipe = CRAFTING_RECIPES.find((r) => r.id === recipeId);
    if (!recipe) return;

    // Check gold
    if (!spendGold(recipe.goldCost)) {
      return;
    }

    // Apply effect
    switch (recipeId) {
      case "grace-token":
        useGameStore.setState((state) => ({
          streak: {
            ...state.streak,
            graceTokens: Math.min(
              state.streak.graceTokens + 1,
              state.streak.maxGraceTokens + 1
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-950 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/rpg"
              className="text-purple-400 hover:text-purple-300 text-sm mb-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">⚗️</span> Crafting
            </h1>
            <p className="text-slate-400 mt-1">
              Spend gold to craft useful items
            </p>
          </div>

          {/* Gold Display */}
          <div className="bg-slate-800/50 backdrop-blur rounded-xl px-6 py-4 border border-slate-700">
            <div className="text-sm text-slate-400">Available Gold</div>
            <div className="text-3xl font-bold text-yellow-400">💰 {gold}</div>
          </div>
        </div>

        {/* Week Lock Warning */}
        {!isUnlocked && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <span className="text-amber-300">
              🔒 Crafting unlocks in Week 6. You're currently in Week{" "}
              {currentWeek}.
            </span>
          </div>
        )}

        {/* Recipes */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">📜 Available Recipes</h2>
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
        <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-4">
          <h3 className="text-lg font-bold text-white mb-3">
            ℹ️ Crafting Tips
          </h3>
          <ul className="text-slate-400 text-sm space-y-2">
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

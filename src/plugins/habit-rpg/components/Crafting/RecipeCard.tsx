/**
 * RecipeCard - Single craftable item
 */

import React from "react";

interface Recipe {
  id: string;
  name: string;
  description: string;
  icon: string;
  goldCost: number;
  effect: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  canAfford: boolean;
  isLocked: boolean;
  onCraft: (id: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  canAfford,
  isLocked,
  onCraft,
}) => {
  const isDisabled = isLocked || !canAfford;

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isLocked
          ? "bg-slate-900/50 border-slate-700 opacity-50"
          : canAfford
          ? "bg-slate-800/80 border-slate-600 hover:border-purple-500/50 cursor-pointer"
          : "bg-slate-900/30 border-slate-700"
      }`}
      onClick={() => !isDisabled && onCraft(recipe.id)}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="text-4xl">{recipe.icon}</div>

        {/* Info */}
        <div className="flex-1">
          <h4 className="font-bold text-white">{recipe.name}</h4>
          <p className="text-sm text-slate-400 mb-2">{recipe.description}</p>

          {/* Effect */}
          <div className="text-xs px-2 py-1 bg-slate-900/50 rounded inline-block text-green-400">
            {recipe.effect}
          </div>
        </div>

        {/* Cost & Button */}
        <div className="text-right">
          <div
            className={`text-lg font-bold mb-2 ${
              canAfford ? "text-yellow-400" : "text-red-400"
            }`}
          >
            💰 {recipe.goldCost}
          </div>
          {!isLocked && (
            <button
              disabled={!canAfford}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                canAfford
                  ? "bg-purple-600 hover:bg-purple-500 text-white"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
              }`}
            >
              Craft
            </button>
          )}
          {isLocked && (
            <span className="text-xs text-slate-500">🔒 Locked</span>
          )}
        </div>
      </div>
    </div>
  );
};

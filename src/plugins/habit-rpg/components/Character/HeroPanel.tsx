/**
 * HeroPanel - Character stats display with HP, XP, Energy, Morale
 */

import React from "react";
import { useGameStore } from "../../store";

export const HeroPanel: React.FC = () => {
  const character = useGameStore((s) => s.character);
  const streak = useGameStore((s) => s.streak);
  const inventory = useGameStore((s) => s.inventory);

  const xpPercent = (character.xp / character.xpToNextLevel) * 100;
  const energyPercent = (character.energy / character.maxEnergy) * 100;
  const moralePercent = character.morale;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900/50 dark:to-slate-900 p-6 border border-purple-200 dark:border-purple-500/20 shadow-sm transition-all duration-300">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-2xl" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-6">
        {/* Avatar & Level */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-white dark:ring-purple-500/30">
              {character.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-purple-600 dark:bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full ring-2 ring-white dark:ring-slate-900">
              Lv.{character.level}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {character.name}
            </h2>
            <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">
              {character.archetypeId
                ? character.archetypeId.charAt(0).toUpperCase() +
                  character.archetypeId.slice(1)
                : "Classless"}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-orange-500 dark:text-orange-400 text-sm font-medium">
                🔥 {streak.currentStreak} day streak
              </span>
            </div>
          </div>
        </div>

        {/* Stats Bars */}
        <div className="flex-1 space-y-3">
          {/* XP Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-amber-600 dark:text-yellow-300 font-medium">
                ⭐ Experience
              </span>
              <span className="text-slate-600 dark:text-white/80">
                {character.xp} / {character.xpToNextLevel}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          {/* Energy Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-cyan-600 dark:text-cyan-300 font-medium">
                ⚡ Energy
              </span>
              <span className="text-slate-600 dark:text-white/80">
                {character.energy} / {character.maxEnergy}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                style={{ width: `${energyPercent}%` }}
              />
            </div>
          </div>

          {/* Morale Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-pink-600 dark:text-pink-300 font-medium">
                💖 Morale
              </span>
              <span className="text-slate-600 dark:text-white/80">
                {character.morale}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700/50 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  moralePercent > 50
                    ? "bg-gradient-to-r from-pink-400 to-rose-500"
                    : moralePercent > 30
                    ? "bg-gradient-to-r from-orange-400 to-amber-500"
                    : "bg-gradient-to-r from-red-500 to-red-600"
                }`}
                style={{ width: `${moralePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Currency & Stats */}
        <div className="lg:border-l lg:border-purple-200 dark:lg:border-purple-500/20 lg:pl-6 flex flex-wrap lg:flex-col gap-3">
          <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-purple-100 dark:border-transparent">
            <span className="text-amber-500 dark:text-yellow-400">💰</span>
            <span className="text-slate-700 dark:text-white font-semibold">
              {inventory.gold}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-purple-100 dark:border-transparent">
            <span className="text-purple-500 dark:text-purple-400">💎</span>
            <span className="text-slate-700 dark:text-white font-semibold">
              {inventory.essenceShards}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-purple-100 dark:border-transparent">
            <span className="text-green-500 dark:text-green-400">🛡️</span>
            <span className="text-slate-700 dark:text-white font-semibold">
              {streak.graceTokens}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="relative z-10 mt-4 pt-4 border-t border-purple-200 dark:border-purple-500/20 flex flex-wrap gap-4">
        <StatBadge label="STR" value={character.stats.STR} color="red" />
        <StatBadge label="INT" value={character.stats.INT} color="blue" />
        <StatBadge label="DEX" value={character.stats.DEX} color="green" />
        <StatBadge label="WIS" value={character.stats.WIS} color="purple" />
        <StatBadge label="VIT" value={character.stats.VIT} color="orange" />
      </div>
    </div>
  );
};

interface StatBadgeProps {
  label: string;
  value: number;
  color: "red" | "blue" | "green" | "purple" | "orange";
}

const StatBadge: React.FC<StatBadgeProps> = ({ label, value, color }) => {
  const colorClasses = {
    red: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30",
    blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30",
    green:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30",
    purple:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30",
    orange:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30",
  };

  return (
    <div
      className={`px-3 py-1 rounded-lg border ${colorClasses[color]} flex items-center gap-2 transition-colors duration-300`}
    >
      <span className="font-bold">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
};

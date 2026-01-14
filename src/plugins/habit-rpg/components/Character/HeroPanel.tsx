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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 p-6 border border-purple-500/20">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-6">
        {/* Avatar & Level */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-purple-500/30">
              {character.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Lv.{character.level}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">{character.name}</h2>
            <p className="text-purple-300 text-sm">
              {character.archetypeId
                ? character.archetypeId.charAt(0).toUpperCase() +
                  character.archetypeId.slice(1)
                : "Classless"}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-orange-400 text-sm">
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
              <span className="text-yellow-300">⭐ Experience</span>
              <span className="text-white/80">
                {character.xp} / {character.xpToNextLevel}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-700/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          {/* Energy Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-cyan-300">⚡ Energy</span>
              <span className="text-white/80">
                {character.energy} / {character.maxEnergy}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-700/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                style={{ width: `${energyPercent}%` }}
              />
            </div>
          </div>

          {/* Morale Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-pink-300">💖 Morale</span>
              <span className="text-white/80">{character.morale}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-700/50 overflow-hidden">
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
        <div className="lg:border-l lg:border-purple-500/20 lg:pl-6 flex flex-wrap lg:flex-col gap-3">
          <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg">
            <span className="text-yellow-400">💰</span>
            <span className="text-white font-semibold">{inventory.gold}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg">
            <span className="text-purple-400">💎</span>
            <span className="text-white font-semibold">
              {inventory.essenceShards}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg">
            <span className="text-green-400">🛡️</span>
            <span className="text-white font-semibold">
              {streak.graceTokens}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="relative z-10 mt-4 pt-4 border-t border-purple-500/20 flex flex-wrap gap-4">
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
    red: "bg-red-500/20 text-red-300 border-red-500/30",
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    green: "bg-green-500/20 text-green-300 border-green-500/30",
    purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    orange: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  };

  return (
    <div
      className={`px-3 py-1 rounded-lg border ${colorClasses[color]} flex items-center gap-2`}
    >
      <span className="font-bold">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
};

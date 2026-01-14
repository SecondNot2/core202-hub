/**
 * ArchetypeCard - Individual archetype display with stats preview
 */

import React from "react";
import type { Archetype } from "../../domain/types";

interface ArchetypeCardProps {
  archetype: Archetype;
  isSelected: boolean;
  isLocked: boolean;
  onSelect: (id: string) => void;
}

export const ArchetypeCard: React.FC<ArchetypeCardProps> = ({
  archetype,
  isSelected,
  isLocked,
  onSelect,
}) => {
  // Archetype icons and colors
  const archetypeStyles = {
    builder: {
      icon: "🏗️",
      gradient: "from-orange-500 to-amber-600",
      border: "border-orange-400",
      glow: "hover:shadow-orange-500/30",
    },
    scholar: {
      icon: "📚",
      gradient: "from-blue-500 to-indigo-600",
      border: "border-blue-400",
      glow: "hover:shadow-blue-500/30",
    },
    athlete: {
      icon: "🏃",
      gradient: "from-green-500 to-emerald-600",
      border: "border-green-400",
      glow: "hover:shadow-green-500/30",
    },
    creator: {
      icon: "🎨",
      gradient: "from-purple-500 to-pink-600",
      border: "border-purple-400",
      glow: "hover:shadow-purple-500/30",
    },
  };

  const style = archetypeStyles[archetype.id as keyof typeof archetypeStyles];

  return (
    <div
      className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
        isSelected
          ? `bg-gradient-to-br ${style.gradient} ${style.border} shadow-xl scale-105`
          : isLocked
          ? "bg-slate-900/50 border-slate-700 opacity-60 cursor-not-allowed"
          : `bg-slate-800/80 ${style.border} border-opacity-30 hover:border-opacity-100 cursor-pointer hover:scale-102 ${style.glow} hover:shadow-xl`
      }`}
      onClick={() => !isLocked && !isSelected && onSelect(archetype.id)}
    >
      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute top-3 right-3 bg-white/20 text-white text-xs px-2 py-1 rounded-full">
          ✓ Selected
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Icon & Name */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`text-5xl ${isSelected ? "" : "grayscale-0"}`}>
            {style.icon}
          </div>
          <div>
            <h3
              className={`text-xl font-bold ${
                isSelected ? "text-white" : "text-slate-200"
              }`}
            >
              {archetype.name}
            </h3>
            <p
              className={`text-sm ${
                isSelected ? "text-white/80" : "text-slate-400"
              }`}
            >
              {archetype.description}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-2 gap-3 p-3 rounded-lg ${
            isSelected ? "bg-white/10" : "bg-slate-900/50"
          }`}
        >
          <div>
            <div
              className={`text-xs ${
                isSelected ? "text-white/60" : "text-slate-500"
              }`}
            >
              Primary Stat
            </div>
            <div
              className={`font-bold ${
                isSelected ? "text-white" : "text-slate-200"
              }`}
            >
              {archetype.primaryStat} +20%
            </div>
          </div>
          <div>
            <div
              className={`text-xs ${
                isSelected ? "text-white/60" : "text-slate-500"
              }`}
            >
              Secondary Stat
            </div>
            <div
              className={`font-bold ${
                isSelected ? "text-white" : "text-slate-200"
              }`}
            >
              {archetype.secondaryStat} +10%
            </div>
          </div>
        </div>

        {/* XP Bonus */}
        <div
          className={`mt-3 text-center py-2 rounded-lg ${
            isSelected
              ? "bg-white/10 text-white"
              : "bg-slate-900/50 text-slate-300"
          }`}
        >
          <span className="text-yellow-400">⭐</span> +
          {Math.round((archetype.bonuses.xpMultiplier - 1) * 100)}% XP Bonus
        </div>

        {/* Select Button */}
        {!isSelected && !isLocked && (
          <button
            className={`w-full mt-4 py-2.5 rounded-lg bg-gradient-to-r ${style.gradient} text-white font-semibold hover:opacity-90 transition-opacity`}
          >
            Choose {archetype.name}
          </button>
        )}
      </div>
    </div>
  );
};

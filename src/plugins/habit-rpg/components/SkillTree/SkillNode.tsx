/**
 * SkillNode - Individual skill node with unlock state
 */

import React from "react";
import type { SkillNode as SkillNodeType } from "../../domain/types";

interface SkillNodeProps {
  node: SkillNodeType;
  isUnlocked: boolean;
  isAvailable: boolean;
  isWeekLocked: boolean;
  currentShards: number;
  onUnlock: (nodeId: string) => void;
}

export const SkillNode: React.FC<SkillNodeProps> = ({
  node,
  isUnlocked,
  isAvailable,
  isWeekLocked,
  currentShards,
  onUnlock,
}) => {
  const canAfford = currentShards >= node.cost;
  const canUnlock = isAvailable && canAfford && !isWeekLocked;

  // Branch colors
  const branchColors = {
    discipline: {
      bg: "from-amber-500 to-yellow-600",
      border: "border-amber-400",
      glow: "shadow-amber-500/30",
      text: "text-amber-300",
    },
    focus: {
      bg: "from-blue-500 to-indigo-600",
      border: "border-blue-400",
      glow: "shadow-blue-500/30",
      text: "text-blue-300",
    },
    resilience: {
      bg: "from-emerald-500 to-green-600",
      border: "border-emerald-400",
      glow: "shadow-emerald-500/30",
      text: "text-emerald-300",
    },
  };

  const colors = branchColors[node.branch];

  // Tier icons
  const tierIcons = {
    1: "◆",
    2: "◆◆",
    3: "◆◆◆",
    4: "★",
  };

  return (
    <div
      className={`relative rounded-xl border-2 p-4 transition-all duration-300 ${
        isUnlocked
          ? `bg-gradient-to-br ${colors.bg} ${colors.border} shadow-lg ${colors.glow}`
          : isAvailable && !isWeekLocked
          ? `bg-slate-800/80 ${colors.border} border-dashed hover:border-solid cursor-pointer hover:scale-105`
          : "bg-slate-900/50 border-slate-700 opacity-50"
      }`}
      onClick={() => canUnlock && onUnlock(node.id)}
    >
      {/* Tier Badge */}
      <div
        className={`absolute -top-2 -right-2 text-xs px-2 py-0.5 rounded-full ${
          isUnlocked ? "bg-white/20 text-white" : "bg-slate-700 text-slate-400"
        }`}
      >
        {tierIcons[node.tier]}
      </div>

      {/* Lock Icon */}
      {isWeekLocked && (
        <div className="absolute -top-2 -left-2 bg-slate-700 text-slate-400 text-xs px-2 py-0.5 rounded-full">
          🔒 W{node.weekUnlock}
        </div>
      )}

      {/* Content */}
      <div className="space-y-2">
        <h4 className={`font-bold ${isUnlocked ? "text-white" : colors.text}`}>
          {node.name}
        </h4>
        <p className="text-sm text-slate-300/80">{node.description}</p>

        {/* Effect */}
        <div
          className={`text-xs px-2 py-1 rounded ${
            isUnlocked
              ? "bg-white/10 text-white"
              : "bg-slate-800 text-slate-400"
          }`}
        >
          {node.effect}
        </div>

        {/* Cost */}
        {!isUnlocked && (
          <div
            className={`flex items-center justify-between text-sm mt-2 pt-2 border-t ${
              isWeekLocked ? "border-slate-700" : colors.border + "/30"
            }`}
          >
            <span className="text-slate-400">Cost:</span>
            <span className={canAfford ? "text-purple-400" : "text-red-400"}>
              💎 {node.cost}
            </span>
          </div>
        )}

        {/* Unlock Button */}
        {canUnlock && (
          <button
            className={`w-full mt-2 py-1.5 rounded-lg bg-gradient-to-r ${colors.bg} text-white text-sm font-medium hover:opacity-90 transition-opacity`}
          >
            Unlock
          </button>
        )}

        {/* Unlocked Badge */}
        {isUnlocked && (
          <div className="text-center text-white/80 text-sm mt-2">
            ✓ Unlocked
          </div>
        )}
      </div>
    </div>
  );
};

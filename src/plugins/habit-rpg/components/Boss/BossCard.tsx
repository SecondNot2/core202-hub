/**
 * BossCard - Boss display with HP bar and info
 */

import React from "react";
import type { Boss } from "../../domain/types";

interface BossCardProps {
  boss: Boss;
  weeklyDamage: number;
  weeklyQuests: number;
}

export const BossCard: React.FC<BossCardProps> = ({
  boss,
  weeklyDamage,
  weeklyQuests,
}) => {
  const hpPercent = (boss.currentHealth / boss.maxHealth) * 100;
  const isLowHp = hpPercent < 30;

  // Boss type colors
  const bossColors = {
    "dawn-sloth": { bg: "from-orange-600 to-amber-700", icon: "🦥" },
    "the-drift": { bg: "from-purple-600 to-indigo-700", icon: "🌀" },
    entropy: { bg: "from-red-600 to-rose-700", icon: "💀" },
    burnout: { bg: "from-slate-600 to-gray-700", icon: "🔥" },
  };

  const bossStyle = bossColors[
    boss.id.split("-").slice(-2).join("-") as keyof typeof bossColors
  ] || { bg: "from-slate-600 to-gray-700", icon: "👹" };

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 overflow-hidden">
      {/* Boss Header */}
      <div className={`bg-gradient-to-r ${bossStyle.bg} p-6`}>
        <div className="flex items-center gap-4">
          <div className="text-6xl">{bossStyle.icon}</div>
          <div className="flex-1">
            <div className="text-sm text-white/70 mb-1">Weekly Boss</div>
            <h2 className="text-2xl font-bold text-white">{boss.name}</h2>
            <p className="text-white/80 text-sm mt-1">{boss.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/70">Difficulty</div>
            <div className="text-xl text-yellow-300">
              {"⭐".repeat(boss.difficulty)}
            </div>
          </div>
        </div>
      </div>

      {/* HP Bar */}
      <div className="p-6">
        <div className="flex justify-between mb-2">
          <span className="text-slate-400">Health</span>
          <span className={isLowHp ? "text-red-400" : "text-white"}>
            {boss.currentHealth} / {boss.maxHealth}
          </span>
        </div>
        <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isLowHp
                ? "bg-gradient-to-r from-red-500 to-red-600 animate-pulse"
                : "bg-gradient-to-r from-green-500 to-emerald-600"
            }`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {weeklyDamage}
            </div>
            <div className="text-sm text-slate-400">Damage Dealt</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {weeklyQuests}
            </div>
            <div className="text-sm text-slate-400">Quests Completed</div>
          </div>
        </div>

        {/* Weakness Hint */}
        {boss.weakness && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <span className="text-amber-300 text-sm">
              💡 Weakness:{" "}
              <strong className="capitalize">{boss.weakness}</strong> quests
              deal bonus damage!
            </span>
          </div>
        )}
      </div>

      {/* Rewards Preview */}
      <div className="border-t border-slate-700 p-4 bg-slate-900/30">
        <div className="text-sm text-slate-400 mb-2">Defeat Rewards</div>
        <div className="flex gap-4">
          <span className="text-yellow-400">💰 {boss.rewards.gold} Gold</span>
          <span className="text-purple-400">
            💎 {boss.rewards.shards} Shards
          </span>
          {boss.rewards.relicId && (
            <span className="text-emerald-400">🏆 Relic</span>
          )}
        </div>
      </div>
    </div>
  );
};

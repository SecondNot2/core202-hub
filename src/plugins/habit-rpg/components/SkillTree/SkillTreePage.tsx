4;
/**
 * SkillTreePage - Skill tree page wrapper
 */

import React from "react";
import { Link } from "react-router-dom";
import { useGameStore } from "../../store";
import { SkillTreeView } from "./SkillTreeView";

export const SkillTreePage: React.FC = () => {
  const inventory = useGameStore((s) => s.inventory);
  const skillTree = useGameStore((s) => s.skillTree);
  const season = useGameStore((s) => s.season);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 dark:from-slate-950 dark:via-purple-950/30 dark:to-slate-950 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
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
              <span className="text-3xl">⚡</span> Skill Tree
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Unlock powerful abilities with Essence Shards
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-md rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Available Shards
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                💎 {inventory.essenceShards}
              </div>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-md rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Skills Unlocked
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {skillTree.unlockedSkillIds.length} / 18
              </div>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-md rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Current Week
              </div>
              <div className="text-2xl font-bold text-amber-500 dark:text-amber-400">
                Week {season.currentWeek}
              </div>
            </div>
          </div>
        </div>

        {/* Week Progress Note */}
        {season.currentWeek < 9 && (
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg p-4 text-amber-700 dark:text-amber-300 text-sm">
            ℹ️ Some skills are locked until later weeks. Keep completing quests
            to progress!
          </div>
        )}

        {/* Skill Tree */}
        <SkillTreeView />
      </div>
    </div>
  );
};

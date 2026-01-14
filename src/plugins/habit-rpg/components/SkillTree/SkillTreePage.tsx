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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
              <span className="text-3xl">⚡</span> Skill Tree
            </h1>
            <p className="text-slate-400 mt-1">
              Unlock powerful abilities with Essence Shards
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-slate-800/50 backdrop-blur rounded-xl px-4 py-3 border border-slate-700">
              <div className="text-sm text-slate-400">Available Shards</div>
              <div className="text-2xl font-bold text-purple-400">
                💎 {inventory.essenceShards}
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur rounded-xl px-4 py-3 border border-slate-700">
              <div className="text-sm text-slate-400">Skills Unlocked</div>
              <div className="text-2xl font-bold text-emerald-400">
                {skillTree.unlockedSkillIds.length} / 18
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur rounded-xl px-4 py-3 border border-slate-700">
              <div className="text-sm text-slate-400">Current Week</div>
              <div className="text-2xl font-bold text-amber-400">
                Week {season.currentWeek}
              </div>
            </div>
          </div>
        </div>

        {/* Week Progress Note */}
        {season.currentWeek < 9 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-amber-300 text-sm">
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

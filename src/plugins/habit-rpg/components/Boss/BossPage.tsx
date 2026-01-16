/**
 * BossPage - Boss encounter page wrapper
 */

import React from "react";
import { Link } from "react-router-dom";
import { useGameStore } from "../../store";
import { BossCard } from "./BossCard";
import { NoBoss } from "./NoBoss";

export const BossPage: React.FC = () => {
  const boss = useGameStore((s) => s.boss);
  const season = useGameStore((s) => s.season);
  const inventory = useGameStore((s) => s.inventory);

  const defeatedCount = boss.defeatedBossIds.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/20 to-slate-100 dark:from-slate-950 dark:via-red-950/20 dark:to-slate-950 p-4 md:p-6 transition-colors duration-300">
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
              <span className="text-3xl">⚔️</span> Boss Encounter
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Complete quests to deal damage to the weekly boss
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-md rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Bosses Defeated
              </div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                💀 {defeatedCount}
              </div>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-md rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Total Relics
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                🏆 {inventory.relics.length}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {boss.currentBoss && !boss.currentBoss.isDefeated ? (
          <BossCard
            boss={boss.currentBoss}
            weeklyDamage={boss.weeklyDamageDealt}
            weeklyQuests={boss.weeklyQuestsCompleted}
          />
        ) : (
          <NoBoss currentWeek={season.currentWeek} />
        )}

        {/* Defeated Boss History */}
        {defeatedCount > 0 && (
          <div className="bg-white/80 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              🏆 Defeated Bosses
            </h3>
            <div className="flex flex-wrap gap-2">
              {boss.defeatedBossIds.map((id, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-700/50 rounded-full text-sm text-slate-600 dark:text-slate-300"
                >
                  {id.replace("boss-", "").replace(/-/g, " ")}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-white/80 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
            ℹ️ How Boss Battles Work
          </h3>
          <ul className="text-slate-500 dark:text-slate-400 text-sm space-y-2">
            <li>
              • A new boss spawns every Monday based on your missed quests
            </li>
            <li>• Completing quests automatically deals damage to the boss</li>
            <li>• Harder quests deal more damage</li>
            <li>• Quests matching the boss's weakness deal bonus damage</li>
            <li>• Defeat the boss before Sunday to earn rewards!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

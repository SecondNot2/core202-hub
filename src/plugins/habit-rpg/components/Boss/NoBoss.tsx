/**
 * NoBoss - Empty state when no boss is active
 */

import React from "react";

interface NoBossProps {
  playerLevel: number;
}

export const NoBoss: React.FC<NoBossProps> = ({ playerLevel }) => {
  const bossUnlockLevel = 8;
  const isLocked = playerLevel < bossUnlockLevel;

  return (
    <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm transition-all duration-300">
      <div className="text-6xl mb-4">{isLocked ? "🔒" : "😴"}</div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {isLocked ? "Boss Battles Locked" : "No Active Boss"}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        {isLocked
          ? `Boss encounters unlock at Level ${bossUnlockLevel}. Keep completing quests to level up! You're currently Level ${playerLevel}.`
          : "A new boss will spawn at the start of next week. Complete your quests to prepare!"}
      </p>

      {!isLocked && (
        <div className="mt-6 inline-block px-4 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-sm text-slate-600 dark:text-slate-300">
          🗓️ Next boss spawns Monday
        </div>
      )}
    </div>
  );
};

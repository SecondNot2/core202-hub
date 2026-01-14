/**
 * NoBoss - Empty state when no boss is active
 */

import React from "react";

interface NoBossProps {
  currentWeek: number;
}

export const NoBoss: React.FC<NoBossProps> = ({ currentWeek }) => {
  const bossUnlockWeek = 4;
  const isLocked = currentWeek < bossUnlockWeek;

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-12 text-center">
      <div className="text-6xl mb-4">{isLocked ? "🔒" : "😴"}</div>
      <h3 className="text-xl font-bold text-white mb-2">
        {isLocked ? "Boss Battles Locked" : "No Active Boss"}
      </h3>
      <p className="text-slate-400 max-w-md mx-auto">
        {isLocked
          ? `Weekly bosses unlock in Week ${bossUnlockWeek}. Keep completing quests to progress! You're currently in Week ${currentWeek}.`
          : "A new boss will spawn at the start of next week. Complete your quests to prepare!"}
      </p>

      {!isLocked && (
        <div className="mt-6 inline-block px-4 py-2 bg-slate-700/50 rounded-lg text-sm text-slate-300">
          🗓️ Next boss spawns Monday
        </div>
      )}
    </div>
  );
};

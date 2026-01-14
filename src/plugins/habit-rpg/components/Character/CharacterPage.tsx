/**
 * CharacterPage - Character management page
 */

import React from "react";
import { Link } from "react-router-dom";
import { useGameStore } from "../../store";
import { ArchetypeSelector } from "./ArchetypeSelector";

export const CharacterPage: React.FC = () => {
  const character = useGameStore((s) => s.character);
  const inventory = useGameStore((s) => s.inventory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
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
              <span className="text-3xl">👤</span> Character
            </h1>
            <p className="text-slate-400 mt-1">
              Choose your archetype and view your stats
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4">
            <div className="bg-slate-800/50 backdrop-blur rounded-xl px-4 py-3 border border-slate-700">
              <div className="text-sm text-slate-400">Level</div>
              <div className="text-2xl font-bold text-amber-400">
                {character.level}
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur rounded-xl px-4 py-3 border border-slate-700">
              <div className="text-sm text-slate-400">Total XP</div>
              <div className="text-2xl font-bold text-yellow-400">
                {character.totalXpEarned}
              </div>
            </div>
          </div>
        </div>

        {/* Current Stats */}
        <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700 p-5">
          <h2 className="text-lg font-bold text-white mb-4">
            📊 Current Stats
          </h2>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(character.stats).map(([stat, value]) => {
              const statColors: Record<string, string> = {
                STR: "text-red-400 bg-red-500/10 border-red-500/30",
                INT: "text-blue-400 bg-blue-500/10 border-blue-500/30",
                DEX: "text-green-400 bg-green-500/10 border-green-500/30",
                WIS: "text-purple-400 bg-purple-500/10 border-purple-500/30",
                VIT: "text-orange-400 bg-orange-500/10 border-orange-500/30",
              };
              return (
                <div
                  key={stat}
                  className={`text-center p-4 rounded-xl border ${statColors[stat]}`}
                >
                  <div className="text-3xl font-bold">{value}</div>
                  <div className="text-sm font-medium mt-1">{stat}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Archetype Section */}
        <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700 p-5">
          <h2 className="text-lg font-bold text-white mb-4">
            🎭 Choose Your Archetype
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Archetypes define your playstyle and provide bonuses to specific
            stats and XP gains. Choose wisely - this choice is permanent!
          </p>
          <ArchetypeSelector />
        </div>
      </div>
    </div>
  );
};

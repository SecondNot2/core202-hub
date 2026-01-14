/**
 * Dashboard - Main RPG dashboard view
 */

import React, { useEffect, useState } from "react";
import { useGameStore } from "../../store";
import { HeroPanel } from "../Character";
import { QuestList, HabitForm } from "../Quests";

export const Dashboard: React.FC = () => {
  const initializeGame = useGameStore((s) => s.initializeGame);
  const habits = useGameStore((s) => s.habits);
  const season = useGameStore((s) => s.season);

  const [showHabitForm, setShowHabitForm] = useState(false);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">🎮</span> Gamified Habits
            </h1>
            <p className="text-slate-400 mt-1">
              Week {season.currentWeek} • Season {season.seasonNumber}
            </p>
          </div>

          <button
            onClick={() => setShowHabitForm(!showHabitForm)}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors flex items-center gap-2"
          >
            <span>+</span> Add Habit
          </button>
        </div>

        {/* Hero Panel */}
        <HeroPanel />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quests (2 cols) */}
          <div className="lg:col-span-2">
            <QuestList />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Habit Form */}
            {showHabitForm && (
              <HabitForm onClose={() => setShowHabitForm(false)} />
            )}

            {/* Habit List Summary */}
            <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700/50 p-4">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span>📝</span> Your Habits
              </h3>

              {habits.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  No habits configured yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {habits
                    .filter((h) => h.isActive)
                    .map((habit) => (
                      <div
                        key={habit.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-700/30"
                      >
                        <div>
                          <span className="text-white text-sm">
                            {habit.title}
                          </span>
                          <span className="text-slate-500 text-xs ml-2">
                            {"⭐".repeat(habit.difficulty)}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {habit.effortMinutes}min
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700/50 p-4">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span>📊</span> Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {habits.filter((h) => h.isActive).length}
                  </div>
                  <div className="text-slate-400">Active Habits</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {season.unlockedFeatures.length}
                  </div>
                  <div className="text-slate-400">Features</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

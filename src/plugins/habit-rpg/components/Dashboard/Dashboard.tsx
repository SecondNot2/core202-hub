/**
 * Dashboard - Main RPG dashboard view
 * Features: Hero stats, Quests, Habit management, Real-time stats
 */

import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGameStore } from "../../store";
import { HeroPanel } from "../Character";
import { QuestList, HabitFormModal } from "../Quests";
import { GitHubWidget } from "./GitHubWidget";
import { useConfirm, useToast } from "@shared/components";
import type { Habit } from "../../domain/types";

export const Dashboard: React.FC = () => {
  const initializeGame = useGameStore((s) => s.initializeGame);
  const habits = useGameStore((s) => s.habits);
  const season = useGameStore((s) => s.season);
  const streak = useGameStore((s) => s.streak);
  const character = useGameStore((s) => s.character);
  const inventory = useGameStore((s) => s.inventory);
  const quests = useGameStore((s) => s.quests);
  const deleteHabit = useGameStore((s) => s.deleteHabit);
  const toggleHabit = useGameStore((s) => s.toggleHabit);

  const { confirm } = useConfirm();
  const { toast } = useToast();

  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowHabitForm(true);
    setActiveMenuId(null);
  };

  const handleAddHabit = () => {
    setEditingHabit(null);
    setShowHabitForm(true);
  };

  // Calculate today's quests stats
  const today = new Date().toISOString().split("T")[0];
  const todayQuests = quests.filter((q) => q.date === today);
  const completedToday = todayQuests.filter(
    (q) => q.status === "completed"
  ).length;

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleDeleteHabit = async (habit: Habit) => {
    setActiveMenuId(null);
    const confirmed = await confirm({
      title: "Delete Habit?",
      message: `Are you sure you want to delete "${habit.title}"? This cannot be undone.`,
      variant: "danger",
      confirmText: "Delete",
      cancelText: "Keep",
    });

    if (confirmed) {
      deleteHabit(habit.id);
      toast.info(`"${habit.title}" has been deleted`);
    }
  };

  const handleToggleHabit = (habit: Habit) => {
    toggleHabit(habit.id);
    setActiveMenuId(null);
    toast.info(
      habit.isActive ? `"${habit.title}" paused` : `"${habit.title}" activated`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 dark:from-slate-950 dark:via-purple-950/30 dark:to-slate-950 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-3xl">🎮</span> Gamified Habits
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Level {character.level} • Season {season.seasonNumber}
            </p>
          </div>

          <button
            onClick={handleAddHabit}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium transition-all hover:scale-105 shadow-lg shadow-purple-500/25 flex items-center gap-2"
          >
            <span className="text-lg">+</span> Add Habit
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon="🔥"
            label="Streak"
            value={`${streak.currentStreak} days`}
            color="from-orange-500 to-red-500"
          />
          <StatCard
            icon="⚡"
            label="Energy"
            value={`${character.energy}/${character.maxEnergy}`}
            color="from-yellow-500 to-amber-500"
          />
          <StatCard
            icon="💰"
            label="Gold"
            value={inventory.gold.toString()}
            color="from-amber-400 to-yellow-500"
          />
          <StatCard
            icon="✅"
            label="Today"
            value={`${completedToday}/${todayQuests.length}`}
            color="from-green-500 to-emerald-500"
          />
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
            {/* Habit List Management */}
            <div className="bg-white/80 dark:bg-slate-800/30 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700/50 p-4 shadow-sm transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>📝</span> Your Habits
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-500">
                  {habits.filter((h) => h.isActive).length} active
                </span>
              </div>

              {habits.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">
                  No habits yet.{" "}
                  <button
                    onClick={handleAddHabit}
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 font-medium"
                  >
                    Create one!
                  </button>
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      className={`
                        flex items-center justify-between p-3 rounded-lg transition-all
                        ${
                          habit.isActive
                            ? "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/30 dark:hover:bg-slate-700/50"
                            : "bg-slate-100/50 dark:bg-slate-700/10 opacity-60"
                        }
                      `}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium truncate ${
                              habit.isActive
                                ? "text-slate-800 dark:text-white"
                                : "text-slate-500 dark:text-slate-400 line-through"
                            }`}
                          >
                            {habit.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span>{"⭐".repeat(habit.difficulty)}</span>
                          <span>•</span>
                          <span>{habit.effortMinutes}min</span>
                        </div>
                      </div>

                      {/* Actions using 3-dot menu */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(
                              activeMenuId === habit.id ? null : habit.id
                            );
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        >
                          ⋮
                        </button>

                        {activeMenuId === habit.id && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 top-full mt-1 w-32 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                          >
                            <button
                              onClick={() => handleEditHabit(habit)}
                              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleToggleHabit(habit)}
                              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                            >
                              {habit.isActive ? "⏸️ Pause" : "▶️ Resume"}
                            </button>
                            <div className="h-px bg-slate-700 my-0.5" />
                            <button
                              onClick={() => handleDeleteHabit(habit)}
                              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 flex items-center gap-2"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* GitHub Activity */}
            <GitHubWidget />

            {/* Quick Links */}
            <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700/50 p-4">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span>🚀</span> Quick Access
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <QuickLink to="/rpg/character" icon="👤" label="Character" />
                <QuickLink to="/rpg/skills" icon="✨" label="Talent Tree" />
                <QuickLink to="/rpg/boss" icon="👹" label="Boss" />
                <QuickLink to="/rpg/crafting" icon="⚗️" label="Crafting" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Habit Form Modal */}
      <HabitFormModal
        isOpen={showHabitForm}
        onClose={() => setShowHabitForm(false)}
        editHabit={editingHabit}
      />
    </div>
  );
};

// ============================================================================
// Sub-components
// ============================================================================

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className="bg-white/80 dark:bg-slate-800/30 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700/50 p-3 shadow-sm transition-all duration-300">
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-lg shadow-lg text-white`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-lg font-bold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  </div>
);

interface QuickLinkProps {
  to: string;
  icon: string;
  label: string;
}

const QuickLink: React.FC<QuickLinkProps> = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/30 dark:hover:bg-slate-700/50 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all text-sm"
  >
    <span>{icon}</span>
    <span>{label}</span>
  </Link>
);

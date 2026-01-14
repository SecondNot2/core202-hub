/**
 * HabitForm - Create/Edit habit form
 */

import React, { useState } from "react";
import { useGameStore } from "../../store";
import type { HabitCategory, HabitWindow, StatKey } from "../../domain/types";

interface HabitFormProps {
  onClose?: () => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({ onClose }) => {
  const addHabit = useGameStore((s) => s.addHabit);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<HabitCategory>("ritual");
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [effortMinutes, setEffortMinutes] = useState(15);
  const [window, setWindow] = useState<HabitWindow>("anytime");
  const [statAffinity, setStatAffinity] = useState<StatKey>("STR");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addHabit({
      title: title.trim(),
      category,
      difficulty,
      effortMinutes,
      window,
      proofMode: "none",
      statAffinity,
    });

    setTitle("");
    onClose?.();
  };

  const categoryOptions: {
    value: HabitCategory;
    label: string;
    icon: string;
  }[] = [
    { value: "ritual", label: "Ritual", icon: "🕯️" },
    { value: "practice", label: "Practice", icon: "🎯" },
    { value: "project", label: "Project", icon: "🚀" },
    { value: "recovery", label: "Recovery", icon: "🧘" },
  ];

  const windowOptions: { value: HabitWindow; label: string }[] = [
    { value: "anytime", label: "Anytime" },
    { value: "morning", label: "Morning" },
    { value: "afternoon", label: "Afternoon" },
    { value: "evening", label: "Evening" },
  ];

  const statOptions: { value: StatKey; label: string; color: string }[] = [
    { value: "STR", label: "Strength", color: "text-red-400" },
    { value: "INT", label: "Intelligence", color: "text-blue-400" },
    { value: "DEX", label: "Dexterity", color: "text-green-400" },
    { value: "WIS", label: "Wisdom", color: "text-purple-400" },
    { value: "VIT", label: "Vitality", color: "text-orange-400" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-5"
    >
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>✨</span> Add New Habit
      </h3>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm text-slate-400 mb-1.5">
          Habit Name
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Morning meditation"
          className="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block text-sm text-slate-400 mb-1.5">Category</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {categoryOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setCategory(opt.value)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                category === opt.value
                  ? "bg-purple-600 border-purple-500 text-white"
                  : "bg-slate-700/50 border-slate-600 text-slate-300 hover:border-purple-500/50"
              }`}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty & Effort */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">
            Difficulty (1-5)
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d as 1 | 2 | 3 | 4 | 5)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                  difficulty === d
                    ? "bg-yellow-600 border-yellow-500 text-white"
                    : "bg-slate-700/50 border-slate-600 text-slate-400 hover:border-yellow-500/50"
                }`}
              >
                {"⭐".repeat(d)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1.5">
            Effort (minutes)
          </label>
          <input
            type="number"
            value={effortMinutes}
            onChange={(e) =>
              setEffortMinutes(Math.max(5, parseInt(e.target.value) || 5))
            }
            min={5}
            max={180}
            className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Window & Stat */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">
            Time Window
          </label>
          <select
            value={window}
            onChange={(e) => setWindow(e.target.value as HabitWindow)}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {windowOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1.5">
            Stat Affinity
          </label>
          <select
            value={statAffinity}
            onChange={(e) => setStatAffinity(e.target.value as StatKey)}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {statOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold transition-all"
        >
          Add Habit
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

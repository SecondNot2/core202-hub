/**
 * HabitForm - Create/Edit habit form (Modal-based)
 * Redesigned with 2-column layout and styled Select components
 */

import React, { useState, useEffect } from "react";
import { useGameStore } from "../../store";
import { Modal, Select, useToast } from "@shared/components";
import type { SelectOption } from "@shared/components";
import type {
  Habit,
  HabitCategory,
  HabitWindow,
  StatKey,
} from "../../domain/types";

// ============================================================================
// Props
// ============================================================================

interface HabitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editHabit?: Habit | null;
}

// ============================================================================
// Options Configuration
// ============================================================================

const categoryOptions: {
  value: HabitCategory;
  label: string;
  icon: string;
  color: string;
}[] = [
  { value: "ritual", label: "Ritual", icon: "🕯️", color: "purple" },
  { value: "practice", label: "Practice", icon: "🎯", color: "blue" },
  { value: "project", label: "Project", icon: "🚀", color: "green" },
  { value: "recovery", label: "Recovery", icon: "🧘", color: "amber" },
];

const windowOptions: SelectOption<HabitWindow>[] = [
  { value: "anytime", label: "Anytime", icon: "🕐" },
  { value: "morning", label: "Morning", icon: "🌅" },
  { value: "afternoon", label: "Afternoon", icon: "☀️" },
  { value: "evening", label: "Evening", icon: "🌙" },
];

const statOptions: SelectOption<StatKey>[] = [
  { value: "STR", label: "Strength", icon: "💪" },
  { value: "INT", label: "Intelligence", icon: "🧠" },
  { value: "DEX", label: "Dexterity", icon: "⚡" },
  { value: "WIS", label: "Wisdom", icon: "🔮" },
  { value: "VIT", label: "Vitality", icon: "❤️" },
];

const effortOptions: SelectOption<number>[] = [
  { value: 5, label: "5 min", icon: "⏱️" },
  { value: 10, label: "10 min", icon: "⏱️" },
  { value: 15, label: "15 min", icon: "⏱️" },
  { value: 30, label: "30 min", icon: "⏱️" },
  { value: 45, label: "45 min", icon: "⏱️" },
  { value: 60, label: "1 hour", icon: "⏱️" },
  { value: 90, label: "1.5 hours", icon: "⏱️" },
  { value: 120, label: "2 hours", icon: "⏱️" },
];

// ============================================================================
// Component
// ============================================================================

export const HabitFormModal: React.FC<HabitFormModalProps> = ({
  isOpen,
  onClose,
  editHabit,
}) => {
  const addHabit = useGameStore((s) => s.addHabit);
  const updateHabit = useGameStore((s) => s.updateHabit);
  const { toast } = useToast();

  // Form state
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<HabitCategory>("ritual");
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [effortMinutes, setEffortMinutes] = useState(15);
  const [window, setWindow] = useState<HabitWindow>("anytime");
  const [statAffinity, setStatAffinity] = useState<StatKey>("STR");

  useEffect(() => {
    if (editHabit && isOpen) {
      setTitle(editHabit.title);
      setDescription(editHabit.description || "");
      setCategory(editHabit.category);
      setDifficulty(editHabit.difficulty as 1 | 2 | 3 | 4 | 5);
      setEffortMinutes(editHabit.effortMinutes);
      setWindow(editHabit.window);
      setStatAffinity(editHabit.statAffinity);
    } else if (isOpen) {
      resetForm();
    }
  }, [editHabit, isOpen]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("ritual");
    setDifficulty(2);
    setEffortMinutes(15);
    setWindow("anytime");
    setStatAffinity("STR");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a habit name");
      return;
    }

    if (editHabit) {
      updateHabit(editHabit.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        difficulty,
        effortMinutes,
        window,
        statAffinity,
      });
      toast.info(`"${title}" has been updated`);
    } else {
      addHabit({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        difficulty,
        effortMinutes,
        window,
        proofMode: "none",
        statAffinity,
      });
      toast.success(`"${title}" has been added to your habits!`);
    }

    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editHabit ? "✏️ Edit Habit" : "✨ Create New Habit"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Title (full width) */}
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">
            Habit Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Morning meditation, Read 20 pages..."
            className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            autoFocus
          />
        </div>

        {/* Row 2: Description (full width) */}
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">
            Description <span className="text-slate-600">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why is this habit important to you?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Row 3: Category Selection */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categoryOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCategory(opt.value)}
                className={`
                  px-4 py-3 rounded-xl border text-sm font-medium transition-all
                  flex flex-col items-center gap-1
                  ${
                    category === opt.value
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600 border-purple-500 text-white shadow-lg shadow-purple-500/25 scale-105"
                      : "bg-slate-700/50 border-slate-600 text-slate-300 hover:border-purple-500/50 hover:bg-slate-700"
                  }
                `}
              >
                <span className="text-xl">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: 2-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Difficulty */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Difficulty
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d as 1 | 2 | 3 | 4 | 5)}
                  className={`
                    flex-1 py-3 rounded-xl border text-lg font-medium transition-all
                    ${
                      difficulty >= d
                        ? "bg-gradient-to-br from-amber-500 to-orange-500 border-amber-500 text-white shadow-lg shadow-amber-500/25"
                        : "bg-slate-700/50 border-slate-600 text-slate-500 hover:border-amber-500/50"
                    }
                  `}
                  title={`Difficulty ${d}`}
                >
                  ⭐
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1 text-center">
              {difficulty === 1 && "Very Easy"}
              {difficulty === 2 && "Easy"}
              {difficulty === 3 && "Medium"}
              {difficulty === 4 && "Hard"}
              {difficulty === 5 && "Very Hard"}
            </p>
          </div>

          {/* Effort */}
          <Select
            label="Effort Required"
            options={effortOptions}
            value={effortMinutes}
            onChange={setEffortMinutes}
          />
        </div>

        {/* Row 5: 2-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Time Window */}
          <Select
            label="Time Window"
            options={windowOptions}
            value={window}
            onChange={setWindow}
          />

          {/* Stat Affinity */}
          <Select
            label="Stat Affinity"
            options={statOptions}
            value={statAffinity}
            onChange={setStatAffinity}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-700/50">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium transition-all hover:scale-[1.02]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/25"
          >
            {editHabit ? "Save Changes" : "✨ Create Habit"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Legacy export for backward compatibility
export const HabitForm = HabitFormModal;

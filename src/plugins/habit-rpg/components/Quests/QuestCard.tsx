/**
 * QuestCard - Individual quest display with completion action
 */

import React from "react";
import type { QuestInstance } from "../../domain/types";

interface QuestCardProps {
  quest: QuestInstance;
  onComplete: (questId: string) => void;
  onSkip: (questId: string) => void;
  onUseGrace: (questId: string) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onComplete,
  onSkip,
  onUseGrace: _onUseGrace,
}) => {
  const isCompleted = quest.status === "completed";
  const isSkipped = quest.status === "skipped";
  const isGrace = quest.status === "grace";
  const isPending = quest.status === "pending";

  const difficultyStars = "⭐".repeat(quest.difficulty);

  const statusColors = {
    pending:
      "border-slate-200 bg-white/50 hover:bg-white/80 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:bg-slate-800/80",
    completed:
      "border-green-200 bg-green-50/50 dark:border-green-500/50 dark:bg-green-900/20",
    skipped:
      "border-red-200 bg-red-50/50 dark:border-red-500/30 dark:bg-red-900/10",
    grace:
      "border-yellow-200 bg-yellow-50/50 dark:border-yellow-500/30 dark:bg-yellow-900/10",
  };

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        statusColors[quest.status]
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox / Status */}
        <button
          onClick={() => isPending && onComplete(quest.id)}
          disabled={!isPending}
          className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            isCompleted
              ? "bg-green-500 border-green-500 text-white"
              : isSkipped
              ? "bg-red-500/50 border-red-500/50 text-white"
              : isGrace
              ? "bg-yellow-500/50 border-yellow-500/50 text-white"
              : "border-slate-300 hover:border-purple-500 dark:border-slate-500 dark:hover:border-purple-400 bg-white dark:bg-transparent hover:bg-purple-50 dark:hover:bg-purple-500/10"
          }`}
        >
          {isCompleted && "✓"}
          {isSkipped && "✗"}
          {isGrace && "⏸"}
        </button>

        {/* Quest Info */}
        <div className="flex-1 min-w-0">
          <h4
            className={`font-medium ${
              isCompleted || isSkipped
                ? "line-through text-slate-500 dark:text-slate-500"
                : "text-slate-900 dark:text-white"
            }`}
          >
            {quest.habitTitle}
          </h4>

          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
            <span className="text-amber-500 dark:text-yellow-400">
              {difficultyStars}
            </span>
            <span className="text-slate-400 dark:text-slate-400">•</span>
            <span className="text-slate-500 dark:text-slate-400">
              {quest.effortMinutes} min
            </span>
            <span className="text-slate-400 dark:text-slate-400">•</span>
            <span className="text-green-600 dark:text-green-400 font-medium">
              +{quest.xpReward} XP
            </span>
            <span className="text-amber-600 dark:text-yellow-400 font-medium">
              +{quest.goldReward} 💰
            </span>
          </div>
        </div>

        {/* Actions */}
        {isPending && (
          <div className="flex gap-1">
            <button
              onClick={() => onComplete(quest.id)}
              className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors shadow-sm"
            >
              Complete
            </button>
            <button
              onClick={() => onSkip(quest.id)}
              className="px-2 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white text-sm transition-colors"
              title="Skip quest"
            >
              ✗
            </button>
          </div>
        )}

        {isCompleted && (
          <div className="text-green-600 dark:text-green-400 text-sm font-medium">
            +{quest.xpReward} XP
          </div>
        )}
      </div>
    </div>
  );
};

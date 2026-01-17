/**
 * QuestList - Today's quests panel with ConfirmDialog and Toast
 */

import React from "react";
import { useGameStore } from "../../store";
import { QuestCard } from "./QuestCard";
import { getGameDate } from "../../domain/rules";
import { useConfirm, useToast } from "@shared/components";

export const QuestList: React.FC = () => {
  const quests = useGameStore((s) => s.quests);
  const settings = useGameStore((s) => s.settings);
  const completeQuest = useGameStore((s) => s.completeQuest);
  const skipQuest = useGameStore((s) => s.skipQuest);
  const useGraceToken = useGameStore((s) => s.useGraceToken);
  const character = useGameStore((s) => s.character);

  const { confirm } = useConfirm();
  const { toast } = useToast();

  const today = getGameDate(settings.timezone, settings.dayBoundaryHour);
  const todayQuests = quests.filter((q) => q.date === today);

  const pendingQuests = todayQuests.filter((q) => q.status === "pending");
  const completedQuests = todayQuests.filter((q) => q.status === "completed");
  const otherQuests = todayQuests.filter(
    (q) => q.status === "skipped" || q.status === "grace",
  );

  const completionPercent =
    todayQuests.length > 0
      ? Math.round((completedQuests.length / todayQuests.length) * 100)
      : 0;

  const handleComplete = async (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    // Check energy first
    const energyCost = Math.ceil(quest.effortMinutes / 4);
    if (character.energy < energyCost) {
      toast.error(`Not enough energy! Need ${energyCost}⚡`);
      return;
    }

    const confirmed = await confirm({
      title: "Complete Quest?",
      message: `You'll earn +${quest.xpReward} XP and +${quest.goldReward} Gold for completing "${quest.habitTitle}"`,
      variant: "info",
      confirmText: "Complete ✓",
      cancelText: "Not yet",
    });

    if (confirmed) {
      completeQuest(questId);
      toast.success(`🎉 Quest completed! +${quest.xpReward} XP`);
    }
  };

  const handleSkip = async (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    const confirmed = await confirm({
      title: "Skip Quest?",
      message: `Are you sure you want to skip "${quest.habitTitle}"? This may affect your streak.`,
      variant: "warning",
      confirmText: "Skip",
      cancelText: "Keep",
    });

    if (confirmed) {
      skipQuest(questId);
      toast.info("Quest skipped");
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-2xl">📋</span> Today's Quests
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {completedQuests.length} / {todayQuests.length} completed
          </p>
        </div>

        {/* Progress Ring */}
        <div className="relative w-14 h-14">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-slate-200 dark:text-slate-700"
            />
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${completionPercent * 1.51} 151`}
              className="text-green-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-slate-800 dark:text-white font-bold text-sm">
            {completionPercent}%
          </div>
        </div>
      </div>

      {/* Quest List */}
      <div className="space-y-3">
        {todayQuests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">No quests for today.</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Add habits to generate daily quests!
            </p>
          </div>
        ) : (
          <>
            {/* Pending */}
            {pendingQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onComplete={handleComplete}
                onSkip={handleSkip}
                onUseGrace={useGraceToken}
              />
            ))}

            {/* Completed */}
            {completedQuests.length > 0 && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700/50 space-y-3">
                <p className="text-sm text-slate-500 mb-2">Completed</p>
                {completedQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onComplete={handleComplete}
                    onSkip={handleSkip}
                    onUseGrace={useGraceToken}
                  />
                ))}
              </div>
            )}

            {/* Skipped/Grace */}
            {otherQuests.length > 0 && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700/50 space-y-3">
                <p className="text-sm text-slate-500 mb-2">Skipped / Grace</p>
                {otherQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onComplete={handleComplete}
                    onSkip={handleSkip}
                    onUseGrace={useGraceToken}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/**
 * SkillBranch - Vertical column of skill nodes for one branch
 */

import React from "react";
import type {
  SkillNode as SkillNodeType,
  SkillBranch as SkillBranchType,
} from "../../domain/types";
import { SkillNode } from "./SkillNode";

interface SkillBranchProps {
  branch: SkillBranchType;
  title: string;
  icon: string;
  nodes: SkillNodeType[];
  unlockedIds: string[];
  playerLevel: number;
  currentShards: number;
  onUnlock: (nodeId: string) => void;
}

export const SkillBranch: React.FC<SkillBranchProps> = ({
  branch,
  title,
  icon,
  nodes,
  unlockedIds,
  playerLevel,
  currentShards,
  onUnlock,
}) => {
  // Sort nodes by tier
  const sortedNodes = [...nodes].sort((a, b) => a.tier - b.tier);

  // Check if prerequisites are met
  const arePrerequisitesMet = (node: SkillNodeType): boolean => {
    if (node.prerequisiteIds.length === 0) return true;
    return node.prerequisiteIds.every((id) => unlockedIds.includes(id));
  };

  // Branch header colors
  const headerColors = {
    discipline: "from-amber-600 to-yellow-700 border-amber-500",
    focus: "from-blue-600 to-indigo-700 border-blue-500",
    resilience: "from-emerald-600 to-green-700 border-emerald-500",
  };

  return (
    <div className="flex flex-col">
      {/* Branch Header */}
      <div
        className={`bg-gradient-to-r ${headerColors[branch]} rounded-t-xl p-4 border-b-2`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-sm text-white/70">
              {
                unlockedIds.filter((id) => nodes.some((n) => n.id === id))
                  .length
              }
              /{nodes.length} unlocked
            </p>
          </div>
        </div>
      </div>

      {/* Nodes */}
      <div className="bg-slate-100 dark:bg-slate-800/30 rounded-b-xl p-4 space-y-4 flex-1 border-x border-b border-slate-200 dark:border-slate-700/50">
        {sortedNodes.map((node) => {
          const isUnlocked = unlockedIds.includes(node.id);
          const isLevelLocked = playerLevel < node.levelUnlock;
          const prereqsMet = arePrerequisitesMet(node);
          const isAvailable = !isUnlocked && prereqsMet && !isLevelLocked;

          return (
            <SkillNode
              key={node.id}
              node={node}
              isUnlocked={isUnlocked}
              isAvailable={isAvailable}
              isLevelLocked={isLevelLocked}
              currentShards={currentShards}
              onUnlock={onUnlock}
            />
          );
        })}
      </div>
    </div>
  );
};

/**
 * SkillTreeView - Main skill tree with 3 branches
 */

import React from "react";
import { useGameStore } from "../../store";
import { SKILL_NODES } from "../../domain/constants";
import { SkillBranch } from "./SkillBranch";

export const SkillTreeView: React.FC = () => {
  const unlockedIds = useGameStore((s) => s.skillTree.unlockedSkillIds);
  const currentShards = useGameStore((s) => s.inventory.essenceShards);
  const currentWeek = useGameStore((s) => s.season.currentWeek);
  const unlockSkill = useGameStore((s) => s.unlockSkill);

  // Group nodes by branch
  const disciplineNodes = SKILL_NODES.filter((n) => n.branch === "discipline");
  const focusNodes = SKILL_NODES.filter((n) => n.branch === "focus");
  const resilienceNodes = SKILL_NODES.filter((n) => n.branch === "resilience");

  const handleUnlock = (nodeId: string) => {
    const node = SKILL_NODES.find((n) => n.id === nodeId);
    if (!node) return;

    // Check if can afford
    if (currentShards < node.cost) {
      console.log("Not enough shards");
      return;
    }

    // Deduct shards and unlock
    useGameStore.getState().earnShards(-node.cost);
    unlockSkill(nodeId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <SkillBranch
        branch="discipline"
        title="Discipline"
        icon="🏛️"
        nodes={disciplineNodes}
        unlockedIds={unlockedIds}
        currentWeek={currentWeek}
        currentShards={currentShards}
        onUnlock={handleUnlock}
      />
      <SkillBranch
        branch="focus"
        title="Focus"
        icon="🎯"
        nodes={focusNodes}
        unlockedIds={unlockedIds}
        currentWeek={currentWeek}
        currentShards={currentShards}
        onUnlock={handleUnlock}
      />
      <SkillBranch
        branch="resilience"
        title="Resilience"
        icon="🛡️"
        nodes={resilienceNodes}
        unlockedIds={unlockedIds}
        currentWeek={currentWeek}
        currentShards={currentShards}
        onUnlock={handleUnlock}
      />
    </div>
  );
};

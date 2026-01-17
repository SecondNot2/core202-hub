/**
 * SkillTreeView - Main skill tree with 3 branches
 */

import React from "react";
import { useGameStore } from "../../store";
import { SKILL_NODES } from "../../domain/constants";
import { SkillBranch } from "./SkillBranch";
import { useConfirm, useToast } from "@shared/components";

export const SkillTreeView: React.FC = () => {
  const unlockedIds = useGameStore((s) => s.skillTree.unlockedSkillIds);
  const currentShards = useGameStore((s) => s.inventory.essenceShards);
  const playerLevel = useGameStore((s) => s.character.level);

  const unlockSkill = useGameStore((s) => s.unlockSkill);
  const { confirm } = useConfirm();
  const { toast } = useToast();

  // Group nodes by branch
  const disciplineNodes = SKILL_NODES.filter((n) => n.branch === "discipline");
  const focusNodes = SKILL_NODES.filter((n) => n.branch === "focus");
  const resilienceNodes = SKILL_NODES.filter((n) => n.branch === "resilience");

  const handleUnlock = async (nodeId: string) => {
    const node = SKILL_NODES.find((n) => n.id === nodeId);
    if (!node) return;

    // Check if can afford
    if (currentShards < node.cost) {
      toast.error(
        `Insufficient Essence: You need ${node.cost} Essence Shards to unlock this talent.`,
      );
      return;
    }

    const confirmed = await confirm({
      title: "Unlock Talent",
      message: `Spend ${node.cost} Essence Shards to unlock "${node.name}"?`,
      confirmText: "Unlock",
      cancelText: "Cancel",
    });

    if (confirmed) {
      // Deduct shards and unlock
      useGameStore.getState().earnShards(-node.cost);
      unlockSkill(nodeId);

      const newBalance = useGameStore.getState().inventory.essenceShards;

      toast.success(
        `Learned "${node.name}" (-${node.cost} Essence). Remaining: ${newBalance} Essence.`,
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <SkillBranch
        branch="discipline"
        title="Discipline"
        icon="🏛️"
        nodes={disciplineNodes}
        unlockedIds={unlockedIds}
        playerLevel={playerLevel}
        currentShards={currentShards}
        onUnlock={handleUnlock}
      />
      <SkillBranch
        branch="focus"
        title="Focus"
        icon="🎯"
        nodes={focusNodes}
        unlockedIds={unlockedIds}
        playerLevel={playerLevel}
        currentShards={currentShards}
        onUnlock={handleUnlock}
      />
      <SkillBranch
        branch="resilience"
        title="Resilience"
        icon="🛡️"
        nodes={resilienceNodes}
        unlockedIds={unlockedIds}
        playerLevel={playerLevel}
        currentShards={currentShards}
        onUnlock={handleUnlock}
      />
    </div>
  );
};

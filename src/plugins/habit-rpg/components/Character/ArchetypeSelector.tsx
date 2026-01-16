/**
 * ArchetypeSelector - Grid of 4 archetype cards
 */

import React from "react";
import { useGameStore } from "../../store";
import { ARCHETYPES } from "../../domain/constants";
import { ArchetypeCard } from "./ArchetypeCard";
import type { ArchetypeId } from "../../domain/types";

export const ArchetypeSelector: React.FC = () => {
  const currentArchetype = useGameStore((s) => s.character.archetypeId);
  const playerLevel = useGameStore((s) => s.character.level);
  const setArchetype = useGameStore((s) => s.setArchetype);

  const isUnlocked = playerLevel >= 5;
  const archetypes = Object.values(ARCHETYPES);

  const handleSelect = (id: string) => {
    if (currentArchetype) {
      // Already selected, can't change (or add confirmation modal later)
      return;
    }
    setArchetype(id as ArchetypeId);
  };

  return (
    <div>
      {/* Level Lock Warning */}
      {!isUnlocked && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <span className="text-amber-300">
            🔒 Archetypes unlock at Level 5. You're currently Level{" "}
            {playerLevel}.
          </span>
        </div>
      )}

      {/* Already Selected */}
      {currentArchetype && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <span className="text-green-300">
            ✓ You've chosen the{" "}
            <strong className="capitalize">{currentArchetype}</strong> path.
            This cannot be changed.
          </span>
        </div>
      )}

      {/* Archetype Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {archetypes.map((archetype) => (
          <ArchetypeCard
            key={archetype.id}
            archetype={archetype}
            isSelected={currentArchetype === archetype.id}
            isLocked={
              !isUnlocked ||
              (currentArchetype !== null && currentArchetype !== archetype.id)
            }
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
};

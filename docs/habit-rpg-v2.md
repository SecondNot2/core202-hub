# Architecture: Habit RPG v2

## System Overview

The RPG system is decoupled from the UI to ensure deterministic game logic and easy testing.

1. **Domain Layer (`domain/`)**: Pure functions for XP calculation, level curves, and stat growth. No side effects.
2. **Systems Layer (`systems/`)**: Stateful logic for complex interactions like the `Scheduler` (reset logic) and `Boss` generation.
3. **Store Layer (`store/`)**: Unified Zustand store that orchestrates systems and provides state to React.
4. **Persistence Layer (`persistence/`)**: Handles versioned storage with migration support to prevent data loss during updates.

## Key Logic Decisions

- **Deterministic Resets**: The scheduler calculates resets based on `lastLoginDate` and `currentDate` rather than simple timers, making it reliable across sessions.
- **Effort-Based XP**: XP rewards use a logarithmic multiplier for effort minutes (`1 + ln(min/10) * 0.6`), ensuring longer tasks are rewarded fairly but not excessively.
- **Stat Affinity**: Each habit aligns with a specific stat (e.g., Meditation -> WIS), driving character growth based on actual behavior.

## Advanced Subsystems

### ⚡ Skill Tree (Discipline, Focus, Resilience)

- **Tiered Progress**: 18 unique nodes across 4 tiers.
- **Week-Gated**: High-tier skills (T3, T4) are locked behind season progression (Weeks 6 and 9).
- **Hard Prerequisites**: Skills require parent nodes to be unlocked first.
- **Currency**: Uses **Essence Shards** (💎) earned exclusively from defeating bosses.

### ⚔️ Boss Encounter

- **Performance-Based Generation**: Bosses are selected based on the user's missed quests and weaknesses.
- **Damage Mechanics**: Passive damage dealt by completing daily quests. Quests matching the boss's **weakness** deal bonus damage.
- **HP Scaling**: Boss health scales with player level and weekly performance.

### 🎭 Archetypes & Stats

- **Permanent Selection (Week 3)**: Choice of Builder, Scholar, Athlete, or Creator.
- **Specialization**: Each archetype grants a primary (+20%) and secondary (+10%) growth bonus to corresponding stats.
- **Unified Stat Block**: STR, INT, DEX, WIS, VIT directly influence game mechanics (e.g., higher VIT increases max energy).

### ⚗️ Crafting (Week 6)

- **Gold Sink Economy**: Converts gold earned from habits into survival items.
- **Survival Items**: Grace Tokens (streak shield), Energy Potions (+25 energy), and Morale Boosts (+15 morale).

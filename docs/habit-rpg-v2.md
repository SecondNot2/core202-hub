# Architecture: Habit RPG v2

## System Overview

The RPG system is decoupled from the UI to ensure deterministic game logic and easy testing.

1. **Domain Layer (`domain/`)**: Pure functions for XP calculation, level curves, and stat growth. No side effects.
2. **Systems Layer (`systems/`)**: Stateful logic for complex interactions like the `Scheduler` (reset logic) and `Boss` generation.
3. **Store Layer (`store/`)**: Unified Zustand store that orchestrates systems and provides state to React.
4. **Persistence Layer (`persistence/`)**: Handles versioned storage with migration support to prevent data loss during updates.

## Key Logic Decisions

- **Level-Gated Progression**: Features unlock based on character level, rewarding active engagement rather than time waited.
- **Effort-Based XP**: XP rewards use a logarithmic multiplier for effort minutes (`1 + ln(min/10) * 0.6`), ensuring longer tasks are rewarded fairly but not excessively.
- **Attribute Affinity**: Each quest aligns with a specific attribute (e.g., Meditation -> WIS), driving character growth based on actual behavior.

## Advanced Subsystems

### ⚡ Talent Tree (Discipline, Focus, Resilience)

- **Tiered Progress**: 18 unique nodes across 4 tiers.
- **Level-Gated**: High-tier talents are locked behind player level (Level 10 and 20).
- **Hard Prerequisites**: Talents require parent nodes to be unlocked first.
- **Currency**: Uses **Essence** (💎) earned exclusively from defeating bosses.

### ⚔️ Boss Encounter

- **Performance-Based Generation**: Bosses are selected based on the user's missed quests and weaknesses.
- **Damage Mechanics**: Passive damage dealt by completing daily quests. Quests matching the boss's **weakness** deal bonus damage.
- **HP Scaling**: Boss health scales with player level and weekly performance.

### 🎭 Archetypes & Attributes

- **Permanent Selection (Level 10)**: Choice of Builder, Scholar, Athlete, or Creator.
- **Specialization**: Each archetype grants a primary (+20%) and secondary (+10%) growth bonus to corresponding attributes.
- **Unified Attribute Block**: STR, INT, DEX, WIS, VIT directly influence game mechanics.

### ⚗️ Crafting (Level 15)

- **Gold Sink Economy**: Converts Gold earned from quests into survival items.
- **Survival Items**: Grace Tokens (streak shield), Energy Potions (+25 energy), and Morale Boosts (+15 morale).

### 🎨 Theming System (Protocol 2)

- **Responsive Palette**: Uses Tailwind's `dark:` variant and highly curated responsive gradients (`slate-50` light / `slate-950` dark).
- **Glassmorphism Consistency**: Maintained readable "glass" effects (`bg-white/80` light / `bg-slate-800/30` dark) across all pages.

### 🌐 External Integration

- **GitHub Service**: Dedicated service layer to fetch and process GitHub contribution data.
- **Real-time Analytics**: Tracks commit patterns (Active hours/days) to drive periodic game events.

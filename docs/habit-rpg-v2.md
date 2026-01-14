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

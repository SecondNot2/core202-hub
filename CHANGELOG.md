# CHANGELOG

## [v2.2.0] - 2026-01-16

### Added

- **Cloud Synchronization**: Implemented offline-first data sync with Supabase.
  - Automatic debounced (2s) background saving for character stats and general state.
  - Initial cloud state hydration on login with local merge logic.
  - Manual habit deletion sync.
- **Hero's Handbook**: New in-app bilingual (VI/EN) documentation page (`/rpg/guide`).
  - 9 detailed sections covering game mechanics, resources, and progression.
  - Smooth expand/collapse animations and language toggle.
- **Database Schema**: New `rpg_snapshots` table and updated policies for multi-device support.

### Changed

- **Architecture**: Migrated from local-only storage to a hybrid Cloud/Local persistence model.

### Fixed

- **Supabase Typing**: Resolved TypeScript errors related to `__InternalSupabase` in generated types.

## [2026-01-16]

### Added

- **GitHub Integration**: New `GitHubWidget` on Dashboard with real-time stats and contribution calendar.
- **Extended Analytics**: Active hour heatmaps and recent commit history.
- **Light Mode Redesign**: Comprehensive support for Light Mode across all RPG pages (Dashboard, Character, Skill Tree, Boss, Crafting).

### Fixed

- **Build Errors**: Resolved multiple syntax issues related to duplicate return statements in `Dashboard.tsx`, `HeroPanel.tsx`, `CraftingPanel.tsx`, and `NoBoss.tsx`.
- **UI Consistency**: Fixed hardcoded dark styles that were breaking visibility in light mode.

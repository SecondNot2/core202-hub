# CHANGELOG

## [v2.3.0] - 2026-01-17

### Added

- **Headless RPG Items**: Transitioned from static files to a Supabase-driven system.
  - New `rpg_items` PostgreSQL table for dynamic stat and price balancing.
  - New `rpg-assets` storage bucket for icon hosting and delivery.
  - New `item.service.ts` with memory caching and static fallback protection.
  - Automated migration tool `migrate-rpg-assets.ts` for asset/DB seeding.
- **In-App Shop & Inventory**: Fully functional panels integrated with cloud sync.
  - Purchase equipment and consumables with Gold.
  - Durability, repair, and equipment management systems.

### Changed

- **Asset Management**: Removed 14MB of local images from the repository; now served via Supabase CDN.
- **Data Sync**: Updated `useSyncStore` with migration logic for existing inventory data.

### Fixed

- **Type Safety**: Resolved multiple TypeScript errors in `ShopPanel` and `InventoryPanel`.
- **Legacy Compatibility**: Added defensive checks for old character stats to prevent crashes during state migration.

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

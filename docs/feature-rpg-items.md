# RPG Items System (Headless Architecture)

## Overview

As of v2.1.0, the RPG Item system has transitioned from static definitions to a dynamic, database-driven architecture using Supabase. This allows for real-time item balancing and remote asset management without code redeployment.

## Data Structure

- **Table:** `rpg_items`
  - `id`: Unique identifier (e.g., `eq_graphite_pencil`)
  - `stats`: JSONB column for flexible attribute storage (STR, INT, etc.)
  - `icon_url`: Public CDN link to Supabase Storage
- **Storage:** `rpg-assets` bucket (Public)
  - Path: `/items/*.png`

## Logic Flow

1. **Preloading:** The `useItemsLoader` hook in `Dashboard.tsx` fetches all items on app initialization.
2. **Caching:** Fetched items are cached in `item.service.ts` memory to eliminate redundant DB hits.
3. **Fallback:** If Supabase is unreachable, the system falls back to static definitions in `domain/items.ts`.
4. **Synchronization:** Player inventory and shop states are synchronized via `useSyncStore`.

## Asset Management

Local assets have been removed from the repository. Assets are managed via the `rpg-assets` bucket. To migrate assets to a new environment, use `scripts/migrate-rpg-assets.ts`.

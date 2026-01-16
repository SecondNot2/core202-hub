# Architecture: Offline-First Cloud Sync

## Overview

The Habit RPG implements an **Offline-First** synchronization strategy. This ensures that the user experience is always snappy (0ms latency for UI updates) while maintaining data persistence across devices via Supabase.

## Data Flow

### 1. Local-First Mutate

When a user completes a quest or gains XP, the change is applied immediately to the **Zustand Store** and persisted to **LocalStorage**.

- **Latency**: ~0ms
- **Source of Truth (Runtime)**: Zustand Memory

### 2. Debounced Synchronize

The `useSyncStore` hook listens for changes in character and game stats. Instead of sending a request for every minor change (e.g., gaining 1XP), it uses a **2-second debounce timer**.

- **Trigger**: Stat changes (XP, Gold, Level, Energy).
- **Batching**: Multiple changes within 2s result in only one Supabase `UPSERT`.
- **Target Tables**: `rpg_characters`, `rpg_general_state`.

### 3. Hydration Logic

When the application starts or the user logs in:

1.  **Check Auth**: If `userId` exists.
2.  **Fetch Cloud**: Call `loadFromCloud`.
3.  **Conflict Resolution**:
    - If cloud data exists, it is merged into the store.
    - Local state is initialized with cloud values to ensure consistency.

## Database Schema Highlights

### `rpg_characters`

Primary table for hero stats. Linked via `user_id`.

- Auto-calculated fields: `total_xp_earned`.
- Stats stored as JSONB for flexibility.

### `rpg_snapshots`

Logs daily progress (Level, XP, Streak) at the end of each game day. Used to drive the analytics dashboard.

## Traceability (Protocol 8)

- Changes to synchronization logic must be tested against both "Logged In" and "Guest" (Anonymous) states.
- Error handling in `rpg-sync.service.ts` ensures that a failed network request does not revert or block the local UI state.

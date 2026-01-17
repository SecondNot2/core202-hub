# RPG UX & Persistence Architecture

## 1. Centralized Initialization (RPGLayout)

All background logic for the Habit RPG plugin (cloud sync, item loading) is centralized in `src/plugins/habit-rpg/components/Layout/RPGLayout.tsx`.

- **Why**: Prevents redundant network calls and inconsistent state hydration when navigating between RPG pages (Dashboard, Shop, etc.).
- **Logic**: It wraps all RPG routes defined in `routes.tsx`.

## 2. Reliable Cloud Hydration

The synchronization hook `useSyncStore.ts` uses a module-scoped variable `hasLoadedFromCloud` instead of a `useRef`.

- **Problem**: Component-level refs reset when the component unmounts (e.g., navigating from Dashboard to Shop). If `useSyncStore` re-mounts, it might fetch from the cloud again and overwrite the latest local state before it has a chance to auto-save.
- **Solution**: A module-scoped boolean ensures we only hydrate once per user session. It is reset to `false` only when the `userId` changes.

## 3. Persistent Purchase History

Gacha openings and Shop purchases are now recorded in `state.shop.purchaseHistory`.

- **Persistence**: This array is synced to the `rpg_general_state` table in Supabase.
- **Verification**: This allows the game to maintain a permanent record of what the user has obtained, even if local storage is cleared.

## 4. UX Action Security (Confirm & Toast)

Implementation of `@shared/components`' `useConfirm` and `useToast` hooks ensures:

- **Confirmation**: Users cannot accidentally spend Gold or Essence Shards.
- **Feedback**: Immediate, vibrant success/error notifications for all transactions.

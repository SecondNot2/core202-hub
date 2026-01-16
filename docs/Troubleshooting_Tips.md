# Troubleshooting Tips

## AI-Assisted Refactoring: The "Duplicate Block" Prevention

### Symptom

- `TS1005: '}' expected` or `Expression expected` errors at the end of files.
- Duplicate function declarations appearing in the same file.
- Logic being duplicated (e.g., `toast` declarations).

### Root Cause

When using AI tools like `replace_file_content` or `multi_replace_file_content` during rapid iteration, the model may:

1.  Copy part of the existing code into the `ReplacementContent` block without properly replacing the `TargetContent`.
2.  Fail to close a brace `}` in the replacement block, especially when cutting/pasting large sections.
3.  Mistakenly include context lines in the replacement content that already exist above/below the target range.

### Prevention Rule

- **Rule: Block Boundary Validation.** Before applying a `replace_file_content` call, count the number of opening `{` and closing `}` braces in the `ReplacementContent` to ensure they are balanced.
- **Rule: Unique Target Selection.** Ensure the `TargetContent` is unique enough that the replacement doesn't accidentally shift code structure.
- **Rule: Sequential Verification.** Run `npx tsc --noEmit` immediately after any multi-file refactoring or complex UI change to catch structural errors before they compound.

## AI-Assisted UI Refactoring: The "Duplicate Return" Trap

### Symptom

- `ror TS1109: Expression expected` or `declaration or statement expected` pointing at a `return (` line.
- The build fails but the code looks visually correct in the editor at first glance.

### Root Cause

When the AI attempts to replace a large component's JSX block, it sometimes mistakenly includes the `return (` line in the `ReplacementContent` while the `TargetContent` also starts at or after a `return (` line, leading to duplicate return statements.

### Prevention Rule

- **Rule: Multi-Line Wrapper Check.** Always check for duplicate keywords (`return`, `export`, `const`) if you see "Expression expected" errors after a large refactor.
- **Rule: Smaller Replacement Chunks.** Break down large UI updates into smaller chunks rather than replacing the entire component's return statement.

---

## Logic & State Management: The "Infinite Reward" Loop

### Symptom

- Stats (XP, Gold, Streaks) increase automatically every time the page is reloaded.
- "Quest Completed" notifications appear repeatedly for the same task.

### Root Cause

- **Lack of Idempotency:** The reward logic (e.g., `gainXp`) is triggered by a UI component or ephemeral event (like `todayCommits > 0`) without checking a persistent "completed" flag (e.g., `lastClaimedDate`).
- **UI vs Store Truth:** Relying on component state (`useState`) to track one-time events fails because component state resets on unmount/reload.

### Prevention Rule

- **Rule: Store-Level Idempotency.** Always implement a check (e.g., `if (lastClaimedDate === today) return`) inside the persistent store action (Zustand/Redux) before awarding resources. Never rely solely on the UI to gate rewards.
- **Rule: Audit "Auto-Run" Logic.** If a function runs automatically on mount (useEffect), ensure it is side-effect free or strictly idempotent.

---

---

## Infrastructure: Supabase Internal Type Conflicts

### Symptom

- TypeScript error: `Property '__InternalSupabase' is missing in type...` or `Type 'Database' is not assignable to...`
- Auto-generated helper types like `Tables<...>` fail to resolve table names correctly.

### Root Cause

- The auto-generated `supabase.ts` occasionally includes a `__InternalSupabase` key at the root of the `Database` type. Generic utility types that iterate over `keyof Database` to find schemas/tables get confused by this metadata key.

### Prevention Rule

- **Rule: Database Wrapper.** Always create a `DatabaseWithoutInternals` type that omits metadata keys before passing the database type to generic helpers.
- **Example Fix**:
  ```typescript
  type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
  export type Tables<T extends keyof DatabaseWithoutInternals['public']['Tables']> = ...
  ```

_Last updated: 2026-01-16_

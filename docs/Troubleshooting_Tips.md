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

---

_Last updated: 2026-01-15_

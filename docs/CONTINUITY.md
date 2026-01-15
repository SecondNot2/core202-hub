# Core202-Hub Continuity Ledger

> File này dùng để track trạng thái dự án giữa các phiên làm việc.  
> Cập nhật mỗi khi có thay đổi quan trọng.

---

## 📍 Current State

**Goal:** Xây dựng shell application cho personal tool hub với plugin architecture

**Success Criteria:**

- [x] Plugin system hoạt động (registration, loading, lifecycle)
- [x] Authentication với mock auth (ready for Supabase integration)
- [x] Route injection từ plugins
- [x] Shared state cho plugin communication
- [x] Tạo plugin đầu tiên (Habit RPG v2)
- [x] Triển khai Skill Tree, Boss, Archetype, Crafting systems
- [ ] Integration với real auth provider
- [ ] Command Palette full implementation

---

## ✅ Done

- [x] Project structure với Vite + React + TypeScript + TailwindCSS
- [x] Core plugin system (registry, API, lifecycle hooks)
- [x] Authentication system (store, guards, context)
- [x] Layout components (ShellLayout, Sidebar, Header, Notifications)
- [x] Router với dynamic plugin route injection
- [x] Zustand state management (hub store, auth store)
- [x] Plugin template (`src/plugins/_template/`)
- [x] Habit RPG v2 Core mechanics (XP, Level, Stats, Streak)
- [x] Habit RPG v2 UI (Dashboard, HeroPanel, QuestList)
- [x] Habit RPG v2 Skill Tree UI & Unlock logic
- [x] Habit RPG v2 Boss Encounter & Damage logic
- [x] Habit RPG v2 Archetype Selection (Week 3 unlock)
- [x] Habit RPG v2 Crafting System & Recipes (Week 6 unlock)
- [x] UI/UX Polishing: Sidebar redesign (hover-expand, nested menus)
- [x] Header enhancements: Notification Panel implementation
- [x] Profile Management: User name and avatar editing
- [x] Habit Management: Edit/Pause/Delete with 3-dot menus
- [x] Documentation (README, ARCHITECTURE, RULES, HABIT-RPG-V2)
- [x] VSCode settings cho better DX

---

## 🔄 Now

- [ ] Triển khai Monthly Raid Boss (Week 8)
- [ ] Triển khai Inventory system details (Items usage)
- [ ] Triển khai Hybrid Class selection (Week 7)
- [ ] Enhance Command Palette (Ctrl+K) logic integration

---

## ⏭️ Next

- [ ] Monthly Raid & Season Finale implementation
- [ ] Integrate Supabase Auth (thay mock auth)
- [ ] Theme persistence & more appearance settings
- [ ] Plugin Registry Store (for browsing/installing plugins)

---

## ❓ Open Questions

- [UNCONFIRMED] Supabase project ID cho authentication?
- [UNCONFIRMED] Có cần offline support (Service Workers) không?

---

## 📂 Working Set

### Active Files

```
src/
├── core/layout/          # Sidebar, Header, NotificationPanel
├── core/auth/            # AuthStore updateProfile
├── pages/Settings.tsx    # Profile editing UI
└── plugins/habit-rpg/    # Dashboard & Habit management
```

### Running Commands

```bash
npm run dev  # http://localhost:5173
npx tsc --noEmit # Type checking passes
```

### Key Decisions

| Decision                    | Rationale                                                     |
| --------------------------- | ------------------------------------------------------------- |
| Hover-expand Sidebar        | Access nested items quickly without losing screen real estate |
| Unified Notification Panel  | Aggregate diverse events (System/RPG) in one visual location  |
| Local formatTimeAgo         | Reduce dependency on external libraries (date-fns)            |
| 3-dot menu for habit action | Reduces visual clutter while maintaining full control         |

---

## 📊 Metrics

| Metric                | Value      |
| --------------------- | ---------- |
| Total Core Files      | ~30        |
| Plugin Template Files | 5          |
| TypeScript Errors     | 0          |
| Build Status          | ✅ Passing |

---

_Last updated: 2026-01-15 16:15_

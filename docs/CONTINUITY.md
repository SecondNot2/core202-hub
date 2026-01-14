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
- [x] Documentation (README, ARCHITECTURE, RULES, HABIT-RPG-V2)
- [x] VSCode settings cho better DX

---

## 🔄 Now

- [ ] Triển khai Skill Tree UI cho Habit RPG
- [ ] Triển khai Weekly Boss encounter page
- [ ] Fix các cảnh báo TypeScript còn sót lại

---

## ⏭️ Next

- [ ] Archetype selection system (Week 3)
- [ ] Integrate Supabase Auth (thay mock auth)
- [ ] Enhance Command Palette (Ctrl+K) với nhiều action hơn
- [ ] Implement Settings page functionality
- [ ] Add theme persistence

---

## ❓ Open Questions

- [UNCONFIRMED] Supabase project ID cho authentication?
- [UNCONFIRMED] Có cần offline support không?
- [UNCONFIRMED] Plugin nào sẽ build đầu tiên?

---

## 📂 Working Set

### Active Files

```
src/
├── core/plugin-system/   # Plugin registry & API
├── core/auth/            # Authentication
├── core/layout/          # Shell layout
├── plugins/_template/    # Plugin template
└── App.tsx               # Root component
```

### Running Commands

```bash
npm run dev  # http://localhost:5173
```

### Key Decisions

| Decision                | Rationale                                                |
| ----------------------- | -------------------------------------------------------- |
| Zustand over Redux      | Simpler API, less boilerplate, good for plugin isolation |
| Plugin manifest pattern | Declarative config, easy to validate, future-proof       |
| Mock auth first         | Faster development, swap with Supabase later             |
| TailwindCSS             | Rapid styling, consistent design tokens                  |

---

## 📊 Metrics

| Metric                | Value      |
| --------------------- | ---------- |
| Total Core Files      | ~25        |
| Plugin Template Files | 5          |
| TypeScript Errors     | 0          |
| Build Status          | ✅ Passing |

---

_Last updated: 2026-01-14 09:35_

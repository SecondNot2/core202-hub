# Core202-Hub Workspace Rules

> **Dự án:** Core202-Hub - Personal Tool Hub (Personal Operating System)  
> **Stack:** ReactJS + TypeScript + TailwindCSS + Zustand  
> **Kiến trúc:** Plugin-based modular application

---

## 🎯 Mục tiêu dự án

Xây dựng một **shell application** làm nền tảng để host và tích hợp nhiều công cụ/ứng dụng nội bộ. Mỗi công cụ là một **plugin** độc lập có thể:

- Đăng ký, mount và điều hướng độc lập
- Có routes và entry point riêng
- Giao tiếp với hub qua defined interfaces
- Tách ra thành repository riêng trong tương lai mà không cần refactor core

---

## 📁 Cấu trúc thư mục

```
src/
├── core/                    # Hub core systems (KHÔNG sửa đổi trừ khi cần thiết)
│   ├── auth/                # Authentication & authorization
│   ├── layout/              # Shell layout components
│   ├── plugin-system/       # Plugin registry & lifecycle
│   ├── router/              # Centralized routing
│   └── store/               # Global state (Zustand)
│
├── plugins/                 # Modular applications
│   ├── _template/           # Plugin template (copy để tạo plugin mới)
│   └── [plugin-name]/       # Mỗi plugin folder
│       ├── index.ts         # Plugin entry point
│       ├── manifest.ts      # Plugin metadata & config
│       ├── routes.tsx       # Plugin routes
│       ├── components/      # Plugin components
│       └── store/           # Plugin-scoped state (optional)
│
├── shared/                  # Shared utilities
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Shared hooks
│   ├── types/               # TypeScript interfaces
│   └── utils/               # Utility functions
│
└── pages/                   # Core pages (Home, Login, Settings)
```

---

## 🔧 Stack Guidelines

### Frontend (ReactJS + TypeScript + TailwindCSS)

| Nguyên tắc                | Thực hiện                                                                  |
| ------------------------- | -------------------------------------------------------------------------- |
| **Functional Components** | Luôn dùng functional components với Hooks                                  |
| **TypeScript**            | Bắt buộc cho tất cả components, props, state                               |
| **State Management**      | Zustand cho global state, React hooks cho local state                      |
| **Styling**               | TailwindCSS utility classes, sử dụng `cn()` helper cho conditional classes |
| **Component Structure**   | Mỗi component một file, export cả named và default                         |
| **Performance**           | `React.memo` cho heavy components, `useCallback`/`useMemo` khi cần         |

### Plugin Development

| Bước               | Thực hiện                                              |
| ------------------ | ------------------------------------------------------ |
| 1. Copy template   | `cp -r src/plugins/_template src/plugins/[tên-plugin]` |
| 2. Update manifest | Sửa `manifest.ts` với metadata của plugin              |
| 3. Define routes   | Khai báo routes trong `routes.tsx`                     |
| 4. Register        | Thêm vào `src/plugins/index.ts`                        |

### Plugin API Usage

```typescript
// Trong plugin setup function
setup: (api: PluginAPI) => {
  // ✅ Đúng - sử dụng API methods
  api.notify("Hello!", "success");
  api.registerCommand({
    id: "do-something",
    label: "Do Something",
    action: () => {},
  });

  // ❌ Sai - không import trực tiếp từ core
  // import { useHubStore } from '@core/store';
};
```

---

## ✅ Code Conventions

### Naming

| Loại             | Convention                 | Ví dụ                   |
| ---------------- | -------------------------- | ----------------------- |
| Components       | PascalCase                 | `UserProfile.tsx`       |
| Hooks            | camelCase với prefix `use` | `useNotify.ts`          |
| Utilities        | camelCase                  | `formatDate.ts`         |
| Types/Interfaces | PascalCase                 | `interface UserData {}` |
| Constants        | UPPER_SNAKE_CASE           | `const MAX_RETRIES = 3` |
| Plugin IDs       | kebab-case                 | `'notes-app'`           |

### File Organization

```typescript
// Thứ tự imports
1. React imports
2. Third-party libraries
3. @core/* imports
4. @shared/* imports
5. Local imports (relative)
6. Types

// Ví dụ
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@core/auth';
import { useNotify } from '@shared/hooks';
import { Button } from './Button';
import type { UserData } from './types';
```

### TypeScript

```typescript
// ✅ Luôn define interface cho props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

// ✅ Sử dụng type inference khi có thể
const [count, setCount] = useState(0); // TypeScript tự infer number

// ✅ Explicit return types cho complex functions
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

---

## 🔒 Security Guidelines

| Concern              | Giải pháp                                                     |
| -------------------- | ------------------------------------------------------------- |
| **Authentication**   | Luôn sử dụng `AuthGuard` cho protected routes                 |
| **Permissions**      | Check permissions qua `api.hasPermission()` trong plugins     |
| **XSS**              | React tự escape, KHÔNG dùng `dangerouslySetInnerHTML`         |
| **Sensitive Data**   | KHÔNG log sensitive data, sử dụng `.env` cho secrets          |
| **Plugin Isolation** | Plugins chỉ communicate qua PluginAPI, không import trực tiếp |

---

## 🧪 Testing Strategy

### Unit Tests

- Test individual components với React Testing Library
- Test hooks với `@testing-library/react-hooks`
- Test utility functions với Jest

### Integration Tests

- Test plugin registration và loading
- Test authentication flows
- Test route navigation

### File naming

```
Component.tsx
Component.test.tsx
Component.stories.tsx (optional - Storybook)
```

---

## 📝 Documentation Requirements

| Loại thay đổi     | Documentation cần update                            |
| ----------------- | --------------------------------------------------- |
| Thêm plugin mới   | `README.md` (Plugin list), plugin's own `README.md` |
| Thay đổi API      | `ARCHITECTURE.md`, JSDoc comments                   |
| Thêm env variable | `.env.example`                                      |
| Breaking changes  | `CHANGELOG.md`, migration guide                     |

---

## 🚀 Development Workflow

### Tạo Branch

```
feature/[plugin-name]-[feature]
fix/[issue-description]
refactor/[scope]
```

### Commit Messages

```
feat(plugin-name): add new feature
fix(core): resolve routing issue
docs: update README
refactor(shared): optimize utility functions
```

### PR Checklist

- [ ] TypeScript compiles (`npm run build`)
- [ ] No console errors
- [ ] Responsive trên mobile
- [ ] Dark mode works
- [ ] Documentation updated
- [ ] Tests pass (nếu có)

---

## ⚠️ Anti-patterns (TRÁNH)

| ❌ Không làm                               | ✅ Làm thay thế                |
| ------------------------------------------ | ------------------------------ |
| Import trực tiếp từ `@core/*` trong plugin | Sử dụng `PluginAPI`            |
| Sử dụng `any` type                         | Define proper types/interfaces |
| Inline styles                              | TailwindCSS classes            |
| Hardcode URLs/keys                         | Sử dụng environment variables  |
| Big monolithic components                  | Tách thành smaller components  |
| Side effects trong render                  | Sử dụng `useEffect`            |

---

## 🔄 Continuity Ledger

Khi làm việc trên dự án, maintain trạng thái trong file `CONTINUITY.md`:

```markdown
## Current State

**Goal:** [Mục tiêu hiện tại]

**Done:**

- [x] Task đã hoàn thành

**Now:**

- [ ] Task đang làm

**Next:**

- [ ] Task tiếp theo

**Open Questions:**

- [UNCONFIRMED] Câu hỏi chưa có câu trả lời

**Working Set:**

- Files: `src/plugins/notes/...`
- Commands: `npm run dev`
```

---

## 📚 Quick Reference

### Path Aliases

| Alias       | Path           |
| ----------- | -------------- |
| `@/`        | `src/`         |
| `@core/`    | `src/core/`    |
| `@plugins/` | `src/plugins/` |
| `@shared/`  | `src/shared/`  |

### Key Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npx tsc --noEmit # Type check without build
```

### Important Files

| File                            | Purpose                     |
| ------------------------------- | --------------------------- |
| `src/plugins/index.ts`          | Plugin registration         |
| `src/shared/types/index.ts`     | Core type definitions       |
| `src/core/plugin-system/api.ts` | PluginAPI implementation    |
| `ARCHITECTURE.md`               | System design documentation |

---

_Last updated: 2026-01-14_

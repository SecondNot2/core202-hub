# Core202 Hub

A personal tool hub (personal operating system) built with React, TypeScript, and TailwindCSS.

## Features

- **Plugin Architecture**: Modular applications that can be registered, mounted, and navigated independently
- **Authentication**: Built-in auth system with role-based access control
- **Theme Support**: Light/dark/system theme switching
- **Notification System**: Toast notifications for user feedback
- **Command System**: Global command palette support

## 📚 Documentation

| Document                               | Description                                             |
| -------------------------------------- | ------------------------------------------------------- |
| [Architecture](./docs/ARCHITECTURE.md) | System design, data flow, component diagrams            |
| [Workspace Rules](./docs/RULES.md)     | Coding conventions, best practices, security guidelines |
| [Continuity](./docs/CONTINUITY.md)     | Project state tracking, session notes                   |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development

The application runs at `http://localhost:5173` by default.

**Demo Login:**

- Any email/password combination works
- Include "admin" in the email for admin role

## Project Structure

```
core202-hub/
├── docs/                    # 📚 Documentation
│   ├── ARCHITECTURE.md      # System design
│   ├── RULES.md             # Workspace rules
│   └── CONTINUITY.md        # Session tracking
│
├── src/
│   ├── core/                # Hub core systems
│   │   ├── auth/            # Authentication & authorization
│   │   ├── layout/          # Shell layout components
│   │   ├── plugin-system/   # Plugin registry & lifecycle
│   │   ├── router/          # Centralized routing
│   │   └── store/           # Global state (Zustand)
│   │
│   ├── plugins/             # Modular applications
│   │   ├── _template/       # Plugin template
│   │   └── [plugin-name]/   # Each plugin folder
│   │
│   ├── shared/              # Shared utilities
│   │   ├── hooks/           # Reusable hooks
│   │   ├── types/           # TypeScript interfaces
│   │   └── utils/           # Utility functions
│   │
│   ├── pages/               # Core pages
│   ├── App.tsx              # Root application
│   └── main.tsx             # Entry point
│
├── .vscode/                 # VSCode settings
├── package.json
└── README.md
```

## Creating a Plugin

1. Copy the `src/plugins/_template` folder
2. Rename it to your plugin name (e.g., `notes`)
3. Update `manifest.ts` with your plugin details
4. Define routes in `routes.tsx`
5. Build your components
6. Register the plugin in `src/plugins/index.ts`:

```typescript
import { manifest as notesManifest } from "./notes/manifest";

registerPlugin(notesManifest, () => import("./notes"));
```

> 📖 See [RULES.md](./docs/RULES.md) for detailed plugin development guidelines.

## Plugin API

Plugins receive a `PluginAPI` object with these methods:

| Method                       | Description                    |
| ---------------------------- | ------------------------------ |
| `getUser()`                  | Get current authenticated user |
| `hasPermission(permission)`  | Check user permission          |
| `navigate(path)`             | Navigate to a route            |
| `notify(message, type)`      | Show notification              |
| `getSharedState(key)`        | Get shared state value         |
| `setSharedState(key, value)` | Set shared state value         |
| `registerCommand(command)`   | Register a global command      |
| `emit(event, payload)`       | Emit global event              |
| `on(event, callback)`        | Subscribe to global event      |

## Technology Stack

| Technology     | Purpose          |
| -------------- | ---------------- |
| React 18       | UI library       |
| TypeScript     | Type safety      |
| TailwindCSS 3  | Styling          |
| Vite           | Build tool       |
| React Router 6 | Routing          |
| Zustand        | State management |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## License

MIT

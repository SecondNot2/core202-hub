# Core202 Hub - Architecture Documentation

## Overview

Core202 Hub is a personal tool hub designed as a shell application that hosts modular plugins. The architecture prioritizes:

1. **Extensibility** - Easy to add new plugins
2. **Isolation** - Plugins are independent and don't affect each other
3. **Maintainability** - Clean separation of concerns
4. **Future-proofing** - Ready for migration to monorepo/microfrontends

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                        Application                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Core Systems                          ││
│  │  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌───────────────┐  ││
│  │  │  Auth   │ │  Router  │ │ Layout │ │ Plugin System │  ││
│  │  └─────────┘ └──────────┘ └────────┘ └───────────────┘  ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │                       Plugins                            ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        ││
│  │  │ Plugin  │ │ Plugin  │ │ Plugin  │ │   ...   │        ││
│  │  │    A    │ │    B    │ │    C    │ │         │        ││
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘        ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Shared Layer                          ││
│  │        Types    │    Hooks    │    Utils                ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Core Systems

### 1. Plugin System

The plugin system is the heart of the architecture:

**Registry** (`core/plugin-system/registry.ts`)

- Manages plugin registration, loading, and lifecycle
- Uses Zustand for reactive state management
- Supports lazy loading for better performance

**Plugin API** (`core/plugin-system/api.ts`)

- Provides a controlled interface for plugins to interact with the hub
- Includes event bus for cross-plugin communication
- Namespaces plugin commands and events

**Plugin Lifecycle**

```
registered → loading → active ⟷ disabled
                ↓
              error
```

### 2. Authentication

**Store** (`core/auth/store.ts`)

- Zustand store with persistence
- Mock implementation for development
- Ready for real auth provider integration

**Guards** (`core/auth/AuthGuard.tsx`)

- Route protection based on authentication state
- Role-based access control
- Permission-based access control

### 3. Router

**Centralized Router** (`core/router/AppRouter.tsx`)

- Uses React Router v6
- Dynamically injects plugin routes
- Supports lazy loading of route components

### 4. State Management

**Hub Store** (`core/store/hub.ts`)

- Global UI state (sidebar, theme)
- Notification queue
- Command registry
- Shared state for plugin communication

## Plugin Architecture

### Plugin Structure

Each plugin is a self-contained module:

```
plugins/[plugin-name]/
├── index.ts          # Entry point with definePlugin()
├── manifest.ts       # Plugin metadata
├── routes.tsx        # Route definitions
├── components/       # React components
├── store/            # Plugin-specific state (optional)
└── hooks/            # Plugin-specific hooks (optional)
```

### Plugin Manifest

```typescript
interface PluginManifest {
  id: string; // Unique identifier
  name: string; // Display name
  version: string; // Semantic version
  basePath: string; // Route base path
  navItems?: []; // Navigation items
  permissions?: []; // Required permissions
  dependencies?: []; // Plugin dependencies
}
```

### Plugin Communication

Plugins communicate through:

1. **Shared State** - Key-value store in hub
2. **Event Bus** - Pub/sub for events
3. **Commands** - Global command registration

## Data Flow

```
User Action
    │
    ▼
Component (Plugin or Core)
    │
    ▼
Store Action (Zustand)
    │
    ▼
State Update
    │
    ▼
React Re-render
```

## Future Considerations

### Monorepo Migration

The current structure is designed to easily migrate to a monorepo:

```
packages/
├── core/           # Core systems as a package
├── shared/         # Shared utilities as a package
├── plugins/
│   ├── notes/      # Each plugin as a separate package
│   └── tasks/
└── hub/            # Main application
```

### Module Federation

For true runtime plugin loading:

1. Build plugins as separate bundles
2. Use Webpack Module Federation or similar
3. Load plugins from remote URLs

### Backend Integration

When adding a backend:

1. Replace mock auth with real auth provider
2. Add API client in shared layer
3. Use React Query or similar for data fetching

## Design Decisions

| Decision            | Rationale                                             |
| ------------------- | ----------------------------------------------------- |
| Zustand over Redux  | Simpler API, less boilerplate, great for modular apps |
| React Router v6     | Best-in-class for React, supports lazy routes         |
| Lazy plugin loading | Faster initial load, better code splitting            |
| Event bus pattern   | Loose coupling between plugins                        |
| TypeScript          | Type safety, better DX, self-documenting              |

## Security Considerations

1. **Route Guards** - All protected routes use AuthGuard
2. **Permission Checks** - PluginAPI enforces permissions
3. **Namespace Isolation** - Plugin commands/events are namespaced
4. **No Direct Store Access** - Plugins use API methods only

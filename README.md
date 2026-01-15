# Core202 Hub

A modern, high-performance web application built with React, TypeScript, and Vite. Core202 Hub focuses on delivering a sleek user experience with a robust architectural foundation.

## 🚀 Technologies

- **Frontend:** [React](https://reactjs.org/) (v18)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Routing:** [React Router](https://reactrouter.com/)

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SecondNot2/core202-hub.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

- `src/core`: Core layouts, services, and shared utilities.
- `src/pages`: Application pages and routing.
- `src/components`: Reusable UI components.
- `src/plugins`: Modular plugin system with independent apps.

## 🕹️ Plugins

### 🎮 Habit RPG v2 (Advanced Gamification)

A deep RPG progression system designed for long-term habit formation.

- **RPG Model**: 5 core stats (STR, INT, DEX, WIS, VIT), Energy, and Morale.
- **Quest System**: Habits are automatically converted into daily quests with dynamic rewards.
- **Habit Management**: Advanced management with Edit/Pause/Delete actions and 3-dot menus.
- **Progression**: 12-week guided progression with week-gated feature unlocks.
- **Economy**: Earn Gold, Essence Shards, and Relics to spend on skills and crafts.
- **Boss System**: Weekly bosses generated based on your habit performance/weaknesses.
- **Streak Protection**: Built-in grace tokens, streak shields, and recovery days.

## 🎨 UI/UX Features

- **Glassmorphism Design**: Modern, transparent UI with vibrant gradients.
- **Advanced Navigation- **Hub Store\*\* (`core/store/hub.ts`)

  - Global UI state (sidebar, theme)
  - Notification queue
  - Command registry
  - Shared state for plugin communication

- **Notification System** (`core/layout/NotificationPanel.tsx`)
  - Aggregates system alerts and plugin-specific events (e.g., RPG level ups)
  - Floating dropdown design with persistence via Hub Store.s and game event logs.
- **Profile Management**: Custom user profiles with avatar synchronization.

## 📜 Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run lint`: Run ESLint checks.
- `npm run preview`: Preview the production build locally.

---

Built with ❤️ by [SecondNot2](https://github.com/SecondNot2)

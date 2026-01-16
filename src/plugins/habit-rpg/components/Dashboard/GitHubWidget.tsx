/**
 * GitHub Widget - Displays GitHub contribution activity
 */

import React, { useEffect, useState } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { useAuth } from "@core/auth";
import { useGameStore } from "../../store/game.store";
import {
  getGitHubStats,
  validateGitHubUsername,
  type GitHubStats,
} from "../../services/github.service";

// ============================================================================
// Types
// ============================================================================

interface GitHubWidgetProps {
  className?: string;
}

type LoadingState = "idle" | "loading" | "success" | "error";

// ============================================================================
// Component
// ============================================================================

export const GitHubWidget: React.FC<GitHubWidgetProps> = ({ className }) => {
  const { user } = useAuth();
  const { github, setGitHubUsername, completeGitHubQuest } = useGameStore();

  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [inputUsername, setInputUsername] = useState("");
  const [questCompletedToday, setQuestCompletedToday] = useState(false);

  // Load stats when username is set
  useEffect(() => {
    async function loadStats() {
      if (!github.username || !user?.id) return;

      setLoadingState("loading");
      setError(null);

      try {
        const data = await getGitHubStats(user.id, github.username);
        setStats(data);
        setLoadingState("success");

        // Auto-complete quest if commits today and not already completed
        if (data.todayCommits > 0 && !questCompletedToday) {
          completeGitHubQuest(data.todayCommits);
          setQuestCompletedToday(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats");
        setLoadingState("error");
      }
    }

    loadStats();
  }, [github.username, user?.id]);

  // Handle username submission
  const handleSetUsername = async () => {
    if (!inputUsername.trim()) return;

    setLoadingState("loading");
    const isValid = await validateGitHubUsername(inputUsername.trim());

    if (isValid) {
      setGitHubUsername(inputUsername.trim());
      setInputUsername("");
    } else {
      setError("GitHub user not found");
      setLoadingState("error");
    }
  };

  // Render setup prompt if no username
  if (!github.username) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <GitHubIcon />
          Connect GitHub
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Link your GitHub account to track commits and earn XP for coding!
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            placeholder="Your GitHub username"
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => e.key === "Enter" && handleSetUsername()}
          />
          <button
            onClick={handleSetUsername}
            disabled={loadingState === "loading"}
            className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            {loadingState === "loading" ? "..." : "Connect"}
          </button>
        </div>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  // Loading state
  if (loadingState === "loading" && !stats) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  // Main widget
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <GitHubIcon />
          GitHub Activity
        </h3>
        <a
          href={`https://github.com/${github.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          @{github.username}
        </a>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Today"
          value={stats?.todayCommits || 0}
          suffix="commits"
          highlight={stats?.todayCommits ? stats.todayCommits > 0 : false}
        />
        <StatCard
          label="Streak"
          value={stats?.currentStreak || 0}
          suffix="days"
        />
        <StatCard
          label="Total"
          value={stats?.activities.reduce((sum, a) => sum + a.count, 0) || 0}
          suffix="commits"
        />
      </div>

      {/* Quest Status */}
      {stats && stats.todayCommits > 0 && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckIcon />
            <span className="text-sm font-medium">
              Daily Commit Quest Completed! (+25 XP, +10 Gold)
            </span>
          </div>
        </div>
      )}

      {/* Activity Calendar */}
      {stats && stats.activities.length > 0 && (
        <div className="overflow-x-auto">
          <ActivityCalendar
            data={stats.activities.map((a) => ({
              date: a.date,
              count: a.count,
              level: a.level,
            }))}
            theme={{
              dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
              light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
            }}
            colorScheme="dark"
            blockSize={12}
            blockRadius={2}
            blockMargin={3}
            fontSize={12}
          />
        </div>
      )}

      {/* Disconnect option */}
      <button
        onClick={() => setGitHubUsername(null)}
        className="mt-4 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        Disconnect GitHub
      </button>
    </div>
  );
};

// ============================================================================
// Sub-components
// ============================================================================

const StatCard: React.FC<{
  label: string;
  value: number;
  suffix: string;
  highlight?: boolean;
}> = ({ label, value, suffix, highlight }) => (
  <div className="text-center">
    <div
      className={`text-2xl font-bold ${
        highlight ? "text-green-500" : "text-gray-900 dark:text-white"
      }`}
    >
      {value}
    </div>
    <div className="text-xs text-gray-500 dark:text-gray-400">
      {label} · {suffix}
    </div>
  </div>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default GitHubWidget;

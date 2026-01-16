/**
 * GitHub Widget - Premium dark theme with detailed analytics
 * Features: Animated stats, Activity Calendar with tooltips, Commit patterns, Recent commits
 */

import React, { useEffect, useState, useCallback } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { Tooltip } from "react-tooltip";
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
// Helpers
// ============================================================================

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function formatLastUpdated(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  return `${Math.floor(diffMins / 60)}h ago`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = date.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
      ? "nd"
      : day === 3 || day === 23
      ? "rd"
      : "th";
  return `${months[date.getMonth()]} ${day}${suffix}`;
}

// ============================================================================
// Main Component
// ============================================================================

export const GitHubWidget: React.FC<GitHubWidgetProps> = ({ className }) => {
  const { user } = useAuth();
  const { github, setGitHubUsername, completeGitHubQuest } = useGameStore();

  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [inputUsername, setInputUsername] = useState("");
  const [questCompletedToday, setQuestCompletedToday] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load stats
  const loadStats = useCallback(
    async (forceRefresh = false) => {
      if (!github.username || !user?.id) return;

      if (forceRefresh) {
        setIsRefreshing(true);
      } else {
        setLoadingState("loading");
      }
      setError(null);

      try {
        const data = await getGitHubStats(
          user.id,
          github.username,
          forceRefresh
        );
        setStats(data);
        setLoadingState("success");

        if (data.todayCommits > 0 && !questCompletedToday) {
          completeGitHubQuest(data.todayCommits);
          setQuestCompletedToday(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats");
        setLoadingState("error");
      } finally {
        setIsRefreshing(false);
      }
    },
    [github.username, user?.id, questCompletedToday, completeGitHubQuest]
  );

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleRefresh = () => {
    loadStats(true);
  };

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

  // ============================================================================
  // Render: Setup Prompt
  // ============================================================================
  if (!github.username) {
    return (
      <div
        className={`bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700/50 p-5 ${className}`}
      >
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <GitHubIcon className="text-emerald-400" />
          Connect GitHub
        </h3>

        <p className="text-sm text-slate-400 mb-4">
          Link your GitHub to track commits and earn XP for coding!
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            placeholder="Your GitHub username"
            className="flex-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700/50 text-white text-sm placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            onKeyDown={(e) => e.key === "Enter" && handleSetUsername()}
          />
          <button
            onClick={handleSetUsername}
            disabled={loadingState === "loading"}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/25"
          >
            {loadingState === "loading" ? "..." : "Connect"}
          </button>
        </div>

        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    );
  }

  // ============================================================================
  // Render: Loading State
  // ============================================================================
  if (loadingState === "loading" && !stats) {
    return (
      <div
        className={`bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700/50 p-5 ${className}`}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700/50 rounded w-1/3" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 bg-slate-700/50 rounded-lg" />
            <div className="h-20 bg-slate-700/50 rounded-lg" />
            <div className="h-20 bg-slate-700/50 rounded-lg" />
            <div className="h-20 bg-slate-700/50 rounded-lg" />
          </div>
          <div className="h-32 bg-slate-700/50 rounded-lg" />
        </div>
      </div>
    );
  }

  // ============================================================================
  // Render: Main Widget
  // ============================================================================
  const calendarTheme = {
    dark: ["#1e293b", "#064e3b", "#047857", "#10b981", "#34d399"],
  };

  // Generate calendar data - uses full year data if available from contributions API
  const generateCalendarData = () => {
    if (!stats?.activities) return [];

    const activities = stats.activities;
    const dateMap = new Map(activities.map((a) => [a.date, a]));
    const result = [];

    // Helper to format date as YYYY-MM-DD in local timezone
    const toLocalDateString = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Get date range from Jan 1st of current year to today (local time)
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1); // Jan 1st of current year
    const endDate = new Date(); // Today in local timezone

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = toLocalDateString(d);
      const existing = dateMap.get(dateStr);
      result.push(existing || { date: dateStr, count: 0, level: 0 as const });
    }

    return result;
  };

  // Calculate total contributions for current year
  const totalContributions =
    stats?.activities?.reduce((sum, a) => sum + a.count, 0) || 0;

  return (
    <div
      className={`bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700/50 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <GitHubIcon className="text-emerald-400" />
            GitHub Activity
          </h3>
          <div className="flex items-center gap-3">
            <a
              href={`https://github.com/${github.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {stats?.profile?.avatar_url && (
                <img
                  src={stats.profile.avatar_url}
                  alt=""
                  className="w-5 h-5 rounded-full"
                />
              )}
              @{github.username}
            </a>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all disabled:opacity-50"
              title="Refresh"
            >
              <RefreshIcon className={isRefreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
        {stats?.lastFetched && (
          <p className="text-xs text-slate-500 mt-1">
            Updated {formatLastUpdated(stats.lastFetched)}
          </p>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Quest Completion Banner */}
        {stats && stats.todayCommits > 0 && (
          <div className="p-3 bg-emerald-900/30 rounded-lg border border-emerald-700/50 animate-fade-in">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckIcon />
              <span className="text-sm font-medium">
                Daily Commit Quest Completed! +25 XP, +10 Gold
              </span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon="🔥"
            label="Today"
            value={stats?.todayCommits || 0}
            suffix="commits"
            gradient="from-orange-500 to-red-500"
            highlight={stats?.todayCommits ? stats.todayCommits > 0 : false}
          />
          <StatCard
            icon="📅"
            label="Streak"
            value={stats?.currentStreak || 0}
            suffix="days"
            gradient="from-emerald-500 to-teal-500"
          />
          <StatCard
            icon="📊"
            label="Total"
            value={stats?.activities?.reduce((sum, a) => sum + a.count, 0) || 0}
            suffix="commits"
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon="📦"
            label="Repos"
            value={stats?.profile?.public_repos || 0}
            suffix="public"
            gradient="from-purple-500 to-pink-500"
          />
        </div>

        {/* Activity Calendar */}
        {stats && stats.activities && stats.activities.length > 0 && (
          <div className="bg-slate-900/50 rounded-lg p-3 overflow-x-auto">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-slate-300">
                {totalContributions} contributions in {new Date().getFullYear()}
              </h4>
            </div>
            <ActivityCalendar
              data={generateCalendarData()}
              theme={calendarTheme}
              colorScheme="dark"
              blockSize={11}
              blockRadius={2}
              blockMargin={3}
              fontSize={11}
              showWeekdayLabels
              renderBlock={(block, activity) =>
                React.cloneElement(block, {
                  "data-tooltip-id": "contribution-tooltip",
                  "data-tooltip-content": `${activity.count} contribution${
                    activity.count !== 1 ? "s" : ""
                  } on ${formatDate(activity.date)}`,
                } as React.HTMLAttributes<SVGRectElement>)
              }
            />
            <Tooltip
              id="contribution-tooltip"
              className="!bg-slate-800 !text-white !text-xs !py-1.5 !px-2.5 !rounded-md !border !border-slate-600"
            />
          </div>
        )}

        {/* Commit Patterns */}
        {stats?.patterns && (
          <div className="bg-slate-900/50 rounded-lg p-3">
            <h4 className="text-xs font-medium text-slate-400 mb-3 flex items-center gap-1">
              📊 Commit Patterns
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {/* Most Active Hour */}
              <div className="bg-slate-800/50 rounded-lg p-2.5">
                <p className="text-xs text-slate-500 mb-1">Most Active Hour</p>
                <p className="text-lg font-bold text-white">
                  {stats.patterns.mostActiveHour}:00
                </p>
                <div className="flex gap-0.5 mt-2 h-6 items-end">
                  {stats.patterns.activeHours
                    .filter((_, i) => i >= 8 && i <= 22)
                    .map((h, i) => {
                      const max = Math.max(
                        ...stats.patterns!.activeHours.map((x) => x.count)
                      );
                      const height = max > 0 ? (h.count / max) * 100 : 0;
                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-sm transition-all ${
                            h.hour === stats.patterns!.mostActiveHour
                              ? "bg-emerald-400"
                              : "bg-slate-600"
                          }`}
                          style={{ height: `${Math.max(height, 8)}%` }}
                          title={`${h.hour}:00 - ${h.count} commits`}
                        />
                      );
                    })}
                </div>
              </div>

              {/* Most Active Day */}
              <div className="bg-slate-800/50 rounded-lg p-2.5">
                <p className="text-xs text-slate-500 mb-1">Most Active Day</p>
                <p className="text-lg font-bold text-white">
                  {stats.patterns.mostActiveDay}
                </p>
                <div className="flex gap-1 mt-2">
                  {stats.patterns.activeDays.map((d) => {
                    const max = Math.max(
                      ...stats.patterns!.activeDays.map((x) => x.count)
                    );
                    const intensity = max > 0 ? d.count / max : 0;
                    return (
                      <div
                        key={d.day}
                        className={`flex-1 h-6 rounded-sm flex items-center justify-center text-[10px] font-medium transition-all ${
                          d.day === stats.patterns!.mostActiveDay
                            ? "bg-emerald-500 text-white"
                            : "text-slate-400"
                        }`}
                        style={{
                          backgroundColor:
                            d.day !== stats.patterns!.mostActiveDay
                              ? `rgba(100, 116, 139, ${0.2 + intensity * 0.6})`
                              : undefined,
                        }}
                        title={`${d.day}: ${d.count} commits`}
                      >
                        {d.day.charAt(0)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Commits */}
        {stats?.recentCommits && stats.recentCommits.length > 0 && (
          <div className="bg-slate-900/50 rounded-lg p-3">
            <h4 className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1">
              💬 Recent Commits
            </h4>
            <div className="space-y-2">
              {stats.recentCommits.map((commit, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                >
                  <CommitIcon className="text-slate-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-300 truncate">{commit.message}</p>
                    <p className="text-slate-500 mt-0.5">
                      {commit.repo} · {formatRelativeTime(commit.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-3 flex justify-end">
        <button
          onClick={() => setGitHubUsername(null)}
          className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// Sub-components
// ============================================================================

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  suffix: string;
  gradient: string;
  highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  suffix,
  gradient,
  highlight,
}) => (
  <div
    className={`p-3 rounded-lg bg-slate-900/50 border transition-all hover:scale-[1.02] ${
      highlight
        ? "border-emerald-500/50 shadow-lg shadow-emerald-500/10"
        : "border-slate-700/50"
    }`}
  >
    <div className="flex items-center gap-2 mb-1">
      <div
        className={`w-7 h-7 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-sm shadow-lg`}
      >
        {icon}
      </div>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
    <p
      className={`text-xl font-bold ${
        highlight ? "text-emerald-400" : "text-white"
      }`}
    >
      {value.toLocaleString()}
    </p>
    <p className="text-xs text-slate-500">{suffix}</p>
  </div>
);

// ============================================================================
// Icons
// ============================================================================

const GitHubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckIcon: React.FC = () => (
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

const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`w-4 h-4 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const CommitIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`w-3 h-3 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="4" strokeWidth={2} />
    <path strokeLinecap="round" strokeWidth={2} d="M12 2v6m0 8v6" />
  </svg>
);

export default GitHubWidget;

/**
 * GitHub Service
 * Handles GitHub API calls and activity tracking for Habit RPG
 */

import { supabase } from "@core/supabase/client";

// ============================================================================
// Types
// ============================================================================

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
  };
  payload?: {
    commits?: Array<{ message: string }>;
    size?: number;
  };
}

export interface GitHubActivity {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubStats {
  todayCommits: number;
  currentStreak: number;
  lastCommitDate: string | null;
  activities: GitHubActivity[];
  lastFetched: Date;
}

// ============================================================================
// Constants
// ============================================================================

const GITHUB_API_BASE = "https://api.github.com";
const CACHE_VALIDITY_MINUTES = 30;

// ============================================================================
// API Functions
// ============================================================================

/**
 * Fetch recent public events from GitHub API
 */
export async function fetchGitHubEvents(
  username: string
): Promise<GitHubEvent[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/events/public?per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("GitHub user not found");
      }
      if (response.status === 403) {
        throw new Error("API rate limit exceeded");
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("[GitHub] Failed to fetch events:", error);
    throw error;
  }
}

/**
 * Count commits for a specific date from events
 */
function countCommitsForDate(
  events: GitHubEvent[],
  targetDate: string
): number {
  return events
    .filter((event) => {
      const eventDate = event.created_at.split("T")[0];
      return event.type === "PushEvent" && eventDate === targetDate;
    })
    .reduce((total, event) => {
      return (
        total + (event.payload?.size || event.payload?.commits?.length || 1)
      );
    }, 0);
}

/**
 * Calculate current commit streak from events
 */
function calculateStreak(events: GitHubEvent[]): {
  streak: number;
  lastCommitDate: string | null;
} {
  const pushEvents = events.filter((e) => e.type === "PushEvent");
  if (pushEvents.length === 0) {
    return { streak: 0, lastCommitDate: null };
  }

  // Get unique dates with commits (sorted descending)
  const commitDates = [
    ...new Set(pushEvents.map((e) => e.created_at.split("T")[0])),
  ].sort((a, b) => b.localeCompare(a));

  const lastCommitDate = commitDates[0];
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Check if streak is still active (committed today or yesterday)
  if (lastCommitDate !== today && lastCommitDate !== yesterday) {
    return { streak: 0, lastCommitDate };
  }

  // Count consecutive days
  let streak = 0;
  let currentDate = new Date(lastCommitDate);

  for (const dateStr of commitDates) {
    const expectedDate = currentDate.toISOString().split("T")[0];
    if (dateStr === expectedDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (dateStr < expectedDate) {
      break;
    }
  }

  return { streak, lastCommitDate };
}

/**
 * Convert events to activity data for calendar visualization
 */
function eventsToActivities(events: GitHubEvent[]): GitHubActivity[] {
  const activityMap = new Map<string, number>();

  // Count commits per day
  events
    .filter((e) => e.type === "PushEvent")
    .forEach((event) => {
      const date = event.created_at.split("T")[0];
      const commits =
        event.payload?.size || event.payload?.commits?.length || 1;
      activityMap.set(date, (activityMap.get(date) || 0) + commits);
    });

  // Convert to activity array with levels
  const activities: GitHubActivity[] = [];
  activityMap.forEach((count, date) => {
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count >= 10) level = 4;
    else if (count >= 5) level = 3;
    else if (count >= 3) level = 2;
    else if (count >= 1) level = 1;

    activities.push({ date, count, level });
  });

  return activities.sort((a, b) => a.date.localeCompare(b.date));
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Get GitHub stats with caching
 */
export async function getGitHubStats(
  userId: string,
  username: string,
  forceRefresh = false
): Promise<GitHubStats> {
  // Check cache first
  if (!forceRefresh) {
    const cached = await getCachedStats(userId);
    if (cached && isCacheValid(cached.lastFetched)) {
      return cached;
    }
  }

  // Fetch fresh data from GitHub
  const events = await fetchGitHubEvents(username);
  const today = new Date().toISOString().split("T")[0];
  const todayCommits = countCommitsForDate(events, today);
  const { streak, lastCommitDate } = calculateStreak(events);
  const activities = eventsToActivities(events);

  const stats: GitHubStats = {
    todayCommits,
    currentStreak: streak,
    lastCommitDate,
    activities,
    lastFetched: new Date(),
  };

  // Save to cache
  await saveCachedStats(userId, username, stats);

  return stats;
}

/**
 * Check if user has committed today
 */
export async function hasCommittedToday(
  userId: string,
  username: string
): Promise<boolean> {
  const stats = await getGitHubStats(userId, username);
  return stats.todayCommits > 0;
}

// ============================================================================
// Cache Functions (Supabase)
// ============================================================================

async function getCachedStats(userId: string): Promise<GitHubStats | null> {
  try {
    const { data, error } = await supabase
      .from("github_activity_cache")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) return null;

    return {
      todayCommits: data.today_commits || 0,
      currentStreak: data.current_streak || 0,
      lastCommitDate: data.last_commit_date,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      activities: (data.activity_data as any) || [],
      lastFetched: new Date(data.last_fetched || 0),
    };
  } catch {
    return null;
  }
}

async function saveCachedStats(
  userId: string,
  username: string,
  stats: GitHubStats
): Promise<void> {
  try {
    await supabase.from("github_activity_cache").upsert({
      user_id: userId,
      github_username: username,
      today_commits: stats.todayCommits,
      current_streak: stats.currentStreak,
      last_commit_date: stats.lastCommitDate,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      activity_data: stats.activities as any,
      last_fetched: stats.lastFetched.toISOString(),
    });
  } catch (error) {
    console.error("[GitHub] Failed to save cache:", error);
  }
}

function isCacheValid(lastFetched: Date): boolean {
  const now = Date.now();
  const cacheAge = now - lastFetched.getTime();
  return cacheAge < CACHE_VALIDITY_MINUTES * 60 * 1000;
}

/**
 * Validate GitHub username exists
 */
export async function validateGitHubUsername(
  username: string
): Promise<boolean> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    return response.ok;
  } catch {
    return false;
  }
}

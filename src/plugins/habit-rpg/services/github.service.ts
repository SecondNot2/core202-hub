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
    commits?: Array<{ message: string; sha?: string }>;
    size?: number;
  };
}

export interface GitHubActivity {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubProfile {
  avatar_url: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  name: string | null;
  bio: string | null;
}

export interface HourActivity {
  hour: number;
  count: number;
}

export interface DayActivity {
  day: string;
  count: number;
}

export interface CommitPattern {
  activeHours: HourActivity[];
  activeDays: DayActivity[];
  mostActiveHour: number;
  mostActiveDay: string;
}

export interface RecentCommit {
  message: string;
  repo: string;
  date: string;
  sha: string;
}

export interface GitHubStats {
  todayCommits: number;
  currentStreak: number;
  lastCommitDate: string | null;
  activities: GitHubActivity[];
  lastFetched: Date;
  profile: GitHubProfile | null;
  patterns: CommitPattern | null;
  recentCommits: RecentCommit[];
}

// ============================================================================
// Constants
// ============================================================================

const GITHUB_API_BASE = "https://api.github.com";
const CACHE_VALIDITY_MINUTES = 30;

// ============================================================================
// Contributions API (Full Year Data)
// ============================================================================

/**
 * Fetch full year contribution data from GitHub
 * Uses the skyline API endpoint which provides contribution calendar data
 */
export async function fetchContributionsData(
  username: string,
  year?: number
): Promise<GitHubActivity[]> {
  const targetYear = year || new Date().getFullYear();

  try {
    // Use GitHub's contribution calendar via a public proxy API
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=${targetYear}`
    );

    if (!response.ok) {
      console.warn("[GitHub] Contributions API failed, falling back to events");
      return [];
    }

    const data = await response.json();

    // Transform to our GitHubActivity format
    const activities: GitHubActivity[] = [];

    if (data.contributions && Array.isArray(data.contributions)) {
      for (const contrib of data.contributions) {
        let level: 0 | 1 | 2 | 3 | 4 = 0;
        if (contrib.count >= 10) level = 4;
        else if (contrib.count >= 5) level = 3;
        else if (contrib.count >= 3) level = 2;
        else if (contrib.count >= 1) level = 1;

        activities.push({
          date: contrib.date,
          count: contrib.count,
          level,
        });
      }
    }

    return activities.sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error("[GitHub] Failed to fetch contributions:", error);
    return [];
  }
}

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

/**
 * Fetch GitHub user profile data
 */
export async function fetchGitHubProfile(
  username: string
): Promise<GitHubProfile | null> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return {
      avatar_url: data.avatar_url || "",
      public_repos: data.public_repos || 0,
      public_gists: data.public_gists || 0,
      followers: data.followers || 0,
      following: data.following || 0,
      name: data.name || null,
      bio: data.bio || null,
    };
  } catch {
    return null;
  }
}

/**
 * Calculate commit patterns from events (hours and days of week)
 */
function calculateCommitPatterns(events: GitHubEvent[]): CommitPattern {
  const hourCounts = new Map<number, number>();
  const dayCounts = new Map<string, number>();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const pushEvents = events.filter((e) => e.type === "PushEvent");

  pushEvents.forEach((event) => {
    const date = new Date(event.created_at);
    const hour = date.getHours();
    const day = dayNames[date.getDay()];
    const commits = event.payload?.size || event.payload?.commits?.length || 1;

    hourCounts.set(hour, (hourCounts.get(hour) || 0) + commits);
    dayCounts.set(day, (dayCounts.get(day) || 0) + commits);
  });

  // Convert to arrays
  const activeHours: HourActivity[] = [];
  for (let h = 0; h < 24; h++) {
    activeHours.push({ hour: h, count: hourCounts.get(h) || 0 });
  }

  const activeDays: DayActivity[] = dayNames.map((day) => ({
    day,
    count: dayCounts.get(day) || 0,
  }));

  // Find most active
  const mostActiveHour = activeHours.reduce(
    (max, h) => (h.count > max.count ? h : max),
    activeHours[0]
  ).hour;

  const mostActiveDay = activeDays.reduce(
    (max, d) => (d.count > max.count ? d : max),
    activeDays[0]
  ).day;

  return { activeHours, activeDays, mostActiveHour, mostActiveDay };
}

/**
 * Extract recent commits from events
 */
function extractRecentCommits(events: GitHubEvent[]): RecentCommit[] {
  const commits: RecentCommit[] = [];

  const pushEvents = events
    .filter((e) => e.type === "PushEvent" && e.payload?.commits?.length)
    .slice(0, 10); // Get from first 10 push events

  for (const event of pushEvents) {
    const repoName = event.repo.name.split("/")[1] || event.repo.name;

    for (const commit of event.payload?.commits || []) {
      commits.push({
        message: commit.message.split("\n")[0].slice(0, 80), // First line, 80 chars max
        repo: repoName,
        date: event.created_at,
        sha: commit.sha || "",
      });

      if (commits.length >= 5) break;
    }

    if (commits.length >= 5) break;
  }

  return commits;
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

  // Fetch fresh data from GitHub (events + profile + contributions in parallel)
  const currentYear = new Date().getFullYear();
  const [events, profile, contributions] = await Promise.all([
    fetchGitHubEvents(username),
    fetchGitHubProfile(username),
    fetchContributionsData(username, currentYear),
  ]);

  // Helper to get local date string (avoid UTC timezone issues)
  const getLocalDateString = (date: Date = new Date()): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = getLocalDateString();
  const todayCommits = countCommitsForDate(events, today);
  const { streak, lastCommitDate } = calculateStreak(events);

  // Use contribution data (full year) and merge with today's real-time data from events
  let activities: GitHubActivity[] =
    contributions.length > 0 ? [...contributions] : eventsToActivities(events);

  // Merge today's commits from events API (more real-time) into contributions
  if (todayCommits > 0) {
    const todayIndex = activities.findIndex((a) => a.date === today);
    const todayActivity = {
      date: today,
      count: todayCommits,
      level: (todayCommits >= 10
        ? 4
        : todayCommits >= 5
        ? 3
        : todayCommits >= 3
        ? 2
        : 1) as 0 | 1 | 2 | 3 | 4,
    };

    if (todayIndex >= 0) {
      // Update today's entry if events show more commits
      if (todayCommits > activities[todayIndex].count) {
        activities[todayIndex] = todayActivity;
      }
    } else {
      // Add today if not present
      activities.push(todayActivity);
      activities.sort((a, b) => a.date.localeCompare(b.date));
    }
  }

  const patterns = calculateCommitPatterns(events);
  const recentCommits = extractRecentCommits(events);

  const stats: GitHubStats = {
    todayCommits,
    currentStreak: streak,
    lastCommitDate,
    activities,
    lastFetched: new Date(),
    profile,
    patterns,
    recentCommits,
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activityData = data.activity_data as any;

    // Handle both old format (array of activities) and new format (object with extended data)
    const isNewFormat =
      activityData && !Array.isArray(activityData) && activityData.activities;

    return {
      todayCommits: data.today_commits || 0,
      currentStreak: data.current_streak || 0,
      lastCommitDate: data.last_commit_date,
      activities: isNewFormat
        ? activityData.activities || []
        : activityData || [],
      lastFetched: new Date(data.last_fetched || 0),
      profile: isNewFormat ? activityData.profile || null : null,
      patterns: isNewFormat ? activityData.patterns || null : null,
      recentCommits: isNewFormat ? activityData.recentCommits || [] : [],
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
    // Store extended data in activity_data as a structured object
    const extendedActivityData = {
      activities: stats.activities,
      profile: stats.profile,
      patterns: stats.patterns,
      recentCommits: stats.recentCommits,
    };

    await supabase.from("github_activity_cache").upsert({
      user_id: userId,
      github_username: username,
      today_commits: stats.todayCommits,
      current_streak: stats.currentStreak,
      last_commit_date: stats.lastCommitDate,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      activity_data: extendedActivityData as any,
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

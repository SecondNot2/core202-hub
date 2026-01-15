/**
 * Notification Panel Component
 * Displays recent system events and notifications in a dropdown
 */

import React, { useRef, useEffect } from "react";
import { useHubStore } from "@core/store";
import { useGameStore } from "@plugins/habit-rpg/store";

// Simple time ago function to avoid date-fns dependency
function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Get notifications from Hub Store (system)
  const systemNotifications = useHubStore((state) => state.notifications);
  const removeNotification = useHubStore((state) => state.removeNotification);

  // Get events from Game Store (Habit RPG)
  const gameEvents = useGameStore((state) => state.events || [])
    .slice()
    .reverse()
    .slice(0, 5); // Latest 5

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <h3 className="font-bold text-gray-900 dark:text-white">
          Notifications
        </h3>
        <button className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700">
          Mark all as read
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {systemNotifications.length === 0 && gameEvents.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🔔</span>
            </div>
            <p className="text-sm">No new notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {/* System Notifications */}
            {systemNotifications.map((note) => (
              <div
                key={note.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`
                    w-2 h-2 mt-2 rounded-full flex-shrink-0
                    ${
                      note.type === "error"
                        ? "bg-red-500"
                        : note.type === "success"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }
                  `}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {note.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      System Notification
                    </p>
                  </div>
                  <button
                    onClick={() => removeNotification(note.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

            {/* Game Events */}
            {gameEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">{getEventIcon(event.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {getEventDescription(event)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(event.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-center">
        <button className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          View History
        </button>
      </div>
    </div>
  );
};

// Helpers
function getEventIcon(type: string): string {
  switch (type) {
    case "level_up":
      return "🎉";
    case "quest_completed":
      return "✅";
    case "boss_defeated":
      return "🏆";
    case "skill_unlocked":
      return "✨";
    case "grace_used":
      return "🛡️";
    default:
      return "📝";
  }
}

function getEventDescription(event: any): string {
  switch (event.type) {
    case "level_up":
      return `Leveled up to Level ${event.data.newLevel}!`;
    case "quest_completed":
      return `Completed a quest (+${event.data.xpReward} XP)`;
    case "boss_defeated":
      return "Defeated a boss!";
    case "skill_unlocked":
      return "Unlocked a new skill";
    case "grace_used":
      return "Used a grace token to save streak";
    default:
      return "Game event occurred";
  }
}

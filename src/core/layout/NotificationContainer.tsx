/**
 * Notification Container - Displays toast notifications
 */

import React, { useEffect, useState } from "react";
import { useHubStore } from "@core/store";
import type { Notification } from "@shared/types";

export const NotificationContainer: React.FC = () => {
  const notifications = useHubStore((state) => state.notifications);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

interface NotificationToastProps {
  notification: Notification;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const removeNotification = useHubStore((state) => state.removeNotification);

  useEffect(() => {
    // Trigger animation
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => removeNotification(notification.id), 150);
  };

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <SuccessIcon />;
      case "error":
        return <ErrorIcon />;
      case "warning":
        return <WarningIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case "success":
        return "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800";
      case "error":
        return "bg-red-50 border-red-200 dark:bg-red-900/50 dark:border-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/50 dark:border-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 dark:bg-blue-900/50 dark:border-blue-800";
    }
  };

  return (
    <div
      className={`
        flex items-start gap-3 min-w-80 max-w-md p-4 rounded-lg border shadow-lg
        transition-all duration-150 ease-in-out
        ${getColors()}
        ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}
      `}
    >
      <span className="flex-shrink-0">{getIcon()}</span>
      <div className="flex-1">
        <p className="text-sm text-gray-900 dark:text-white">
          {notification.message}
        </p>
        {notification.action && (
          <button
            onClick={notification.action.onClick}
            className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            {notification.action.label}
          </button>
        )}
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <CloseIcon />
      </button>
    </div>
  );
};

// ============================================================================
// Icons
// ============================================================================

const SuccessIcon = () => (
  <svg
    className="w-5 h-5 text-green-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    className="w-5 h-5 text-red-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    className="w-5 h-5 text-yellow-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const InfoIcon = () => (
  <svg
    className="w-5 h-5 text-blue-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default NotificationContainer;

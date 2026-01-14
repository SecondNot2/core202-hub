/**
 * useNotify - Hook for showing notifications
 */

import { useCallback } from "react";
import { useHubStore } from "@core/store";

type NotificationType = "info" | "success" | "warning" | "error";

interface NotifyOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useNotify() {
  const addNotification = useHubStore((state) => state.addNotification);
  const removeNotification = useHubStore((state) => state.removeNotification);

  const notify = useCallback(
    (
      message: string,
      type: NotificationType = "info",
      options?: NotifyOptions
    ) => {
      return addNotification({
        message,
        type,
        ...options,
      });
    },
    [addNotification]
  );

  const success = useCallback(
    (message: string, options?: NotifyOptions) =>
      notify(message, "success", options),
    [notify]
  );

  const error = useCallback(
    (message: string, options?: NotifyOptions) =>
      notify(message, "error", options),
    [notify]
  );

  const warning = useCallback(
    (message: string, options?: NotifyOptions) =>
      notify(message, "warning", options),
    [notify]
  );

  const info = useCallback(
    (message: string, options?: NotifyOptions) =>
      notify(message, "info", options),
    [notify]
  );

  return {
    notify,
    success,
    error,
    warning,
    info,
    dismiss: removeNotification,
  };
}

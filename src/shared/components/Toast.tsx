/**
 * Toast Notification System
 * Features: Portal rendering, queue management, auto-dismiss, animations
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";

// ============================================================================
// Types
// ============================================================================

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

export interface ToastOptions {
  duration?: number;
  dismissible?: boolean;
}

interface ToastContextValue {
  toast: {
    success: (message: string, options?: ToastOptions) => void;
    error: (message: string, options?: ToastOptions) => void;
    warning: (message: string, options?: ToastOptions) => void;
    info: (message: string, options?: ToastOptions) => void;
  };
  removeToast: (id: string) => void;
}

// ============================================================================
// Context
// ============================================================================

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// ============================================================================
// Toast Item Component
// ============================================================================

const TOAST_ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

const TOAST_COLORS: Record<ToastType, string> = {
  success:
    "bg-gradient-to-r from-emerald-600 to-green-600 border-emerald-500/50",
  error: "bg-gradient-to-r from-red-600 to-rose-600 border-red-500/50",
  warning: "bg-gradient-to-r from-amber-600 to-yellow-600 border-amber-500/50",
  info: "bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-500/50",
};

interface ToastItemProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastItemComponent: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  }, [onDismiss, toast.id]);

  useEffect(() => {
    if (toast.duration !== 0) {
      timerRef.current = setTimeout(handleDismiss, toast.duration || 4000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [handleDismiss, toast.duration]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-sm
        ${TOAST_COLORS[toast.type]}
        ${isExiting ? "animate-toast-exit" : "animate-toast-enter"}
        min-w-[280px] max-w-[400px]
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
        {TOAST_ICONS[toast.type]}
      </div>

      {/* Message */}
      <p className="flex-1 text-white text-sm font-medium">{toast.message}</p>

      {/* Dismiss Button */}
      {toast.dismissible !== false && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
};

// ============================================================================
// Toast Container (Portal)
// ============================================================================

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  if (typeof window === "undefined") return null;

  return createPortal(
    <div
      className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-2"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItemComponent
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>,
    document.body
  );
};

// ============================================================================
// Toast Provider
// ============================================================================

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (type: ToastType, message: string, options?: ToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const newToast: ToastItem = {
        id,
        type,
        message,
        duration: options?.duration,
        dismissible: options?.dismissible,
      };

      setToasts((prev) => {
        const updated = [...prev, newToast];
        // Limit max toasts
        if (updated.length > maxToasts) {
          return updated.slice(-maxToasts);
        }
        return updated;
      });
    },
    [maxToasts]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (message: string, options?: ToastOptions) =>
      addToast("success", message, options),
    error: (message: string, options?: ToastOptions) =>
      addToast("error", message, options),
    warning: (message: string, options?: ToastOptions) =>
      addToast("warning", message, options),
    info: (message: string, options?: ToastOptions) =>
      addToast("info", message, options),
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;

/**
 * Confirm Dialog Component
 * Features: Built on Modal, variants with icons, promise-based API
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import { Modal } from "./Modal";

// ============================================================================
// Types
// ============================================================================

export type ConfirmVariant = "danger" | "warning" | "info";

export interface ConfirmOptions {
  title: string;
  message: string;
  variant?: ConfirmVariant;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  resolve: ((value: boolean) => void) | null;
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

// ============================================================================
// Context
// ============================================================================

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};

// ============================================================================
// Variant Styles
// ============================================================================

const VARIANT_ICONS: Record<ConfirmVariant, string> = {
  danger: "🗑️",
  warning: "⚠️",
  info: "ℹ️",
};

const VARIANT_COLORS: Record<ConfirmVariant, string> = {
  danger: "from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500",
  warning:
    "from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500",
  info: "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500",
};

const VARIANT_ICON_BG: Record<ConfirmVariant, string> = {
  danger: "bg-red-500/20 text-red-400",
  warning: "bg-amber-500/20 text-amber-400",
  info: "bg-blue-500/20 text-blue-400",
};

// ============================================================================
// Confirm Dialog Component
// ============================================================================

interface ConfirmDialogProps {
  state: ConfirmState;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  state,
  onConfirm,
  onCancel,
}) => {
  const variant = state.variant || "warning";
  const icon = state.icon || VARIANT_ICONS[variant];

  return (
    <Modal
      isOpen={state.isOpen}
      onClose={onCancel}
      size="sm"
      showCloseButton={false}
    >
      <div className="text-center">
        {/* Icon */}
        <div
          className={`
            w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl
            ${VARIANT_ICON_BG[variant]}
            animate-bounce-once
          `}
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2">{state.title}</h3>

        {/* Message */}
        <p className="text-slate-400 mb-6">{state.message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium transition-all hover:scale-105"
          >
            {state.cancelText || "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            className={`
              px-5 py-2.5 rounded-xl bg-gradient-to-r text-white font-semibold
              transition-all hover:scale-105 shadow-lg
              ${VARIANT_COLORS[variant]}
            `}
          >
            {state.confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================================================
// Confirm Provider
// ============================================================================

interface ConfirmProviderProps {
  children: React.ReactNode;
}

const initialState: ConfirmState = {
  isOpen: false,
  title: "",
  message: "",
  resolve: null,
};

export const ConfirmProvider: React.FC<ConfirmProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<ConfirmState>(initialState);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        ...options,
        isOpen: true,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState(initialState);
  }, [state.resolve]);

  const handleCancel = useCallback(() => {
    state.resolve?.(false);
    setState(initialState);
  }, [state.resolve]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        state={state}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;

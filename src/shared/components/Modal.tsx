/**
 * Modal Component
 * Features: Portal rendering, animations, keyboard navigation, focus trap
 */

import React, { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

// ============================================================================
// Types
// ============================================================================

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

// ============================================================================
// Size Classes - Adjusted for better proportions
// ============================================================================

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
  full: "max-w-5xl",
};

// ============================================================================
// Modal Component
// ============================================================================

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEsc = true,
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const hasInitialFocus = useRef(false);

  // Handle ESC key - stable reference
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // Focus trap - only handle Tab key for cycling
  const handleTabKey = useCallback((e: KeyboardEvent) => {
    if (e.key !== "Tab" || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement?.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement?.focus();
    }
  }, []);

  // Manage scroll lock and focus trap event listener
  useEffect(() => {
    if (!isOpen) {
      hasInitialFocus.current = false;
      return;
    }

    previousActiveElement.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleTabKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleTabKey);
      // Restore focus when closing
      previousActiveElement.current?.focus();
    };
  }, [isOpen, handleTabKey]);

  // Initial focus - only once when modal opens
  useEffect(() => {
    if (!isOpen || hasInitialFocus.current) return;

    const timer = setTimeout(() => {
      // Focus on first input/textarea, not button
      const inputElement = modalRef.current?.querySelector(
        'input:not([type="hidden"]), textarea'
      ) as HTMLElement;

      if (inputElement) {
        inputElement.focus();
      } else {
        // Fallback to first focusable
        const firstFocusable = modalRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        firstFocusable?.focus();
      }

      hasInitialFocus.current = true;
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={`
          relative w-full ${SIZE_CLASSES[size]} 
          bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
          border border-slate-700/50 rounded-2xl shadow-2xl
          animate-scale-in max-h-[90vh] overflow-y-auto
          ${className}
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-bold text-white flex items-center gap-2"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                tabIndex={-1}
                className="ml-auto w-8 h-8 rounded-lg bg-slate-700/50 hover:bg-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;

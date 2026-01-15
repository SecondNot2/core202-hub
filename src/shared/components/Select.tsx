/**
 * Custom Select/Dropdown Component
 * Features: Purple gradient styling, keyboard navigation, animations
 */

import React, { useState, useRef, useEffect, useCallback } from "react";

// ============================================================================
// Types
// ============================================================================

export interface SelectOption<T = string> {
  value: T;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface SelectProps<T = string> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

// ============================================================================
// Select Component
// ============================================================================

export function Select<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  label,
  error,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            const option = options[highlightedIndex];
            if (!option.disabled) {
              onChange(option.value);
              setIsOpen(false);
            }
          } else {
            setIsOpen(true);
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              prev < options.length - 1 ? prev + 1 : 0
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : options.length - 1
            );
          }
          break;
      }
    },
    [disabled, isOpen, highlightedIndex, options, onChange]
  );

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  // Reset highlighted index when opening
  useEffect(() => {
    if (isOpen) {
      const selectedIndex = options.findIndex((opt) => opt.value === value);
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [isOpen, options, value]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm text-slate-400 mb-1.5">{label}</label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 rounded-xl text-left flex items-center justify-between
          bg-gradient-to-r from-slate-800/80 to-slate-700/80 
          border border-slate-600/50 
          hover:border-purple-500/50 hover:from-slate-700/80 hover:to-slate-600/80
          focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500
          transition-all duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${isOpen ? "ring-2 ring-purple-500/50 border-purple-500" : ""}
          ${error ? "border-red-500/50" : ""}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className={`flex items-center gap-2 ${
            selectedOption ? "text-white" : "text-slate-500"
          }`}
        >
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          {selectedOption?.label || placeholder}
        </span>
        <span
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Error Message */}
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}

      {/* Dropdown */}
      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          className={`
            absolute z-50 w-full mt-2 py-2 
            bg-gradient-to-b from-slate-800 to-slate-900
            border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/10
            max-h-60 overflow-auto
            animate-dropdown-enter
          `}
        >
          {options.map((option, index) => (
            <li
              key={String(option.value)}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                if (!option.disabled) {
                  onChange(option.value);
                  setIsOpen(false);
                }
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`
                px-4 py-2.5 flex items-center gap-2 cursor-pointer transition-all
                ${option.disabled ? "opacity-40 cursor-not-allowed" : ""}
                ${
                  highlightedIndex === index
                    ? "bg-purple-600/30 text-white"
                    : "text-slate-300 hover:bg-slate-700/50"
                }
                ${
                  option.value === value
                    ? "bg-purple-600/20 text-purple-300 font-medium"
                    : ""
                }
              `}
            >
              {option.icon && <span>{option.icon}</span>}
              <span>{option.label}</span>
              {option.value === value && (
                <span className="ml-auto text-purple-400">✓</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;

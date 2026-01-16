/**
 * GuidePage - RPG Guide/Documentation Page
 * Bilingual (VI/EN) with collapsible sections
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  guideContent,
  pageTitle,
  pageSubtitle,
  type Language,
  type GuideSection,
} from "./guideContent";

export const GuidePage: React.FC = () => {
  const [language, setLanguage] = useState<Language>("vi");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["attributes"])
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(guideContent.map((s) => s.id)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link
              to="/rpg"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 text-sm mb-2 inline-block transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-3xl">📖</span> {pageTitle[language]}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {pageSubtitle[language]}
            </p>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage("vi")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                language === "vi"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              🇻🇳 VI
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                language === "en"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              🇬🇧 EN
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {language === "vi" ? "Mở tất cả" : "Expand All"}
          </button>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <button
            onClick={collapseAll}
            className="px-3 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {language === "vi" ? "Thu gọn" : "Collapse All"}
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {guideContent.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              language={language}
              isExpanded={expandedSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Section Card Component
// ============================================================================

interface SectionCardProps {
  section: GuideSection;
  language: Language;
  isExpanded: boolean;
  onToggle: () => void;
}

const SectionCard: React.FC<SectionCardProps> = ({
  section,
  language,
  isExpanded,
  onToggle,
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = React.useState(0);

  React.useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [language, isExpanded]);

  return (
    <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{section.icon}</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {section.title[language]}
          </span>
        </div>
        <span
          className={`text-slate-400 transition-transform duration-300 ease-out ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Animated Content Container */}
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: isExpanded ? `${contentHeight + 32}px` : "0px",
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="px-4 pb-4 pt-0">
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <SimpleMarkdown content={section.content[language]} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Simple Markdown Renderer (No external deps)
// ============================================================================

const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let currentTable: string[][] = [];
  let inTable = false;
  let tableIndex = 0;

  const processLine = (line: string, index: number) => {
    const trimmed = line.trim();

    // Table row
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      // Skip separator row
      if (trimmed.includes("---")) {
        return null;
      }
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());
      if (!inTable) {
        inTable = true;
        currentTable = [];
      }
      currentTable.push(cells);
      return null;
    } else if (inTable) {
      // End of table
      inTable = false;
      const tableElement = renderTable(currentTable, tableIndex++);
      currentTable = [];
      elements.push(tableElement);
    }

    // Empty line
    if (!trimmed) {
      return <div key={index} className="h-2" />;
    }

    // Bold text with **
    const formatText = (text: string) => {
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong
              key={i}
              className="font-semibold text-slate-900 dark:text-white"
            >
              {part.slice(2, -2)}
            </strong>
          );
        }
        // Handle inline code
        const codeParts = part.split(/(`[^`]+`)/g);
        return codeParts.map((cp, j) => {
          if (cp.startsWith("`") && cp.endsWith("`")) {
            return (
              <code
                key={`${i}-${j}`}
                className="bg-slate-100 dark:bg-slate-700 px-1 rounded text-sm font-mono"
              >
                {cp.slice(1, -1)}
              </code>
            );
          }
          return cp;
        });
      });
    };

    // List item
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      return (
        <div
          key={index}
          className="flex gap-2 text-slate-600 dark:text-slate-300 text-sm"
        >
          <span>•</span>
          <span>{formatText(trimmed.slice(2))}</span>
        </div>
      );
    }

    // Warning/Note (⚠️)
    if (trimmed.startsWith("⚠️")) {
      return (
        <div
          key={index}
          className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg p-3 text-amber-700 dark:text-amber-300 text-sm"
        >
          {formatText(trimmed)}
        </div>
      );
    }

    // Regular paragraph
    return (
      <p key={index} className="text-slate-600 dark:text-slate-300 text-sm">
        {formatText(trimmed)}
      </p>
    );
  };

  const renderTable = (rows: string[][], key: number) => {
    if (rows.length === 0) return null;
    const [header, ...body] = rows;

    return (
      <div key={`table-${key}`} className="overflow-x-auto my-3">
        <table className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-700">
              {header.map((cell, i) => (
                <th
                  key={i}
                  className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-600"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-slate-100 dark:border-slate-700 last:border-0"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-3 py-2 text-slate-600 dark:text-slate-300"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  lines.forEach((line, index) => {
    const element = processLine(line, index);
    if (element) {
      elements.push(element);
    }
  });

  // Flush remaining table
  if (inTable && currentTable.length > 0) {
    elements.push(renderTable(currentTable, tableIndex));
  }

  return <div className="space-y-2">{elements}</div>;
};

'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to light parchment theme' : 'Switch to dark sanctuary theme'}
      title={isDark ? 'Parchment mode (Light)' : 'Sanctuary mode (Dark)'}
      className={`inline-flex items-center gap-2 p-1.5 rounded-lg border border-[#e2ddd3] dark:border-[#262a36] bg-[#f2efe8] dark:bg-[#151720] hover:bg-[#eae5da] dark:hover:bg-[#1d212c] text-[#6b6456] dark:text-[#9ea3b2] hover:text-[#1c1e24] dark:hover:text-[#f4f2ed] transition-colors ${className}`}
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-[#bfa472] transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-[#5e584d] transition-transform duration-200 hover:-rotate-12" />
      )}
      {showLabel && (
        <span className="text-[11px] font-mono tracking-wider">
          {isDark ? 'Parchment' : 'Sanctuary'}
        </span>
      )}
    </button>
  );
}

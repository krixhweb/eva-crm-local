import React from 'react';
import { cn } from '../../lib/utils';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { toggleDarkMode } from '../../store/uiSlice';

/**
 * ThemeToggle
 * - Toggles the `dark` class on `document.documentElement`
 * - Persists the user's preference in `localStorage` under `theme`
 * - Exports a named `ThemeToggle` component (TopNavBar imports this)
 */
export const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state: RootState) => state.ui.isDarkMode);

  return (
    <button
      onClick={() => {
        console.debug('[ThemeToggle] click - current isDark:', isDark);
        dispatch(toggleDarkMode());
      }}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light' : 'Switch to dark'}
      className={cn(
        'w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition',
      )}
    >
      {isDark ? (
        // Sun icon (light mode)
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
          <path d="M12 4.5a.75.75 0 01.75-.75h0a.75.75 0 010 1.5H12.75A.75.75 0 0112 4.5zM12 19.5a.75.75 0 01.75-.75h0a.75.75 0 010 1.5H12.75A.75.75 0 0112 19.5zM4.5 12a.75.75 0 01-.75-.75h0a.75.75 0 011.5 0V11.25A.75.75 0 014.5 12zM19.5 12a.75.75 0 01-.75-.75h0a.75.75 0 011.5 0V11.25A.75.75 0 0119.5 12zM6.72 6.72a.75.75 0 010-1.06h0a.75.75 0 011.06 0l.53.53a.75.75 0 11-1.06 1.06l-.53-.53zM16.69 16.69a.75.75 0 010-1.06h0a.75.75 0 011.06 0l.53.53a.75.75 0 11-1.06 1.06l-.53-.53zM6.72 17.28a.75.75 0 011.06 0h0a.75.75 0 010 1.06l-.53.53a.75.75 0 11-1.06-1.06l.53-.53zM16.69 7.31a.75.75 0 011.06 0h0a.75.75 0 010 1.06l-.53.53a.75.75 0 11-1.06-1.06l.53-.53zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
        </svg>
      ) : (
        // Moon icon (dark mode)
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-700 dark:text-gray-200">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
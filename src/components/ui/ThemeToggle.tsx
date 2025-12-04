
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../../store/uiSlice';
import type { RootState } from '../../store/store';
import { Icon } from '../shared/Icon';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch = useDispatch();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => dispatch(toggleDarkMode())}
      className={cn(
        "rounded-full w-10 h-10 transition-all duration-300 ease-in-out",
        "hover:bg-gray-100 dark:hover:bg-white/10",
        "text-gray-500 dark:text-gray-400",
        className
      )}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="relative w-5 h-5">
        <Icon 
          name="sun" 
          className={cn(
            "absolute inset-0 w-5 h-5 transition-all duration-300 transform",
            isDarkMode ? "opacity-100 rotate-0" : "opacity-0 -rotate-90 scale-50"
          )} 
        />
        <Icon 
          name="moon" 
          className={cn(
            "absolute inset-0 w-5 h-5 transition-all duration-300 transform",
            !isDarkMode ? "opacity-100 rotate-0" : "opacity-0 rotate-90 scale-50"
          )} 
        />
      </div>
    </Button>
  );
};

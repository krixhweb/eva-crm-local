/**
 * Theme Animation Utilities
 * Handles smooth transitions between light and dark modes
 */

/**
 * Injects theme transition styles into the document
 * Call this once when your app initializes
 */
export const injectThemeTransitions = () => {
  // Check if styles already exist
  if (document.getElementById('theme-transitions')) return;

  const style = document.createElement('style');
  style.id = 'theme-transitions';
  style.textContent = `
    /* Smooth transitions for theme changes */
    html {
      transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    }

    /* Disable transitions on initial load */
    html.no-transition,
    html.no-transition *,
    html.no-transition *::before,
    html.no-transition *::after {
      transition: none !important;
    }

    /* Apply smooth transitions to all elements when theme changes */
    html:not(.no-transition) * {
      transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
      transition-duration: 0.3s;
      transition-timing-function: ease-in-out;
    }

    /* Preserve specific transitions for interactive elements */
    html:not(.no-transition) button,
    html:not(.no-transition) a,
    html:not(.no-transition) input,
    html:not(.no-transition) [role="button"] {
      transition: background-color 0.2s ease-in-out, 
                  border-color 0.2s ease-in-out, 
                  color 0.2s ease-in-out,
                  transform 0.15s ease-in-out,
                  box-shadow 0.2s ease-in-out,
                  opacity 0.2s ease-in-out;
    }

    /* Smooth background transitions for cards and surfaces */
    html:not(.no-transition) [class*="bg-"],
    html:not(.no-transition) [class*="dark:bg-"] {
      transition: background-color 0.35s ease-in-out;
    }

    /* Smooth border transitions */
    html:not(.no-transition) [class*="border"],
    html:not(.no-transition) [class*="dark:border"] {
      transition: border-color 0.3s ease-in-out;
    }

    /* Smooth text color transitions */
    html:not(.no-transition) [class*="text-"],
    html:not(.no-transition) [class*="dark:text-"] {
      transition: color 0.3s ease-in-out;
    }

    /* Preserve animation classes */
    html:not(.no-transition) [class*="animate-"],
    html:not(.no-transition) [class*="transition-"] {
      transition: var(--tw-transition-property, all) var(--tw-transition-duration, 150ms) var(--tw-transition-timing-function, cubic-bezier(0.4, 0, 0.2, 1));
    }

    /* Smooth shadow transitions */
    html:not(.no-transition) [class*="shadow"],
    html:not(.no-transition) [class*="dark:shadow"] {
      transition: box-shadow 0.3s ease-in-out;
    }
  `;

  document.head.appendChild(style);
};

/**
 * Disables transitions temporarily (useful for initial theme load)
 */
export const disableTransitions = () => {
  document.documentElement.classList.add('no-transition');
};

/**
 * Re-enables transitions after a brief delay
 */
export const enableTransitions = () => {
  // Use requestAnimationFrame to ensure the DOM has updated
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('no-transition');
    });
  });
};

/**
 * Applies theme class with optional transition control
 * @param isDark - Whether dark mode should be enabled
 * @param animated - Whether to animate the transition (default: true)
 */
export const applyTheme = (isDark: boolean, animated: boolean = true) => {
  if (!animated) {
    disableTransitions();
  }

  document.documentElement.classList.toggle('dark', isDark);

  if (!animated) {
    enableTransitions();
  }
};

/**
 * Initializes theme from localStorage and applies it
 * @param defaultTheme - Default theme if none is stored ('light' or 'dark')
 * @returns The applied theme ('light' or 'dark')
 */
export const initializeTheme = (defaultTheme: 'light' | 'dark' = 'light'): 'light' | 'dark' => {
  try {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const theme = stored || defaultTheme;
    const isDark = theme === 'dark';

    // Apply without animation on initial load
    applyTheme(isDark, false);

    return theme;
  } catch (e) {
    console.error('[Theme] Failed to initialize:', e);
    return defaultTheme;
  }
};

/**
 * Persists theme preference to localStorage
 * @param theme - Theme to persist ('light' or 'dark')
 */
export const persistTheme = (theme: 'light' | 'dark') => {
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {
    console.error('[Theme] Failed to persist:', e);
  }
};

/**
 * Gets the current theme from the DOM
 * @returns Current theme ('light' or 'dark')
 */
export const getCurrentTheme = (): 'light' | 'dark' => {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

/**
 * Toggles between light and dark themes
 * @param animated - Whether to animate the transition (default: true)
 * @returns The new theme after toggling
 */
export const toggleTheme = (animated: boolean = true): 'light' | 'dark' => {
  const current = getCurrentTheme();
  const newTheme = current === 'dark' ? 'light' : 'dark';
  
  applyTheme(newTheme === 'dark', animated);
  persistTheme(newTheme);
  
  return newTheme;
};
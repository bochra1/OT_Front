import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

/**
 * ThemeProvider component for managing Tunisie Telecom theme
 * Provides theme state and toggle function to child components
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('tt-theme');
    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'tt_dark' : 'tt_light';
  });

  const [mounted, setMounted] = useState(false);

  // Apply theme to DOM when it changes or on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tt-theme', theme);
    setMounted(true);
  }, [theme]);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'tt_light' ? 'tt_dark' : 'tt_light'));
  };

  // Set specific theme
  const setSpecificTheme = (themeName) => {
    if (themeName === 'tt_light' || themeName === 'tt_dark') {
      setTheme(themeName);
    }
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme: setSpecificTheme,
        isDarkMode: theme === 'tt_dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use theme context
 * Must be used within ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

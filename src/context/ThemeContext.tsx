import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our context
interface ThemeContextProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextProps>({
  darkMode: false,
  toggleTheme: () => {},
});

// Props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Initialize theme from localStorage if available
  useEffect(() => {
    const savedTheme = localStorage.getItem('kidzTeamTheme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Update localStorage and apply theme class to body when theme changes
  useEffect(() => {
    localStorage.setItem('kidzTeamTheme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  const toggleTheme = (): void => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => useContext(ThemeContext);

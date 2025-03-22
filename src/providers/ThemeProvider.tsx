
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'dark', // Explicitly set dark mode as default
  storageKey = 'property-pro-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous class
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      
      root.classList.add(systemTheme);
      
      // Also add the theme-mono-scaled class for consistent font styling
      root.classList.add('theme-mono-scaled');
      return;
    }

    root.classList.add(theme);
    
    // Add the theme-mono-scaled class for consistent font styling
    root.classList.add('theme-mono-scaled');
    
    // Force dark mode application
    if (theme === 'dark') {
      // Force dark mode by setting CSS variables directly
      document.body.style.setProperty('--background', '#161920');
      document.body.style.setProperty('--card', '#1e2028');
      document.body.style.setProperty('--sidebar-background', '#1f2128');
      console.log("Setting dark mode with explicit background color: #161920");
    } else {
      // Reset any directly set properties
      document.body.style.removeProperty('--background');
      document.body.style.removeProperty('--card');
      document.body.style.removeProperty('--sidebar-background');
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

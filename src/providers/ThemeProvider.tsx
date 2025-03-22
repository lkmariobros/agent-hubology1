
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
      root.classList.add('theme-mono-scaled');
      
      // Force dark mode application in system theme too
      if (systemTheme === 'dark') {
        applyDarkModeStyles();
      } else {
        resetCustomStyles();
      }
      return;
    }

    root.classList.add(theme);
    root.classList.add('theme-mono-scaled');
    
    // Apply dark mode specific styles
    if (theme === 'dark') {
      applyDarkModeStyles();
    } else {
      resetCustomStyles();
    }
  }, [theme]);
  
  // Function to apply dark mode styles
  const applyDarkModeStyles = () => {
    // Set background colors
    document.body.style.setProperty('--background', '#161920');
    document.body.style.setProperty('--card', '#1e2028');
    document.body.style.setProperty('--sidebar-background', '#1f2128');
    
    // Set text colors
    document.body.style.setProperty('--foreground', '#f5f5f7');
    document.body.style.setProperty('--card-foreground', '#f5f5f7');
    document.body.style.setProperty('--sidebar-foreground', '#f5f5f7');
    
    // Apply dark styles to body for inheritance
    document.body.classList.add('dark-applied');
    
    console.log("Applied dark mode with proper styling");
  };
  
  // Function to reset custom styles
  const resetCustomStyles = () => {
    document.body.style.removeProperty('--background');
    document.body.style.removeProperty('--card');
    document.body.style.removeProperty('--sidebar-background');
    document.body.style.removeProperty('--foreground');
    document.body.style.removeProperty('--card-foreground');
    document.body.style.removeProperty('--sidebar-foreground');
    document.body.classList.remove('dark-applied');
  };

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

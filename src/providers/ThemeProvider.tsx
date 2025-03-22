
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
  defaultTheme = 'dark', // Dark mode as default
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
      
      // Apply custom theme class
      root.classList.add('theme-mono-scaled');
      
      if (systemTheme === 'dark') {
        applyDarkModeStyles();
      } else {
        resetCustomStyles();
      }
      return;
    }

    root.classList.add(theme);
    root.classList.add('theme-mono-scaled');
    
    if (theme === 'dark') {
      applyDarkModeStyles();
    } else {
      resetCustomStyles();
    }
  }, [theme]);
  
  // Enhanced dark mode style application with InnovaCraft design colors
  const applyDarkModeStyles = () => {
    // Main background - InnovaCraft content background
    document.body.style.setProperty('--background', '#161920');
    
    // Card and container backgrounds - InnovaCraft card background
    document.body.style.setProperty('--card', '#1E2128');
    
    // Sidebar background - InnovaCraft sidebar background
    document.body.style.setProperty('--sidebar-background', '#1F232D');
    
    // Text colors for maximum readability
    document.body.style.setProperty('--foreground', '#f8f9fa');
    document.body.style.setProperty('--card-foreground', '#f8f9fa');
    document.body.style.setProperty('--sidebar-foreground', '#f8f9fa');
    
    // Muted colors for secondary text
    document.body.style.setProperty('--muted-foreground', '#a1a1aa');
    
    // Border colors
    document.body.style.setProperty('--border', 'rgba(255, 255, 255, 0.06)');
    
    // Input field colors
    document.body.style.setProperty('--input', '#252830');
    document.body.style.setProperty('--ring', '#3e4251');
    
    // Apply dark styles to body for inheritance
    document.body.classList.add('dark-applied');
    
    console.log("Applied InnovaCraft dark mode styling");
  };
  
  const resetCustomStyles = () => {
    document.body.style.removeProperty('--background');
    document.body.style.removeProperty('--card');
    document.body.style.removeProperty('--sidebar-background');
    document.body.style.removeProperty('--foreground');
    document.body.style.removeProperty('--card-foreground');
    document.body.style.removeProperty('--sidebar-foreground');
    document.body.style.removeProperty('--muted-foreground');
    document.body.style.removeProperty('--border');
    document.body.style.removeProperty('--input');
    document.body.style.removeProperty('--ring');
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

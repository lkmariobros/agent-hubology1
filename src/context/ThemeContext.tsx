
import React from 'react';
import { ThemeProvider as ActualThemeProvider, useTheme } from '@/providers/ThemeProvider';

// Re-export the theme provider and hook
export { ActualThemeProvider as ThemeProvider, useTheme };

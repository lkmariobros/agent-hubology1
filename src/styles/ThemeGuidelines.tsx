
import React from 'react';

/**
 * Theme Guidelines
 * 
 * This file serves as a central reference for styling decisions
 * across the application. Use these constants and examples to
 * maintain consistent styling in all components.
 */

// Dark Mode Color Palette
export const DarkColors = {
  // Backgrounds
  mainBackground: "#121319",       // Darkest - Main application background
  cardBackground: "#1a1d25",       // Dark - Card backgrounds, alerts, etc.
  secondaryBackground: "#1e2028",  // Slightly lighter - Secondary elements
  
  // Borders & Dividers
  border: "rgba(255,255,255,0.08)",
  divider: "rgba(255,255,255,0.06)",
  
  // Text Colors
  primaryText: "#f8f9fa",         // Primary text - headings, important content
  secondaryText: "#a1a1aa",       // Secondary text - descriptions, muted text
  
  // Status Colors
  success: "#10b981",             // Success - Emerald 500
  warning: "#f59e0b",             // Warning - Amber 500
  danger: "#ef4444",              // Danger - Red 500
  info: "#3b82f6",                // Info - Blue 500
  active: "#10b981",              // Active - Same as success
  inactive: "rgba(255,255,255,0.15)", // Inactive - Transparent white
  
  // Special UI Elements
  focus: "#3e4251",               // Focus rings
  inputBackground: "#252830",     // Input fields background
};

// Typography Scale
export const Typography = {
  // Headings
  h1: "text-2xl font-bold tracking-tight",
  h2: "text-xl font-semibold tracking-tight",
  h3: "text-lg font-medium tracking-tight",
  h4: "text-base font-medium tracking-tight",
  
  // Body Text
  body: "text-base",
  bodySmall: "text-sm",
  bodyTiny: "text-xs",
  
  // Special Text
  muted: "text-sm text-muted-foreground",
  label: "text-xs uppercase tracking-wider text-muted-foreground font-medium",
};

// Spacing System
export const Spacing = {
  cardPadding: "p-6",
  cardHeaderPadding: "p-6", 
  cardContentPadding: "p-6 pt-0",
  cardFooterPadding: "p-6 pt-0",
  
  // Standard spacing between elements
  spaceXS: "space-y-2",
  spaceSM: "space-y-3",
  spaceMD: "space-y-4",
  spaceLG: "space-y-6",
};

// Component Style Guidelines
export const ComponentStyles = {
  // Card Styling
  card: "rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1d25] text-white shadow-sm",
  
  // Alert Styling
  alert: "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  alertDefault: "bg-[#1a1d25] border-[rgba(255,255,255,0.08)] text-white",
  alertDestructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
  
  // Badge Styling
  badge: "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  
  // MetricCard Styling
  metricCard: "border-[rgba(255,255,255,0.08)] bg-[#1a1d25] shadow-sm",
  
  // Input Styling
  input: "flex h-10 w-full rounded-md border border-input bg-[#252830] px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
};

// Usage Examples
const ThemeGuidelines: React.FC = () => {
  return (
    <div style={{ display: 'none' }}>
      {/* This component is not meant to be rendered, but serves as documentation */}
      
      {/* Example Card */}
      <div className={ComponentStyles.card}>
        <div className={Spacing.cardHeaderPadding}>
          <h3 className={Typography.h3}>Card Title</h3>
          <p className={Typography.muted}>Card description</p>
        </div>
        <div className={Spacing.cardContentPadding}>
          <p className={Typography.body}>Card content</p>
        </div>
      </div>
      
      {/* Example Alert */}
      <div className={`${ComponentStyles.alert} ${ComponentStyles.alertDefault}`}>
        <p className={Typography.h4}>Alert Title</p>
        <p className={Typography.bodySmall}>Alert content</p>
      </div>
      
      {/* Example Badge */}
      <span className={ComponentStyles.badge}>Badge</span>
      
      {/* Example Input */}
      <input className={ComponentStyles.input} placeholder="Input" />
    </div>
  );
};

export default ThemeGuidelines;

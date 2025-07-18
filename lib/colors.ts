/**
 * CroweOS Official Brand Colors
 * Updated color palette for consistent branding across the platform
 */

export const croweosColors = {
  white: '#F8F7F2',    // Mycelial White – Primary background
  bone: '#E3DED5',     // Bone – UI panels, cards
  gold: '#C6A351',     // Deep Gold – Accent highlights
  lilac: '#AAA3BF',    // Subtle Lilac – Input states, muted links
  charcoal: '#17141E', // Obsidian Charcoal – Base text, borders
  ash: '#2A2730',      // Ash – Panels, modals, hover surfaces
} as const;

/**
 * Color utility functions for consistent theming
 */
export const colorUtils = {
  // Primary backgrounds
  primaryBg: croweosColors.white,
  secondaryBg: croweosColors.bone,
  darkBg: croweosColors.ash,
  
  // Text colors
  primaryText: croweosColors.charcoal,
  mutedText: croweosColors.lilac,
  
  // Accent colors
  accent: croweosColors.gold,
  
  // State colors
  hover: croweosColors.bone,
  active: croweosColors.ash,
  
  // CSS custom properties for dynamic theming
  cssVars: {
    '--croweos-white': croweosColors.white,
    '--croweos-bone': croweosColors.bone,
    '--croweos-gold': croweosColors.gold,
    '--croweos-lilac': croweosColors.lilac,
    '--croweos-charcoal': croweosColors.charcoal,
    '--croweos-ash': croweosColors.ash,
  }
} as const;

/**
 * Tailwind CSS class utilities for CroweOS colors
 */
export const croweosClasses = {
  // Background classes
  bg: {
    white: 'bg-croweos-white',
    bone: 'bg-croweos-bone',
    gold: 'bg-croweos-gold',
    lilac: 'bg-croweos-lilac',
    charcoal: 'bg-croweos-charcoal',
    ash: 'bg-croweos-ash',
  },
  
  // Text classes
  text: {
    white: 'text-croweos-white',
    bone: 'text-croweos-bone',
    gold: 'text-croweos-gold',
    lilac: 'text-croweos-lilac',
    charcoal: 'text-croweos-charcoal',
    ash: 'text-croweos-ash',
  },
  
  // Border classes
  border: {
    white: 'border-croweos-white',
    bone: 'border-croweos-bone',
    gold: 'border-croweos-gold',
    lilac: 'border-croweos-lilac',
    charcoal: 'border-croweos-charcoal',
    ash: 'border-croweos-ash',
  },
  
  // Hover states
  hover: {
    bg: {
      white: 'hover:bg-croweos-white',
      bone: 'hover:bg-croweos-bone',
      gold: 'hover:bg-croweos-gold',
      lilac: 'hover:bg-croweos-lilac',
      charcoal: 'hover:bg-croweos-charcoal',
      ash: 'hover:bg-croweos-ash',
    },
    text: {
      white: 'hover:text-croweos-white',
      bone: 'hover:text-croweos-bone',
      gold: 'hover:text-croweos-gold',
      lilac: 'hover:text-croweos-lilac',
      charcoal: 'hover:text-croweos-charcoal',
      ash: 'hover:text-croweos-ash',
    }
  }
} as const;

/**
 * Theme presets for common UI patterns
 */
export const croweosThemes = {
  // Light theme (default)
  light: {
    background: croweosColors.white,
    surface: croweosColors.bone,
    primary: croweosColors.gold,
    secondary: croweosColors.lilac,
    text: croweosColors.charcoal,
    textMuted: croweosColors.lilac,
  },
  
  // Dark theme
  dark: {
    background: croweosColors.charcoal,
    surface: croweosColors.ash,
    primary: croweosColors.gold,
    secondary: croweosColors.lilac,
    text: croweosColors.white,
    textMuted: croweosColors.bone,
  },
  
  // High contrast theme
  contrast: {
    background: croweosColors.white,
    surface: croweosColors.bone,
    primary: croweosColors.charcoal,
    secondary: croweosColors.ash,
    text: croweosColors.charcoal,
    textMuted: croweosColors.ash,
  }
} as const;

export type CroweosColor = keyof typeof croweosColors;
export type CroweosTheme = keyof typeof croweosThemes;

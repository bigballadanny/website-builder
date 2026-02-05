/**
 * Pre-built Color Schemes for Pocket Marketer
 * Users can select these for quick, professional results
 */

export interface ColorScheme {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textMuted: string;
    border: string;
  };
  isDark: boolean;
}

export const colorSchemes: ColorScheme[] = [
  // Dark Themes
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Professional dark theme with blue accents',
    colors: {
      background: '#0a1628',
      surface: '#132743',
      primary: '#3b82f6',
      secondary: '#1e3a5f',
      accent: '#60a5fa',
      text: '#ffffff',
      textMuted: '#94a3b8',
      border: '#1e3a5f',
    },
    isDark: true,
  },
  {
    id: 'dark-emerald',
    name: 'Dark Emerald',
    description: 'Elegant dark with green accents',
    colors: {
      background: '#0f1714',
      surface: '#1a2e26',
      primary: '#10b981',
      secondary: '#134e4a',
      accent: '#34d399',
      text: '#ffffff',
      textMuted: '#9ca3af',
      border: '#1f3d35',
    },
    isDark: true,
  },
  {
    id: 'dark-purple',
    name: 'Dark Purple',
    description: 'Modern dark with purple vibes',
    colors: {
      background: '#13111c',
      surface: '#1e1a2e',
      primary: '#8b5cf6',
      secondary: '#2e2654',
      accent: '#a78bfa',
      text: '#ffffff',
      textMuted: '#a1a1aa',
      border: '#2e2654',
    },
    isDark: true,
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    description: 'Sleek neutral dark theme',
    colors: {
      background: '#171717',
      surface: '#262626',
      primary: '#f97316',
      secondary: '#404040',
      accent: '#fb923c',
      text: '#ffffff',
      textMuted: '#a3a3a3',
      border: '#404040',
    },
    isDark: true,
  },

  // Light Themes
  {
    id: 'clean-white',
    name: 'Clean White',
    description: 'Classic light professional look',
    colors: {
      background: '#ffffff',
      surface: '#f8fafc',
      primary: '#2563eb',
      secondary: '#e2e8f0',
      accent: '#3b82f6',
      text: '#0f172a',
      textMuted: '#64748b',
      border: '#e2e8f0',
    },
    isDark: false,
  },
  {
    id: 'warm-light',
    name: 'Warm Light',
    description: 'Soft, welcoming light theme',
    colors: {
      background: '#fefdf9',
      surface: '#faf8f3',
      primary: '#d97706',
      secondary: '#fef3c7',
      accent: '#f59e0b',
      text: '#1c1917',
      textMuted: '#78716c',
      border: '#e7e5e4',
    },
    isDark: false,
  },
  {
    id: 'fresh-green',
    name: 'Fresh Green',
    description: 'Light theme with nature vibes',
    colors: {
      background: '#f0fdf4',
      surface: '#ffffff',
      primary: '#16a34a',
      secondary: '#dcfce7',
      accent: '#22c55e',
      text: '#14532d',
      textMuted: '#6b7280',
      border: '#d1fae5',
    },
    isDark: false,
  },
  {
    id: 'cool-slate',
    name: 'Cool Slate',
    description: 'Modern light with cool tones',
    colors: {
      background: '#f8fafc',
      surface: '#ffffff',
      primary: '#6366f1',
      secondary: '#e0e7ff',
      accent: '#818cf8',
      text: '#1e1b4b',
      textMuted: '#64748b',
      border: '#e2e8f0',
    },
    isDark: false,
  },
];

export const fontOptions = [
  { id: 'inter', name: 'Inter', family: 'Inter, system-ui, sans-serif', style: 'Modern & Clean' },
  { id: 'roboto', name: 'Roboto', family: 'Roboto, sans-serif', style: 'Professional' },
  { id: 'poppins', name: 'Poppins', family: 'Poppins, sans-serif', style: 'Friendly & Bold' },
  { id: 'open-sans', name: 'Open Sans', family: '"Open Sans", sans-serif', style: 'Readable' },
  { id: 'lato', name: 'Lato', family: 'Lato, sans-serif', style: 'Elegant' },
  { id: 'montserrat', name: 'Montserrat', family: 'Montserrat, sans-serif', style: 'Strong & Modern' },
  { id: 'playfair', name: 'Playfair Display', family: '"Playfair Display", serif', style: 'Luxury' },
  { id: 'system', name: 'System Default', family: 'system-ui, -apple-system, sans-serif', style: 'Fast Loading' },
];

export function getSchemeById(id: string): ColorScheme | undefined {
  return colorSchemes.find((s) => s.id === id);
}

export function getFontById(id: string) {
  return fontOptions.find((f) => f.id === id);
}

/**
 * Generate Tailwind config snippet for a color scheme
 */
export function schemeToTailwindConfig(scheme: ColorScheme): string {
  return `
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'pm-bg': '${scheme.colors.background}',
        'pm-surface': '${scheme.colors.surface}',
        'pm-primary': '${scheme.colors.primary}',
        'pm-secondary': '${scheme.colors.secondary}',
        'pm-accent': '${scheme.colors.accent}',
        'pm-text': '${scheme.colors.text}',
        'pm-muted': '${scheme.colors.textMuted}',
        'pm-border': '${scheme.colors.border}',
      }
    }
  }
}`;
}

/**
 * No Fat Community Theme
 * Modern light theme with fitness accents (2025)
 */

export const theme = {
  colors: {
    // Primary fitness colors
    primary: '#6FCF97',
    primaryDark: '#219653',
    secondary: '#F2F2F2',
    
    // Text
    text: '#333333',
    textSecondary: '#666666',
    textLight: '#999999',
    
    // Backgrounds
    background: '#FFFFFF',
    backgroundSecondary: '#F8F8F8',
    
    // Accents
    success: '#6FCF97',
    warning: '#FFA726',
    error: '#EF5350',
    
    // Semi-transparent for glass morphism
    glass: 'rgba(255, 255, 255, 0.7)',
    glassDark: 'rgba(111, 207, 151, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.3)',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 9999,
    round: 50,
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    bodyBold: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 18,
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  // Animations
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
} as const;

export type Theme = typeof theme;


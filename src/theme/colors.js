// Tunisie Telecom Theme Colors Configuration
// This mirrors the Tailwind config colors for easy import in components

export const colors = {
  // Primary Orange Colors
  primary: {
    50: '#FFF9E6',
    100: '#FFF3CC',
    200: '#FFE699',
    300: '#FFD966',
    400: '#FFCC33',
    500: '#FFC000', // Main Orange/Gold
    600: '#E6AE00',
    700: '#CC9900',
    800: '#B38600',
    900: '#997300',
  },

  // Secondary Blue Colors
  secondary: {
    50: '#F0F4FB',
    100: '#E1E8F7',
    200: '#C3D1EF',
    300: '#A5BAE7',
    400: '#8703DF',
    500: '#1c5576', // Deep Blue
    600: '#00326A',
    700: '#00275A',
    800: '#001F4A',
    900: '#00173A',
  },

  // Accent Gray Colors
  accent: {
    50: '#F5F5F5',
    100: '#E8E8E8',
    200: '#D1D1D1',
    300: '#B9B9B9',
    400: '#A1A1A1',
    500: '#808080', // Gray
    600: '#666666',
    700: '#4D4D4D',
    800: '#333333',
    900: '#1A1A1A',
  },

  // Danger/Error Red Colors
  danger: {
    50: '#FEE2E2',
    100: '#FECACA',
    200: '#FCA5A5',
    300: '#F87171',
    400: '#F87171',
    500: '#EF4444', // Main Red
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Success/Green Colors
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBEF5D',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Main Green
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#145231',
  },
};

// Theme Gradients
export const gradients = {
  // Blue gradient (secondary to secondary dark)
  blueDark: 'linear-gradient(135deg, #003D7A 0%, #00275A 100%)',
  // Orange to Blue
  primary: 'linear-gradient(135deg, #FF6B00 0%, #003D7A 100%)',
  // Blue to Orange
  primaryReverse: 'linear-gradient(135deg, #003D7A 0%, #FF6B00 100%)',
};

// Theme Shadows
export const shadows = {
  ttLg: '0 20px 25px -5px rgba(255, 107, 0, 0.1)',
  ttMd: '0 10px 15px -3px rgba(0, 61, 122, 0.1)',
};

// Reusable Component Styles
export const themeStyles = {
  // Navbar styles
  navbar: {
    container: {
      backgroundColor: '#ffffff',
      borderBottom: `4px solid ${colors.secondary[500]}`,
      boxShadow: shadows.ttMd,
    },
  },

  // Button styles
  button: {
    primary: {
      backgroundColor: 'transparent',
      color: '#0c0c0c',
      padding: '0.6rem 1rem',
      borderRadius: '0.5rem',
      border: `2px solid ${colors.secondary[500]}`,
      cursor: 'pointer',
      fontWeight: '500',
 
      boxShadow: 'none',
    },
    primaryHover: {
      backgroundColor: colors.secondary[500],
      color: '#ffffff',
      borderColor: colors.secondary[700],
      boxShadow: '0 8px 20px rgba(0, 61, 122, 0.25)',
    },
    danger: {
      backgroundColor: colors.danger[500],
      color: '#ffffff',
      padding: '0.6rem 1rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      willChange: 'background-color, transform, box-shadow',
      transform: 'translateY(0) scale(1)',
    },
    dangerHover: {
      backgroundColor: colors.danger[700],
      boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)',
    },
  },

  // Card styles
  card: {
    border: `4px solid ${colors.secondary[500]}`,
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    boxShadow: shadows.ttMd,
    transition: 'box-shadow 0.3s ease',
  },

  cardHover: {
    boxShadow: shadows.ttLg,
  },

  // Text/Heading styles
  heading: {
    color: colors.secondary[500],
    fontWeight: '900',
  },

  // Badge/Badge styles
  badge: {
    backgroundColor: colors.secondary[100],
    color: colors.secondary[500],
    padding: '0.5rem',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  // Hero cards
  heroCard: {
    background: gradients.blueDark,
    color: '#ffffff',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    boxShadow: shadows.ttMd,
  },
};

// Utility functions for common patterns
export const getButtonStyle = (variant = 'primary') => {
  if (variant === 'primary') {
    return themeStyles.button.primary;
  }
  return themeStyles.button.primary;
};

export const getCardStyle = () => {
  return themeStyles.card;
};

export const getHeadingStyle = () => {
  return themeStyles.heading;
};

export default {
  colors,
  gradients,
  shadows,
  themeStyles,
  getButtonStyle,
  getCardStyle,
  getHeadingStyle,
};

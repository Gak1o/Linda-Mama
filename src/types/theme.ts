// Custom theme type definitions for the app

// Define our custom theme colors
export type CustomThemeColors = {
  primary: string;
  secondary: string;
  tertiary: string;
  background: string;
  surface: string;
  error: string;
  onSurface: string;
  backdrop: string;
  notification: string;
  // Custom colors
  gradientStart: string;
  gradientEnd: string;
  cardBackground: string;
  success: string;
  warning: string;
  placeholder: string;
  text: string;
};

// Define our custom theme
export type CustomTheme = {
  colors: CustomThemeColors;
  // Add other theme properties as needed
};

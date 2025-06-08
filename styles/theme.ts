import { StyleSheet } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const colors = {
  light: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    text: '#11181C',
    textSecondary: '#687076',
    border: '#E5E5EA',
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#151718',
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    border: '#2A2A2A',
    success: '#30D158',
    error: '#FF453A',
    warning: '#FF9F0A',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
  },
};

export const createStyles = (isDark: boolean) => {
  const themeColors = isDark ? colors.dark : colors.light;
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    card: {
      backgroundColor: themeColors.background,
      borderRadius: 12,
      padding: spacing.md,
      marginVertical: spacing.sm,
      shadowColor: themeColors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    input: {
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: 8,
      padding: spacing.sm,
      fontSize: 16,
      color: themeColors.text,
      backgroundColor: themeColors.background,
    },
    button: {
      backgroundColor: themeColors.primary,
      padding: spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: themeColors.background,
      fontSize: 16,
      fontWeight: '600',
    },
  });
}; 
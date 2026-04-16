import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

// ─────────────────────────────────────────────────────────────
//  LIGHT MODE  —  Deep Navy · Electric Amber · Warm Cream
//  Professional, premium hardware-store aesthetic
// ─────────────────────────────────────────────────────────────
const lightPalette = {
  // Backgrounds
  background:        '#F5F4F0',
  surface:           '#FFFFFF',
  surfaceSecondary:  '#EEF0F5',
  surfaceTertiary:   '#1B2A4A',

  // Text
  text:              '#0F1B2D',
  textSecondary:     '#4A5568',
  textInverse:       '#FFFFFF',

  // Brand Colors
  primary:           '#1B2A4A',
  primaryLight:      '#2C3E6B',
  accent:            '#F59E0B',
  accentDeep:        '#D97706',
  accentLight:       '#FEF3C7',

  // UI Elements
  border:            '#D1D5DB',
  borderLight:       '#E9EBF0',
  inputBg:           '#F0F2F7',
  card:              '#FFFFFF',
  shadow:            '#001030',

  // Navigation
  navBg:             '#FFFFFF',
  headerBg:          '#1B2A4A',
  headerText:        '#FFFFFF',

  // Status
  success:           '#059669',
  warning:           '#F59E0B',
  error:             '#DC2626',

  statusBar:         'light-content',
};

// ─────────────────────────────────────────────────────────────
//  DARK MODE  —  Midnight · Amber · Premium Charcoal
// ─────────────────────────────────────────────────────────────
const darkPalette = {
  // Backgrounds
  background:        '#0A0F1E',
  surface:           '#131B2E',
  surfaceSecondary:  '#1A2540',
  surfaceTertiary:   '#1E2D4A',

  // Text
  text:              '#F0F4FF',
  textSecondary:     '#8B9DC3',
  textInverse:       '#0A0F1E',

  // Brand Colors
  primary:           '#4A7FD4',
  primaryLight:      '#6B9FE4',
  accent:            '#F59E0B',
  accentDeep:        '#D97706',
  accentLight:       '#2D2000',

  // UI Elements
  border:            '#1E2D4A',
  borderLight:       '#253354',
  inputBg:           '#1A2540',
  card:              '#131B2E',
  shadow:            '#000000',

  // Navigation
  navBg:             '#0D1526',
  headerBg:          '#080E1C',
  headerText:        '#F0F4FF',

  // Status
  success:           '#10B981',
  warning:           '#F59E0B',
  error:             '#EF4444',

  statusBar:         'light-content',
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('userTheme');
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('userTheme', newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const theme = {
    dark: isDarkMode,
    colors: isDarkMode ? darkPalette : lightPalette,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

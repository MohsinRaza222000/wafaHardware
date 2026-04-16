import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * Standardized Screen Wrapper for the Wafa Hardware App.
 * Provides SafeAreaView, theme-aware background, and StatusBar configuration.
 */
const ScreenContainer = ({ children, style, useScrollView = false }) => {
  const { colors, dark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      <StatusBar 
        barStyle="light-content"
        backgroundColor={colors.headerBg} 
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenContainer;

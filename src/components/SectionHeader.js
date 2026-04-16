import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * Industrial Styled Section Header for the Wafa Hardware App.
 * Displays a colorful accent line followed by uppercase text.
 */
const SectionHeader = ({ title, style }) => {
  const { dark } = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.line, { backgroundColor: dark ? '#ff8c00' : '#8B2323' }]} />
      <Text style={[styles.text, { color: dark ? '#ff8c00' : '#8B2323' }]}>
        {title.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 25,
    marginBottom: 8,
  },
  line: {
    width: 25,
    height: 3,
    marginRight: 10,
    borderRadius: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});

export default SectionHeader;

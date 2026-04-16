import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * Reusable Industrial-Styled Button for the Wafa Hardware App.
 * Supports: Primary/Secondary colors, Icons, and Chevron accessories.
 */
const IndustrialButton = ({ 
  label, 
  onPress, 
  icon, 
  showChevron = true, 
  style, 
  textStyle,
  type = 'primary' // 'primary' | 'secondary' | 'outline'
}) => {
  const { colors, dark } = useTheme();
  
  const getBackgroundColor = () => {
    if (type === 'outline') return 'transparent';
    if (type === 'secondary') return dark ? '#1a1a1a' : '#2a2a2a';
    return colors.primary;
  };

  const getBorderColor = () => {
    if (type === 'outline') return dark ? '#444' : '#ddd';
    return 'transparent';
  };

  const getTextColor = () => {
    if (type === 'outline') return colors.textSecondary;
    return '#fff';
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { 
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: type === 'outline' ? 1 : 0
        }, 
        style
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {icon && <MaterialCommunityIcons name={icon} size={20} color={getTextColor()} style={styles.icon} />}
        <Text style={[styles.buttonText, { color: getTextColor() }, textStyle]}>
          {label.toUpperCase()}
        </Text>
        {showChevron && (
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={18} 
            color={getTextColor()} 
            style={styles.chevron} 
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 55,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
  icon: {
    marginRight: 10,
  },
  chevron: {
    marginLeft: 10,
  },
});

export default IndustrialButton;

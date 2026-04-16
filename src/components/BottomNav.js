import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const BottomNav = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, dark } = useTheme();

  const navItems = [
    { name: 'Home', icon: 'home-variant', label: t('NavHome') },
    { name: 'Categories', icon: 'view-grid-outline', label: t('NavCategories') },
    { name: 'Cart', icon: 'shopping-outline', label: t('NavCart') },
    { name: 'Contact', icon: 'map-marker-outline', label: t('NavContact') },
  ];

  const activeRoute = route.name;

  return (
    <View style={[styles.bottomNav, { backgroundColor: '#f0f0f0', borderTopColor: colors.border }]}>
      {navItems.map((item) => {
        const isActive = activeRoute === item.name;
        
        return (
          <TouchableOpacity 
            key={item.name}
            style={styles.navItem} 
            onPress={() => {
              if (item.name === 'Contact') {
                navigation.navigate('Contact');
              } else {
                navigation.navigate('ShopFlow', { screen: item.name });
              }
            }}
          >
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons 
                name={item.icon} 
                size={22} 
                color={isActive ? colors.accent : colors.textSecondary} 
              />
            </View>
            <Text style={[
              styles.navLabel, 
              { color: isActive ? colors.accent : colors.textSecondary }
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 65,
    borderTopWidth: 1,
    borderTopColor: '#f0eded',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    marginBottom: 4,
    padding: 4,
  },
  navLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

export default BottomNav;

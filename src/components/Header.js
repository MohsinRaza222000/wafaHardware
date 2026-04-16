import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

const Header = ({ showBack = false }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const cartQuantity = useSelector((state) => state.cart.items.reduce((acc, item) => acc + item.quantity, 0));

  return (
    <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
      {/* 1. Menu/Back Icon on Left */}
      <TouchableOpacity 
        style={styles.iconButton} 
        onPress={() => showBack ? navigation.goBack() : navigation.openDrawer()}
      >
        <MaterialCommunityIcons 
          name={showBack ? "arrow-left" : "menu"} 
          size={24} 
          color={colors.headerText} 
        />
      </TouchableOpacity>
      
      {/* 2. Logo centered - Bold All Caps */}
      <View style={styles.logoContainer}>
        <Text style={[styles.logoText, { color: colors.headerText }]}>{t('WafaHardware').toUpperCase()}</Text>
      </View>
      
      {/* 3. Shopping Cart Bag icon on Right with Badge */}
      <TouchableOpacity 
        style={styles.iconButton} 
        onPress={() => navigation.navigate('Cart')}
      >
        <MaterialCommunityIcons name="cart-outline" size={24} color={colors.headerText} />
        {cartQuantity > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartQuantity}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 60,
  },
  iconButton: {
    padding: 10,
    position: 'relative',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '800', // Bold
    letterSpacing: 0.5,
  },
  cartBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#fb6a00', // Theme Orange
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
});

export default Header;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * Unified Product Card for the Wafa Hardware App.
 * Displays: Image, Badge, Title, Category, SKU, and Add to Cart button.
 */
const ProductCard = ({ product, onPress, onAddToCart }) => {
  const { colors, dark } = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity 
      style={[styles.productCard, { backgroundColor: colors.surface }]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        {product.badge && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.productCategory}>
              {t(product.category, product.category).toUpperCase()}
            </Text>
            <Text style={[styles.productTitle, { color: colors.text }]} numberOfLines={1}>
              {product.title}
            </Text>
          </View>
          <View style={[styles.skuBadge, { backgroundColor: dark ? '#333' : '#dae5fd' }]}>
            <Text style={styles.skuText}>{product.sku}</Text>
          </View>
        </View>
        
        <Text style={[styles.productPrice, { color: colors.text }]}>Rs. {String(product.price).replace(/[^0-9.]/g, '')}</Text>
        
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]} 
          onPress={onAddToCart}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="cart-plus" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.addButtonText}>{t('AddToCart', 'ADD TO BAG')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    backgroundColor: '#f0f0f0',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 15,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productCategory: {
    color: '#888',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  skuBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  skuText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#4a69bd',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  addButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default ProductCard;

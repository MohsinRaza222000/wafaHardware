import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2; // 16 padding each side + 16 gap

/**
 * AllProductsGrid
 *
 * Displays every product in the store as a 2-column grid.
 * Each card shows: product image, category label, title, and price.
 * Matches the "Related Industrial Supplies" image design.
 *
 * Props:
 *  data: Product array
 *  onProductPress(product) – navigate to ProductDetails
 */
const AllProductsGrid = ({ data = [], onProductPress }) => {
  const { colors, dark } = useTheme();
  const { t } = useTranslation();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: dark ? '#1e1e1e' : '#fff' },
      ]}
      onPress={() => onProductPress && onProductPress(item)}
      activeOpacity={0.85}
    >
      {/* Product Image */}
      <View style={[styles.imageContainer, { backgroundColor: dark ? '#222' : '#f0f0f0' }]}>
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
        {item.badge && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>

      {/* Card Info */}
      <View style={styles.cardInfo}>
        <Text
          style={[styles.categoryLabel, { color: colors.primary }]}
          numberOfLines={1}
        >
          {t(item.category ? item.category.replace(' ', '') : 'PRODUCT', item.category).toUpperCase()}
        </Text>
        <Text
          style={[styles.productTitle, { color: colors.text }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text style={[styles.productPrice, { color: colors.text }]}>
          Rs. {String(item.price).replace(/[^0-9.]/g, '')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionLabel, { color: colors.primary }]}>
          {t('AllProducts', 'ALL PRODUCTS').toUpperCase()}
        </Text>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('RelatedIndustrialSupplies', 'Related Industrial\nSupplies')}
        </Text>
      </View>

      {/* 2-Column Grid */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        scrollEnabled={false} // parent ScrollView handles scrolling
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionHeader: {
    marginBottom: 20,
    marginTop: 10,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: CARD_SIZE,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: CARD_SIZE,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  cardInfo: {
    padding: 10,
  },
  categoryLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default AllProductsGrid;

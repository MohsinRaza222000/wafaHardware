import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartActions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { apiRequest } from '../services/apiService';
import { ENDPOINTS } from '../config/api';

// Shared Components
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import AllProductsGrid from '../components/AllProductsGrid';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { translateCategory } from '../utils/translationHelper';


const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors, dark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  // Fetch products from MongoDB
  const fetchProducts = useCallback(async () => {
    try {
      const data = await apiRequest(ENDPOINTS.PRODUCTS);
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, [fetchProducts]);

  const searchResults = searchQuery.trim()
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.title?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
        );
      })
    : [];

    

  if (loading) {
    return (
      <ScreenContainer style={{ backgroundColor: colors.background }}>
        <Header />
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
        <BottomNav />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header />

      <ScrollView 
        style={{ flex: 1, backgroundColor: colors.background }}
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.accent]} />
        }
      >
        {/* Search Bar Section */}
        <View style={[styles.searchSection, { backgroundColor: colors.background }]}>
          <View style={[styles.searchContainer, { backgroundColor: colors.inputBg }]}>
            <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} style={{ marginLeft: 15 }} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={t('SearchItemsPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={[styles.searchButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.searchButtonText}>{t('FIND')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {searchQuery.trim().length > 0 ? (
          <View style={styles.resultsSection}>
            <Text style={[styles.sectionLabel, { color: colors.primary }]}>{t('ITEMSFOUND')}</Text>
            {searchResults.length > 0 ? (
              <View style={styles.resultsGrid}>
                {searchResults.map(product => (
                  <TouchableOpacity 
                    key={product._id || product.id}
                    style={styles.resultCard}
                    onPress={() => navigation.navigate('ProductDetails', { product })}
                  >
                    <Image source={{ uri: product.image }} style={styles.resultImage} />
                    <Text style={[styles.resultTitle, { color: colors.text }]}>{product.title}</Text>
                    <Text style={[styles.resultPrice, { color: colors.accent }]}>Rs. {String(product.price).replace(/[^0-9.]/g, '')}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 50 }}>
                 <MaterialCommunityIcons name="package-variant-closed" size={54} color="#ddd" />
                 <Text style={{ fontSize: 16, fontWeight: '900', color: '#888', marginTop: 15 }}>{t('PRODUCTNOTFOUND')}</Text>
                 <Text style={{ fontSize: 12, color: '#aaa', marginTop: 5, textAlign: 'center' }}>{t('NoItemsMatching')} "{searchQuery}".{"\n"}{t('TryDifferent')}</Text>
              </View>
            )}
          </View>
        ) : showAllProducts ? (
          <View style={{ marginTop: 10, flex: 1 }}>
            <TouchableOpacity 
              style={{ marginLeft: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }} 
              onPress={() => setShowAllProducts(false)}
            >
              <MaterialCommunityIcons name="arrow-left" size={20} color="#fb6a00" />
              <Text style={{ color: '#fb6a00', fontWeight: 'bold', marginLeft: 5 }}>{t('GoBack')}</Text>
            </TouchableOpacity>
            <AllProductsGrid 
              data={products} 
              onProductPress={(product) => navigation.navigate('ProductDetails', { product })} 
            />
          </View>
        ) : (
          <>
            {/* Categories Section */}
            <View style={[styles.section, { backgroundColor: colors.background }]}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={[styles.sectionLabel, { color: colors.primary }]}>{t('SHOPITEMS')}</Text>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('WhatWeSell')}</Text>
                </View>
                <TouchableOpacity style={styles.viewAllBtn} onPress={() => setShowAllProducts(true)}>
                  <Text style={[styles.viewAllText, { color: colors.primary }]}>{t('SeeAllHome')}</Text>
                  <MaterialCommunityIcons name="arrow-right" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.categoriesGrid}>
                 <CategoryItem 
                  title={t('Cabinet Sheets')} 
                  image={require("../assets/images/cabinet.jpg")}
                  onPress={() => navigation.navigate('ProductListing', { categoryName: 'Door Skins' })} 
                />
                <CategoryItem 
                  title={t('DoorSkins')} 
                  image={require("../assets/images/doorSkin-copy.jpg")}
                  onPress={() => navigation.navigate('ProductListing', { categoryName: 'Door Skins' })} 
                />
                <CategoryItem 
                  title={t('Tools')} 
                  image={require("../assets/images/tools.jpg")}
                  onPress={() => navigation.navigate('ProductListing', { categoryName: 'Tools' })} 
                />
                <CategoryItem 
                  title={t('PaintsT')} 
                  image={require("../assets/images/paints.jpg")} 
                  onPress={() => navigation.navigate('ProductListing', { categoryName: 'Paints' })} 
                />
                <CategoryItem 
                  title={t('Glass')} 
                  image={require("../assets/images/glass.jpg")} 
                  onPress={() => navigation.navigate('ProductListing', { categoryName: 'Glass' })} 
                />
              </View>
            </View>

            {/* Featured Deals Section */}
            <View style={[styles.dealsSection, { backgroundColor: colors.surfaceSecondary }]}>
              <Text style={[styles.sectionLabel, { color: colors.primary }]}>{t('LIMITEDOFFER')}</Text>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('TodaysBestDeals')}</Text>

              {products.slice(0, 3).map((product, index) => (
                <TouchableOpacity 
                  key={product._id || product.id} 
                  style={[styles.dealCard, { backgroundColor: colors.surface }]}
                  onPress={() => navigation.navigate('ProductDetails', { product })}
                >
                  <View style={styles.dealImageContainer}>
                    <Image source={{ uri: product.image }} style={styles.dealImage} />
                    {index === 0 && <View style={styles.badge}><Text style={styles.badgeText}>{t('SAVE15')}</Text></View>}
                    {index === 1 && <View style={[styles.badge, { backgroundColor: '#fb6a00' }]}><Text style={styles.badgeText}>{t('HOTDEAL')}</Text></View>}
                  </View>
                  <View style={styles.dealContent}>
                    <Text style={styles.dealCategory}>{translateCategory(product.category, t)?.toUpperCase() || 'HARDWARE'}</Text>
                    <Text style={[styles.dealTitle, { color: colors.text }]}>{product.title}</Text>
                    {product.description ? <Text style={[styles.dealDescription, { color: colors.textSecondary }]} numberOfLines={2}>{product.description}</Text> : null}
                    <View style={styles.priceRow}>
                      <Text style={[styles.price, { color: colors.accent }]}>Rs. {String(product.price).replace(/[^0-9.]/g, '')}</Text>
                      {product.oldPrice && <Text style={styles.oldPrice}>Rs. {String(product.oldPrice).replace(/[^0-9.]/g, '')}</Text>}
                    </View>
                    <TouchableOpacity 
                      style={styles.addToCartBtn}
                      onPress={() => dispatch(addToCart(product))}
                    >
                      <MaterialCommunityIcons name="cart-outline" size={20} color="#fff" />
                      <Text style={styles.addToCartText}>{t('AddToCart')}</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.banner}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>{t('NeedManyItems')}</Text>
                <Text style={styles.bannerSubtitle}>{t('SpecialLowPrice')}</Text>
                <TouchableOpacity style={styles.bannerBtn}>
                  <Text style={styles.bannerBtnText}>{t('ChatWhatsapp')}</Text>
                </TouchableOpacity>
              </View>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600' }} 
                style={styles.bannerImage} 
              />
            </View>
          </>
        )}
      </ScrollView>

      <BottomNav />
    </ScreenContainer>
  );
};

const CategoryItem = ({ title, image, onPress }) => (
  <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
    <Image source={image} style={styles.categoryImage}/>
    <View style={styles.categoryOverlay} />
    <Text style={styles.categoryLabel}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  searchSection: {
    padding: 15,
    backgroundColor: '#fcf9f8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0eded',
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 10,
    color: '#1b1c1c',
  },
  searchButton: {
    backgroundColor: '#a04100',
    paddingHorizontal: 15,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionLabel: {
    fontSize: 10,
    color: '#a04100',
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 34,
    color: '#1b1c1c',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#a04100',
    textAlign: 'center',
    marginRight: 5,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 50) / 2,
    height: (width - 50) / 2,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  categoryLabel: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  dealsSection: {
    padding: 20,
    backgroundColor: '#fcf9f8',
  },
  dealCard: {
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dealImageContainer: {
    height: 250,
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#a04100',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  dealContent: {
    padding: 15,
  },
  dealCategory: {
    fontSize: 10,
    color: '#8e7164',
    fontWeight: '900',
    marginBottom: 5,
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1b1c1c',
    marginBottom: 5,
  },
  dealDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  price: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fb6a00',
    marginRight: 10,
  },
  oldPrice: {
    fontSize: 14,
    color: '#8e7164',
    textDecorationLine: 'line-through',
  },
  addToCartBtn: {
    flexDirection: 'row',
    backgroundColor: '#fb6a00',
    height: 48,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    marginLeft: 10,
  },
  banner: {
    margin: 20,
    backgroundColor: '#1b1c1c',
    borderRadius: 4,
    overflow: 'hidden',
    padding: 25,
    flexDirection: 'row',
  },
  bannerContent: {
    flex: 1,
    zIndex: 2,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 30,
    marginBottom: 15,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#fcf9f8',
    lineHeight: 18,
    marginBottom: 20,
  },
  bannerBtn: {
    borderWidth: 1,
    borderColor: '#fb6a00',
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: '#fb6a00',
    fontWeight: '900',
    fontSize: 11,
  },
  bannerImage: {
    width: width * 0.4,
    height: '100%',
    position: 'absolute',
    right: 0,
    bottom: 0,
    opacity: 0.6,
  },
  resultsSection: {
    padding: 20,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resultCard: {
    width: (width - 50) / 2,
    marginBottom: 20,
  },
  resultImage: {
    width: '100%',
    height: 150,
    borderRadius: 4,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginTop: 8,
    color: '#1b1c1c',
  },
  resultPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fb6a00',
    marginTop: 4,
  },
});

export default HomeScreen;

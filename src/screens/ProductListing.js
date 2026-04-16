import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartActions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { apiRequest } from '../services/apiService';
import { ENDPOINTS } from '../config/api';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { translateCategory } from '../utils/translationHelper';

const { width } = Dimensions.get('window');

const ProductListing = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { colors, dark } = useTheme();

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);

  const { categoryName } = route.params || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await apiRequest(ENDPOINTS.PRODUCTS);
      if (Array.isArray(data)) {
        if (categoryName) {
          const reqCat = categoryName.trim().toLowerCase();
          const filtered = data.filter(p => {
            if (!p.category) return false;
            const pCat = p.category.trim().toLowerCase();
            return pCat === reqCat || pCat.includes(reqCat) || reqCat.includes(pCat);
          });
          setProducts(filtered);
        } else {
          setProducts(data);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [categoryName]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const renderHeader = () => (
    <View style={[styles.headerSection, { backgroundColor: colors.background }]}>
      <Text style={[styles.breadcrumb, { color: colors.primary }]}>{t('Shop')}  {'>'}  {translateCategory(categoryName, t)?.toUpperCase() || t('AllProducts')}</Text>
      <Text style={[styles.title, { color: colors.text }]}>{t('AllProducts')}{'\n'}{translateCategory(categoryName, t) || t('Tools')}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {t('SearchToolsDesc')}
      </Text>
      <Text style={[styles.showingText, { color: colors.text }]}>{t('Results')}: {products.length}</Text>
    </View>
  );

  const renderFooter = () => (
    loading ? (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#a04100" />
      </View>
    ) : (
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.loadMoreBtn}>
          <Text style={styles.loadMoreText}>{t('SeeAll')}</Text>
        </TouchableOpacity>
      </View>
    )
  );

  return (
    <ScreenContainer style={{ backgroundColor: colors.background }}>
      <Header showBack={true} />
      
      <FlatList
        data={products}
        keyExtractor={(item) => item._id || item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={[styles.listContent, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
          >
            <View style={[styles.imageContainer, { backgroundColor: dark ? '#222' : '#f4f4f4' }]}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>{item.badge || 'BEST ITEM'}</Text>
              </View>
            </View>
            
            <View style={styles.cardInfo}>
              <View style={styles.tagsRow}>
                <Text style={[styles.categoryTag, { color: colors.primary }]}>{translateCategory(item.category, t)?.toUpperCase() || 'HARDWARE'}</Text>
                <View style={[styles.skuTag, { backgroundColor: colors.inputBg }]}>
                  <Text style={[styles.skuText, { color: colors.textSecondary }]}>{item.sku || 'SKU-382-74'}</Text>
                </View>
              </View>
              
              <Text style={[styles.productTitle, { color: colors.text }]}>{item.title}</Text>
              {item.description ? <Text style={[styles.productDescription, { color: colors.textSecondary }]} numberOfLines={2}>{item.description}</Text> : null}
              <Text style={[styles.productPrice, { color: colors.text }]}>Rs. {String(item.price).replace(/[^0-9.]/g, '')}</Text>
              
              <TouchableOpacity 
                style={[styles.addToCartBtn, { backgroundColor: colors.primary }]}
                onPress={() => dispatch(addToCart(item))}
              >
                <MaterialCommunityIcons name="cart-plus" size={16} color="#fff" />
                <Text style={styles.addToCartText}>{t('AddToBag')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      <BottomNav />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
    backgroundColor: '#fcf9f8',
  },
  headerSection: {
    padding: 25,
    paddingTop: 30,
  },
  breadcrumb: {
    fontSize: 10,
    fontWeight: '900',
    color: '#a04100',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1b1c1c',
    lineHeight: 36,
    marginBottom: 15,
  },
  description: {
    fontSize: 13,
    color: '#8e7164',
    lineHeight: 20,
    marginBottom: 20,
  },
  showingText: {
    fontSize: 11,
    color: '#1b1c1c',
    fontWeight: '700',
    marginBottom: 30,
  },

  card: {
    marginBottom: 35,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0eded',
  },
  imageContainer: {
    width: '100%',
    height: 380,
    backgroundColor: '#f4f4f4',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#a04100',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardInfo: {
    padding: 20,
    paddingTop: 15,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryTag: {
    fontSize: 9,
    color: '#a04100',
    fontWeight: '900',
    letterSpacing: 1,
  },
  skuTag: {
    backgroundColor: '#edf2f7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  skuText: {
    fontSize: 8,
    color: '#2b467a',
    fontWeight: '900',
  },
  productTitle: {
    fontSize: 16,
    color: '#1b1c1c',
    fontWeight: '900',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 12,
    color: '#8e7164',
    lineHeight: 18,
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 22,
    color: '#1b1c1c',
    fontWeight: '900',
    marginBottom: 15,
  },
  addToCartBtn: {
    backgroundColor: '#a04100',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 2,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginLeft: 8,
  },
  loaderContainer: {
    padding: 40,
    alignItems: 'center',
  },
  footerContainer: {
    padding: 25,
    paddingBottom: 40,
    alignItems: 'center',
  },
  loadMoreBtn: {
    borderWidth: 1.5,
    borderColor: '#dcd3cf',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 2,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadMoreText: {
    color: '#8e7164',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default ProductListing;

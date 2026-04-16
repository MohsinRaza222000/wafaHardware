import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Share,
  BackHandler,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartActions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useTranslation } from 'react-i18next';
import { translateCategory } from '../utils/translationHelper';

const { width } = Dimensions.get('window');

const ProductDetails = () => {
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

  const [quantity, setQuantity] = useState(1);
  const [selectedDim, setSelectedDim] = useState("4' x 8'");
  const [selectedThick, setSelectedThick] = useState("1/4 inch");

  const { product } = route.params || {};

  // For visual robustness if accessed without routing params
  const activeProduct = product || {
    title: 'PREMIUM WOOD BOARD',
    category: 'Wood & Boards',
    description: 'High-quality wood for furniture and home decoration.',
    price: 42.50,
    oldPrice: 56.00,
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=600',
    sku: 'WB-2026-BH-G1'
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Check out ${activeProduct.title} at Wafa Hardware! Price: Rs. ${activeProduct.price}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ScreenContainer style={{ backgroundColor: colors.background }}>
      <Header showBack={true} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background }]}>
        
        {/* Breadcrumb Row */}
        <View style={[styles.breadcrumbRow, { backgroundColor: colors.background }]}>
          <Text style={[styles.breadcrumbText, { color: colors.textSecondary }]}>{t('AllProducts')}  {'>'}  {translateCategory(activeProduct.category, t) || t('Categories')}  {'>'}  </Text>
          <Text style={[styles.breadcrumbText, { fontWeight: '900', color: colors.text }]}>{activeProduct.title}</Text>
        </View>

        {/* Image Section */}
        <View style={[styles.imageSection, { backgroundColor: colors.background }]}>
          <View style={[styles.mainImageContainer, { backgroundColor: dark ? '#222' : '#f4f4f4' }]}>
            <Image source={{ uri: activeProduct.image }} style={styles.mainImage} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{t('BestItem')}</Text>
            </View>
            <TouchableOpacity style={styles.shareFab} onPress={onShare}>
              <MaterialCommunityIcons name="share-variant" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

        </View>

        {/* Content Section */}
        <View style={[styles.contentSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.productTitle, { color: colors.text }]}>{activeProduct.title}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {activeProduct.description || "High-quality material for your home and shop projects."}
          </Text>

          {/* Pricing Row */}
          <View style={styles.priceContainer}>
            <Text style={[styles.currentPrice, { color: colors.primary }]}>Rs. {String(activeProduct.price).replace(/[^0-9.]/g, '')}</Text>
            {activeProduct.oldPrice && <Text style={[styles.oldPrice, { color: colors.textSecondary }]}>Rs. {String(activeProduct.oldPrice).replace(/[^0-9.]/g, '')}</Text>}
            {activeProduct.oldPrice && (
              <View style={[styles.discountBadge, { backgroundColor: colors.inputBg }]}>
                <Text style={styles.discountBadgeText}>SAVE 25%</Text>
              </View>
            )}
          </View>

          {/* Stock & SKU Rows */}
          <View style={styles.stockSkuRow}>
            <View style={styles.stockStatus}>
              <MaterialCommunityIcons name="check-circle" size={14} color="#2e7d32" />
              <Text style={styles.stockText}>{t('Available')}</Text>
            </View>
            <Text style={styles.skuText}>{t('ItemIdLabel')}{activeProduct.sku || 'WB-2026-BH-G1'}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Selection Selectors */}
          <Text style={[styles.sectionLabel, { color: colors.text }]}>{t('ChooseSize')}</Text>
          <View style={styles.optionsRow}>
            {["4' x 8'", "2' x 4'", "4' x 4'"].map(dim => (
              <TouchableOpacity 
                key={dim} 
                style={[
                  styles.outlineBtn, 
                  { borderColor: colors.border, backgroundColor: colors.inputBg }, 
                  selectedDim === dim && { borderColor: colors.primary, backgroundColor: dark ? '#331a0d' : '#fff5f0' }
                ]}
                onPress={() => setSelectedDim(dim)}
              >
                <Text style={[
                  styles.outlineBtnText, 
                  { color: colors.textSecondary }, 
                  selectedDim === dim && { color: colors.primary, fontWeight: '900' }
                ]}>{dim}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 15, color: colors.text }]}>{t('ChooseThickness')}</Text>
          <View style={styles.radioRow}>
            {["1/4 inch", "1/2 inch"].map(thick => (
              <TouchableOpacity key={thick} style={styles.radioGroup} onPress={() => setSelectedThick(thick)}>
                <MaterialCommunityIcons 
                  name={selectedThick === thick ? 'radiobox-marked' : 'radiobox-blank'} 
                  size={18} 
                  color={selectedThick === thick ? colors.primary : colors.border} 
                />
                <Text style={[styles.radioText, { color: colors.text }]}>{thick}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quantity Row */}
          <View style={[styles.qtyContainer, { backgroundColor: colors.inputBg }]}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <MaterialCommunityIcons name="minus" size={18} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.qtyText, { color: colors.text }]}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
              <MaterialCommunityIcons name="plus" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Add to Cart */}
          <TouchableOpacity 
            style={[styles.addToCartBtn, { backgroundColor: colors.accent }]}
            onPress={() => {
              dispatch(addToCart(activeProduct));
            }}
          >
            <MaterialCommunityIcons name="cart-outline" size={20} color="#fff" />
            <Text style={styles.addToCartText}>{t('AddToBag')}</Text>
          </TouchableOpacity>

          {/* Delivery & Perks */}
          <View style={styles.perksRow}>
            <View style={[styles.perkBox, { backgroundColor: colors.surfaceSecondary }]}>
              <MaterialCommunityIcons name="truck-outline" size={24} color={colors.primary} />
              <View style={styles.perkTexts}>
                <Text style={[styles.perkTitle, { color: colors.text }]}>{t('FastDelivery')}</Text>
                <Text style={[styles.perkDesc, { color: colors.textSecondary }]}>{t('FastDeliveryDesc')}</Text>
              </View>
            </View>
            <View style={[styles.perkBox, { backgroundColor: colors.surfaceSecondary }]}>
              <MaterialCommunityIcons name="shield-check-outline" size={24} color={colors.primary} />
              <View style={styles.perkTexts}>
                <Text style={[styles.perkTitle, { color: colors.text }]}>{t('SelectedItems')}</Text>
                <Text style={[styles.perkDesc, { color: colors.textSecondary }]}>{t('SelectedItemsDesc')}</Text>
              </View>
            </View>
          </View>

        </View>


        {/* Similar Items */}
        <View style={[styles.relatedSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.specsMainTitle, { color: colors.text }]}>{t('SimilarItems')}</Text>
          <View style={styles.relatedGrid}>
            <RelatedItem 
              category="GLUES" 
              title="PVA Professional Wood Glue" 
              price="14.99" 
              image="https://images.unsplash.com/photo-1574636901844-436f56b5f4be?auto=format&fit=crop&q=80&w=300" 
              colors={colors}
              dark={dark}
            />
            <RelatedItem 
              category="SANDING" 
              title="Multi-Grit Sanding Kit (50pk)" 
              price="22.50" 
              image="https://images.unsplash.com/photo-1596484307527-31ef0e854fa1?auto=format&fit=crop&q=80&w=300" 
              colors={colors}
              dark={dark}
            />
            <RelatedItem 
              category="SCREWS" 
              title="Galvanized Steel Screws Set" 
              price="35.00" 
              image="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=300" 
              colors={colors}
              dark={dark}
            />
            <RelatedItem 
              category="WOOD" 
              title="Solid White Oak Board" 
              price="65.00" 
              image="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=300" 
              colors={colors}
              dark={dark}
            />
          </View>
        </View>
      </ScrollView>

      <BottomNav />
    </ScreenContainer>
  );
};

const RelatedItem = ({ category, title, price, image, colors, dark }) => (
  <TouchableOpacity style={styles.relatedCard}>
    <View style={[styles.relatedImgBg, { backgroundColor: dark ? '#222' : '#e6deda' }]}>
      <Image source={{ uri: image }} style={styles.relatedImg} />
    </View>
    <Text style={[styles.relatedCat, { color: colors.textSecondary }]}>{category}</Text>
    <Text style={[styles.relatedTitle, { color: colors.text }]}>{title}</Text>
    <Text style={[styles.relatedPrice, { color: colors.accent }]}>Rs. {price}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  breadcrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: '#fff',
    flexWrap: 'wrap',
  },
  breadcrumbText: {
    fontSize: 10,
    color: '#8e7164',
    lineHeight: 18,
  },
  imageSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  mainImageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f4f4f4',
    borderRadius: 4,
    marginBottom: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  mainImage: {
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
    letterSpacing: 1,
  },
  shareFab: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentSection: {
    padding: 20,
    backgroundColor: '#fff',
  },
  productTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1b1c1c',
    lineHeight: 30,
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    color: '#8e7164',
    lineHeight: 20,
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: '900',
    color: '#a04100',
    marginRight: 15,
  },
  oldPrice: {
    fontSize: 14,
    color: '#8e7164',
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  discountBadge: {
    backgroundColor: '#edf2f7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 2,
  },
  discountBadgeText: {
    color: '#2b467a',
    fontSize: 9,
    fontWeight: '900',
  },
  stockSkuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
    marginRight: 15,
  },
  stockText: {
    color: '#2e7d32',
    fontSize: 9,
    fontWeight: '900',
    marginLeft: 4,
  },
  skuText: {
    color: '#1b1c1c',
    fontSize: 9,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0eded',
    marginVertical: 20,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#1b1c1c',
    letterSpacing: 1,
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 12,
    marginRight: 10,
    alignItems: 'center',
    borderRadius: 2,
  },
  outlineBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  radioRow: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioText: {
    fontSize: 12,
    color: '#1b1c1c',
    marginLeft: 8,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f4f4f4',
    borderRadius: 2,
    paddingHorizontal: 15,
    height: 48,
    marginBottom: 15,
  },
  qtyBtn: {
    padding: 10,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1b1c1c',
  },
  addToCartBtn: {
    flexDirection: 'row',
    backgroundColor: '#fb6a00',
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    marginLeft: 10,
  },
  perksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  perkBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fcf9f8',
    padding: 15,
    borderRadius: 4,
    marginRight: 5,
  },
  perkTexts: {
    marginLeft: 10,
    flex: 1,
  },
  perkTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1b1c1c',
    marginBottom: 2,
  },
  perkDesc: {
    fontSize: 9,
    color: '#8e7164',
    lineHeight: 12,
  },
  relatedSection: {
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#fcf9f8',
    paddingBottom: 40,
  },
  relatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  relatedCard: {
    width: (width - 50) / 2,
    marginBottom: 20,
  },
  relatedImgBg: {
    width: '100%',
    height: 150,
    backgroundColor: '#e6deda',
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  relatedImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  relatedCat: {
    fontSize: 8,
    color: '#8e7164',
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  relatedTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1b1c1c',
    lineHeight: 16,
    marginBottom: 5,
  },
  relatedPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#fb6a00',
  },
});

export default ProductDetails;

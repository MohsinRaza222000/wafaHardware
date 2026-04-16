import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  BackHandler,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, incrementQuantity, decrementQuantity } from '../store/cartActions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const CartScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
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

  const { items, totalAmount } = useSelector((state) => state.cart);

  if (items.length === 0) {
    return (
      <ScreenContainer style={{ backgroundColor: colors.background }}>
        <Header showBack={true} />
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <MaterialCommunityIcons name="cart-variant" size={80} color={colors.border} style={{ marginBottom: 20 }} />
          <Text style={[styles.mainTitle, { color: colors.primary }]}>{t('YOURBAG')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('BagEmptyDesc')}</Text>
          <TouchableOpacity 
            style={styles.continueShoppingBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.continueShoppingText}>{t('SEEALLITEMS')}</Text>
          </TouchableOpacity>
        </View>
        <BottomNav />
      </ScreenContainer>
    );
  }

  const taxAmount = totalAmount * 0.08;
  const finalTotal = totalAmount + taxAmount;

  return (
    <ScreenContainer style={{ backgroundColor: colors.background }}>
      <Header showBack={true} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background }]}>
        
        <View style={styles.headerSection}>
          <Text style={[styles.mainTitle, { color: colors.primary }]}>{t('YOURBAG')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('CheckItemsDesc')}</Text>
        </View>

        <View style={styles.itemsList}>
          {items.map((item) => (
            <View key={item.id} style={[styles.cartCard, { backgroundColor: colors.surface }]}>
              {/* Product Image taking full width of card content area */}
              <View style={[styles.imgContainer, { backgroundColor: dark ? '#222' : '#f4f4f4' }]}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
              </View>

              {/* Title & Price Row */}
              <View style={styles.titlePriceRow}>
                <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
                <Text style={[styles.itemPrice, { color: colors.accent }]}>Rs. {String(item.price).replace(/[^0-9.]/g, '')}</Text>
              </View>
              
              <Text style={[styles.itemSku, { color: colors.textSecondary }]}>{t('ITEMID')}{item.sku || 'WF-DR-0882'}</Text>

              {/* Controls Row */}
              <View style={styles.controlsRow}>
                <View style={[styles.qtyBox, { backgroundColor: colors.inputBg }]}>
                  <TouchableOpacity 
                    style={styles.qtyBtn} 
                    onPress={() => dispatch(decrementQuantity(item.id))}
                  >
                    <MaterialCommunityIcons name="minus" size={14} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={[styles.qtyText, { color: colors.text }]}>{item.quantity}</Text>
                  <TouchableOpacity 
                    style={styles.qtyBtn} 
                    onPress={() => dispatch(incrementQuantity(item.id))}
                  >
                    <MaterialCommunityIcons name="plus" size={14} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.removeBtn}
                  onPress={() => dispatch(removeItem(item.id))}
                >
                  <MaterialCommunityIcons name="delete-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.removeText, { color: colors.textSecondary }]}>{t('Remove').replace('🗑 ', '')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Complimentary Freight Banner */}
        <View style={[styles.freightBanner, { backgroundColor: dark ? '#2a221f' : '#e6ebff' }]}>
          <MaterialCommunityIcons name="truck" size={24} color={colors.primary} />
          <Text style={[styles.freightText, { color: dark ? '#ccc' : '#4a5b7c' }]}>
            <Text style={{ fontWeight: '900', color: dark ? colors.text : '#4a5b7c' }}>{t('FreeDeliveryTitle')}</Text>
            {t('FreeDeliveryDesc')}
          </Text>
        </View>

        {/* ORDER SUMMARY */}
        <View style={[styles.summaryCard, { backgroundColor: colors.surfaceSecondary }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>{t('ORDERSUMMARY')}</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('SUBTOTAL')}</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>Rs. {totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('SALESTAX')}</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>Rs. {taxAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('SHIPPING')}</Text>
            <Text style={[styles.summaryValue, { color: colors.accent }]}>{t('Free')}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>{t('TOTALBILL')}</Text>
            <Text style={[styles.totalValue, { color: colors.accent }]}>Rs. {finalTotal.toFixed(2)}</Text>
          </View>

          <TouchableOpacity 
            style={[styles.proceedBtn, { backgroundColor: colors.accent }]}
            onPress={() => navigation.navigate('CheckOut')}
          >
            <Text style={styles.proceedBtnText}>{t('PROCEEDTOORDER')}</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.continueShopBtn, { borderColor: colors.border }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={[styles.continueShopText, { color: colors.text }]}>{t('BUYMOREITEMS')}</Text>
          </TouchableOpacity>

          <View style={styles.trustIconsRow}>
            <MaterialCommunityIcons name="shield-check" size={20} color={colors.textSecondary} style={styles.trustIcon} />
            <MaterialCommunityIcons name="lock" size={20} color={colors.textSecondary} style={styles.trustIcon} />
            <MaterialCommunityIcons name="credit-card" size={20} color={colors.textSecondary} style={styles.trustIcon} />
          </View>
        </View>

        {/* Technical Assistance */}
        <View style={[styles.techBanner, { backgroundColor: dark ? '#2a221f' : '#ebe7e4', borderLeftColor: colors.primary }]}>
          <Text style={[styles.techTitle, { color: colors.text }]}>{t('NEEDHELP')}</Text>
          <Text style={[styles.techDesc, { color: colors.textSecondary }]}>{t('NeedHelpDesc')}</Text>
        </View>

      </ScrollView>
      <BottomNav />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerSection: {
    padding: 25,
    paddingTop: 0,
    backgroundColor: '#1b1c1c', // Industrial Dark
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#cccccc',
    lineHeight: 20,
  },
  itemsList: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  cartCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 4,
  },
  imgContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#f4f4f4',
    marginBottom: 15,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
    color: '#1b1c1c',
    marginRight: 15,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#a04100',
  },
  itemSku: {
    fontSize: 10,
    color: '#8e7164',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
    height: 36,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    width: 30,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '900',
    color: '#1b1c1c',
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  removeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4a3e3d',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  freightBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6ebff',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 4,
  },
  freightText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 11,
    color: '#4a5b7c',
    lineHeight: 16,
  },
  summaryCard: {
    backgroundColor: '#282828',
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 4,
    marginBottom: 25,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 25,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#ccc',
    fontWeight: '700',
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 25,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#fff',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fb6a00',
  },
  proceedBtn: {
    backgroundColor: '#fb6a00',
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginBottom: 15,
  },
  proceedBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginRight: 10,
  },
  continueShopBtn: {
    height: 50,
    borderWidth: 1,
    borderColor: '#4d4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginBottom: 30,
  },
  continueShopText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  trustIconsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  trustIcon: {
    marginHorizontal: 15,
  },
  techBanner: {
    marginHorizontal: 20,
    backgroundColor: '#ebe7e4',
    borderLeftWidth: 4,
    borderLeftColor: '#a04100',
    padding: 20,
    marginBottom: 20,
  },
  techTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1b1c1c',
    marginBottom: 8,
  },
  techDesc: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
  },
  continueShoppingBtn: {
    backgroundColor: '#a04100',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 2,
    marginTop: 20,
  },
  continueShoppingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default CartScreen;

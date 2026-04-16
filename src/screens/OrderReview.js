import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  BackHandler,
  Platform,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/cartActions';
import { apiRequest } from '../services/apiService';
import { ENDPOINTS } from '../config/api';
import { showToast } from '../store/uiActions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';


const { width } = Dimensions.get('window');

const OrderReview = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors, dark } = useTheme();
  const dispatch = useDispatch();

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
  const user = useSelector((state) => state.auth.user);

  const taxCost = (totalAmount || 0) * 0.05;
  const finalTotal = (totalAmount || 0) + taxCost;

  const handleConfirmOrder = async () => {
    if (!user || !user.uid) {
      Alert.alert('Not Logged In', 'Please log in again to place your order.');
      return;
    }

    try {
      const payload = {
        userId: user.uid,
        items: items.map(item => ({
          productId: item._id || item.id,
          quantity: item.quantity || 1,
          price: item.priceValue || 0,
          title: item.title,
          image: item.image,
        })),
        totalAmount: finalTotal,
        status: 'pending',
        shippingAddress: 'Industrial Zone Warehouse B',
      };

      const response = await apiRequest(ENDPOINTS.ORDERS_SYNC, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response && response.success) {
        const shortId = response.order?._id
          ? response.order._id.substring(18).toUpperCase()
          : `WF-${Math.floor(10000 + Math.random() * 90000)}-2026`;

        // Strip base64 images — only pass lightweight fields to navigation params
        // (base64 strings can be hundreds of KB and crash React Navigation state)
        const lightItems = items.map(item => ({
          title:      item.title,
          quantity:   item.quantity || 1,
          priceValue: item.priceValue || 0,
          // Only keep image if it's a URL, not a base64 string
          image: item.image && !item.image.startsWith('data:') ? item.image : null,
        }));

        const orderData = {
          items:       lightItems,
          totalAmount,
          taxCost,
          finalTotal,
          orderId:     shortId,
        };

        dispatch(clearCart());
        dispatch(showToast('Order placed successfully', 'success'));
        navigation.navigate('OrderConfirmation', { orderData });


      } else {
        throw new Error(response?.message || 'Failed to place order');
      }
    } catch (error) {
      Alert.alert('Order Failed', 'Could not submit order to warehouse. ' + error.message);
    }
  };

  const primaryColor = colors.primary || '#d35400';
  const bgColor = dark ? '#121212' : '#fcfcfc';
  const blockBg = dark ? '#1e1e1e' : '#f2f2f2';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: 'rgba(255,255,255,0.1)' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.headerText} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
           <Text style={[styles.headerTitle, { color: colors.headerText }]}>{t('Wafa')}</Text>
           <Text style={[styles.headerTitle, { color: colors.headerText }]}>{t('Hardware')}</Text>
        </View>
        <View style={styles.headerRight}>
          <MaterialCommunityIcons name="lock" size={16} color={colors.headerText} />
          <Text style={[styles.headerSecureText, { color: colors.headerText }]}>{t('SafeShopping')}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.mainTitle, { color: primaryColor }]}>{t('CheckYourOrder')}</Text>
          <Text style={[styles.subTitle, { color: dark ? '#aaa' : '#666' }]}>
            {t('CheckOrderDesc')}
          </Text>
        </View>

        {/* 01. Shipping Destination Block */}
        <View style={[styles.infoBlock, { backgroundColor: dark ? '#1a1a1a' : '#f2f2f2' }]}>
          <MaterialCommunityIcons name="truck" size={60} color={dark ? '#2a2a2a' : '#e6e6e6'} style={styles.bgIcon} />
          <Text style={[styles.blockNumberTitle, { color: primaryColor }]}>{t('DeliveryAddressStep')}</Text>
          <Text style={[styles.infoName, { color: colors.text }]}>{t('FakeAddress1')}</Text>
          <Text style={[styles.infoAddress, { color: dark ? '#888' : '#555' }]}>{t('FakeAddress2')}</Text>
          <Text style={[styles.infoAddress, { color: dark ? '#888' : '#555' }]}>{t('FakeAddress3')}</Text>
          <Text style={[styles.infoAddress, { color: dark ? '#888' : '#555' }]}>{t('FakeAddress4')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CheckOut')} style={styles.modifyBtn}>
             <Text style={[styles.modifyText, { color: primaryColor }]}>{t('ModifyLocation')}</Text>
          </TouchableOpacity>
        </View>

        {/* 02. Billing Protocol Block */}
        <View style={[styles.infoBlock, { backgroundColor: dark ? '#1a1a1a' : '#f2f2f2' }]}>
          <MaterialCommunityIcons name="credit-card-outline" size={60} color={dark ? '#2a2a2a' : '#e6e6e6'} style={styles.bgIcon} />
          <Text style={[styles.blockNumberTitle, { color: primaryColor }]}>{t('PaymentMethodStep')}</Text>

          <View style={styles.cardInfoRow}>
             <View style={styles.cardIconBox}>
                <MaterialCommunityIcons name="credit-card" size={20} color="#fff" />
             </View>
             <View style={styles.cardDetails}>
                <Text style={[styles.infoName, { color: colors.text, marginBottom: 2 }]}>{t('CardType')}</Text>
                <Text style={[styles.infoAddress, { color: dark ? '#888' : '#555' }]}>{t('CardEnding')}</Text>
             </View>
          </View>
          <Text style={[styles.infoAddress, { color: dark ? '#888' : '#555', marginTop: 8 }]}>{t('ExpDate')}</Text>

          <TouchableOpacity onPress={() => navigation.navigate('Payment')} style={styles.modifyBtn}>
             <Text style={[styles.modifyText, { color: primaryColor }]}>{t('ChangeMethod')}</Text>
          </TouchableOpacity>
        </View>

        {/* 03. Manifest Summary */}
        <View style={styles.manifestSection}>
          <Text style={[styles.blockNumberTitle, { color: primaryColor, marginBottom: 15 }]}>{t('ItemsListStep')}</Text>

          {(items || []).map((item, index) => (
             <View key={index} style={[styles.manifestItem, { backgroundColor: dark ? '#1e1e1e' : '#fff' }]}>
                <Image
                  source={{ uri: item.image || 'https://via.placeholder.com/150' }}
                  style={[styles.itemImage, { backgroundColor: dark ? '#2a2a2a' : '#f5f5f5' }]}
                  resizeMode="cover"
                />
                <View style={styles.itemDetails}>
                    <View style={[styles.skuBadge, { backgroundColor: dark ? '#112233' : '#e6f0ff' }]}>
                       <Text style={[styles.skuText, { color: dark ? '#5ea2f0' : '#004080' }]}>{t('ItemCode')}{item.sku || 'HW-992-PX'}</Text>
                    </View>
                   <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
                     {item.title}
                   </Text>

                   <View style={styles.qtyPriceRow}>
                      <View style={styles.qpCol}>
                         <Text style={styles.qpLabel}>{t('Qty')}</Text>
                         <Text style={[styles.qpValue, { color: colors.text }]}>{(item.quantity || 1).toString().padStart(2, '0')}</Text>
                      </View>
                      <View style={styles.qpColRight}>
                         <Text style={styles.qpLabel}>{t('UnitPrice')}</Text>
                         <Text style={[styles.qpValue, { color: colors.text }]}>Rs. {item.priceValue?.toLocaleString() || '0'}</Text>
                      </View>
                   </View>
                </View>
             </View>
          ))}
        </View>

        {/* Financial Summary */}
        <View style={styles.financialSummaryBlock}>
           <Text style={styles.finTitle}>{t('OrderTotalTitle')}</Text>

           <View style={styles.finRow}>
              <Text style={styles.finLabel}>{t('SUBTOTAL')}</Text>
              <Text style={styles.finValue}>Rs. {(totalAmount || 0).toLocaleString()}</Text>
           </View>
           <View style={styles.finRow}>
              <Text style={styles.finLabel}>{t('DeliveryStep')}</Text>
              <Text style={styles.finValueOrange}>{t('Free', 'FREE')}</Text>
           </View>
           <View style={styles.finRow}>
              <Text style={styles.finLabel}>{t('EstimatedTax')}</Text>
              <Text style={styles.finValue}>Rs. {taxCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
           </View>

           <View style={styles.dividerFin} />

           <View style={styles.grandTotalRow}>
              <View>
                <Text style={styles.grandTotalLabel}>{t('TotalToPay')}</Text>
                <Text style={styles.grandTotalSubLabel}>{t('PKRDesc')}</Text>
              </View>
              <Text style={styles.grandTotalValue}>
                 Rs. {finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
           </View>

           <TouchableOpacity
             style={[styles.placeOrderBtn, { backgroundColor: primaryColor }]}
             onPress={handleConfirmOrder}
           >
              <Text style={styles.placeOrderText}>{t('PlaceOrderBtn')}</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" style={{ marginLeft: 8 }} />
           </TouchableOpacity>

           <View style={styles.secureTransactionBox}>
              <MaterialCommunityIcons name="shield-check" size={16} color={primaryColor} />
              <Text style={styles.secureTransactionText}>
                {t('OrderSafeAlert')}
              </Text>
           </View>
        </View>

        {/* Estimated Arrival Banner */}
        <View style={[styles.arrivalBanner, { backgroundColor: dark ? '#1a1a1a' : '#f2f2f2' }]}>
           <View style={[styles.arrivalBorder, { backgroundColor: primaryColor }]} />
           <View style={styles.arrivalContent}>
              <Text style={styles.arrivalLabel}>{t('ExpectedDelivery')}</Text>
              <View style={styles.arrivalDateRow}>
                 <MaterialCommunityIcons name="calendar-month" size={18} color={primaryColor} />
                 <Text style={[styles.arrivalDateText, { color: colors.text }]}>{t('DateFake')}</Text>
              </View>
           </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 20,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: { padding: 5 },
  headerCenter: { alignItems: 'center', flex: 1 },
  headerTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 2, lineHeight: 14 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerSecureText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.5, marginLeft: 4 },
  scrollContent: { paddingBottom: 50 },
  titleSection: { paddingHorizontal: 20, marginTop: 25, marginBottom: 20 },
  mainTitle: { fontSize: 26, fontWeight: '900', marginBottom: 8, textTransform: 'uppercase' },
  subTitle: { fontSize: 12, lineHeight: 18, maxWidth: '90%' },
  infoBlock: {
    marginHorizontal: 20, marginBottom: 15, padding: 20,
    borderRadius: 0, position: 'relative', overflow: 'hidden',
  },
  bgIcon: { position: 'absolute', top: 10, right: 15, opacity: 0.8 },
  blockNumberTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 15 },
  infoName: { fontSize: 13, fontWeight: '800', marginBottom: 4 },
  infoAddress: { fontSize: 11, lineHeight: 18 },
  modifyBtn: { marginTop: 15, alignSelf: 'flex-start' },
  modifyText: { fontSize: 9, fontWeight: '900', letterSpacing: 1, textDecorationLine: 'underline' },
  cardInfoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  cardIconBox: {
    backgroundColor: '#222', height: 32, width: 45,
    justifyContent: 'center', alignItems: 'center', borderRadius: 4, marginRight: 12,
  },
  cardDetails: { flex: 1 },
  manifestSection: { paddingHorizontal: 20, marginTop: 15 },
  manifestItem: { flexDirection: 'row', padding: 0, marginBottom: 20 },
  itemImage: { width: 100, height: 100, backgroundColor: '#f5f5f5' },
  itemDetails: { flex: 1, paddingLeft: 15, justifyContent: 'center' },
  skuBadge: {
    backgroundColor: '#e6f0ff', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 2, alignSelf: 'flex-start', marginBottom: 6,
  },
  skuText: { fontSize: 8, fontWeight: '900', color: '#004080', letterSpacing: 0.5 },
  itemTitle: { fontSize: 14, fontWeight: '900', marginBottom: 10, textTransform: 'uppercase' },
  qtyPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qpCol: { alignItems: 'flex-start' },
  qpColRight: { alignItems: 'flex-end' },
  qpLabel: { fontSize: 8, color: '#888', fontWeight: '800', letterSpacing: 1, marginBottom: 2 },
  qpValue: { fontSize: 14, fontWeight: '900' },
  financialSummaryBlock: {
    backgroundColor: '#2d2d2d', marginHorizontal: 20, marginTop: 15, padding: 25, borderRadius: 0,
  },
  finTitle: { color: '#de7a22', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 25 },
  finRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  finLabel: { color: '#aaa', fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  finValue: { color: '#fff', fontSize: 12, fontWeight: '800' },
  finValueOrange: { color: '#d35400', fontSize: 12, fontWeight: '900' },
  dividerFin: { height: 1, backgroundColor: '#444', marginVertical: 15 },
  grandTotalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 30,
  },
  grandTotalLabel: { color: '#e67e22', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  grandTotalSubLabel: { color: '#777', fontSize: 9, fontStyle: 'italic', marginTop: 2 },
  grandTotalValue: { color: '#fff', fontSize: 28, fontWeight: '900' },
  placeOrderBtn: {
    flexDirection: 'row', height: 55, justifyContent: 'center',
    alignItems: 'center', marginBottom: 15,
  },
  placeOrderText: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 1.5 },
  secureTransactionBox: {
    flexDirection: 'row', backgroundColor: '#383838', padding: 15, alignItems: 'center',
  },
  secureTransactionText: {
    color: '#999', fontSize: 7, fontWeight: '800', letterSpacing: 0.5,
    lineHeight: 10, marginLeft: 10, flex: 1,
  },
  arrivalBanner: {
    flexDirection: 'row', marginHorizontal: 20, marginTop: 25,
    backgroundColor: '#f2f2f2', height: 70,
  },
  arrivalBorder: { width: 4, height: '100%' },
  arrivalContent: { flex: 1, paddingHorizontal: 20, justifyContent: 'center' },
  arrivalLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1, color: '#666', marginBottom: 5 },
  arrivalDateRow: { flexDirection: 'row', alignItems: 'center' },
  arrivalDateText: { fontSize: 13, fontWeight: '900', marginLeft: 8 },
});

export default OrderReview;

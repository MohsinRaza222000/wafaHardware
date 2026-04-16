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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const OrderConfirmation = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, dark } = useTheme();

  // Add BackHandler to go back instead of exit or Home
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);

  // Extract passed data from route params or fallback to empty state
  const { orderData } = route.params || {};
  const items = orderData?.items || [];
  const finalTotal = orderData?.finalTotal || 0;
  const orderId = orderData?.orderId || 'WF-99420-2026';

  const primaryColor = colors.primary || '#d35400';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.headerText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>{t('HeaderDone')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Main Hero */}
        <View style={styles.heroSection}>
           <View style={[styles.heroIconBox, { backgroundColor: primaryColor }]}>
              <View style={styles.whiteCircle}>
                 <MaterialCommunityIcons name="check" size={32} color={primaryColor} />
              </View>
           </View>
           <Text style={[styles.heroTitle, { color: colors.text }]}>{t('MainDone')}</Text>
           
           <View style={[styles.referencePill, { backgroundColor: colors.surface }]}>
              <Text style={styles.refLabel}>{t('OrderNumber')}</Text>
              <Text style={[styles.refValue, { color: primaryColor }]}>{orderId}</Text>
           </View>
        </View>

        {/* Estimated Delivery Block */}
        <View style={[styles.deliveryBlock, { backgroundColor: colors.surface }]}>
           <MaterialCommunityIcons name="truck-fast" size={80} color={dark ? '#333' : '#e6e6e6'} style={styles.bgIcon} />
           
           <View style={styles.deliveryHeaderRow}>
              <MaterialCommunityIcons name="clock-time-four" size={16} color={primaryColor} />
              <Text style={[styles.deliveryLabel, { color: colors.text }]}>{t('DeliveryTime')}</Text>
           </View>

           <View style={styles.dateRow}>
              <Text style={[styles.dateMain, { color: colors.text }]}>{t('Oct24')}</Text>
              <Text style={styles.dateSub}>{t('Oct26')}</Text>
           </View>

           <Text style={styles.deliveryDesc}>
              {t('DispatchDesc')}
           </Text>
        </View>

        {/* Order Summary Block */}
        <View style={[styles.summaryBlock, { borderColor: dark ? '#333' : '#eee' }]}>
           <Text style={[styles.summaryTitle, { color: colors.text }]}>{t('MyItems')}</Text>

           {/* Dynamic order items passed from Review Screen */}
           {items.length > 0 ? (
             items.map((item, index) => (
                <View key={index}>
                   <View style={styles.mockItemRow}>
                      <Text style={[styles.mockItemName, { color: colors.text, flex: 1, paddingRight: 10 }]} numberOfLines={1}>
                         {item.title}
                      </Text>
                      <Text style={[styles.mockItemQty, { color: colors.text }]}>x{item.quantity}</Text>
                   </View>
                   {index < items.length - 1 && <View style={[styles.divider, { backgroundColor: dark ? '#333' : '#eee' }]} />}
                </View>
             ))
           ) : (
             <View style={styles.mockItemRow}>
                <Text style={[styles.mockItemName, { color: colors.text }]}>{t('PRODUCTNOTFOUND', 'No items found')}</Text>
             </View>
           )}
           <View style={[styles.divider, { backgroundColor: dark ? '#333' : '#eee' }]} />

           <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>{t('TotalPrice')}</Text>
              <Text style={[styles.totalValue, { color: primaryColor }]}>
                 Rs. {finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
           </View>
        </View>

        {/* Industrial Graphic Placeholder */}
        <View style={styles.graphicContainer}>
           {/* Using a solid stylized block if the image URL is not available, but simulating the industrial photo feel */}
           <View style={[styles.industrialGraphic, { backgroundColor: '#222' }]}>
              <MaterialCommunityIcons name="cog" size={120} color="#444" style={styles.gearIcon} />
           </View>
        </View>

        {/* Actions Container */}
        <View style={styles.actionsContainer}>
           <TouchableOpacity 
             style={[styles.trackBtn, { backgroundColor: '#a04000' }]}
             onPress={() => navigation.navigate('OrderHistory')}
           >
              <MaterialCommunityIcons name="map-marker-outline" size={20} color="#fff" />
              <Text style={styles.trackBtnText}>{t('SeeStatus')}</Text>
           </TouchableOpacity>

           <TouchableOpacity 
             style={[styles.shopBtn, { backgroundColor: '#dce5ff' }]}
             onPress={() => navigation.navigate('Home')}
           >
              <Text style={styles.shopBtnText}>{t('ShopMore')}</Text>
           </TouchableOpacity>
        </View>

        {/* Support Block */}
        <View style={[styles.supportBlock, { backgroundColor: colors.surface }]}>
           <View style={[styles.supportLeftBorder, { backgroundColor: primaryColor }]} />
           <View style={styles.supportContent}>
              <Text style={styles.supportLabel}>{t('TechnicalSupport')}</Text>
              <Text style={[styles.supportText, { color: colors.text }]}>
                 {t('TechDesc1')}<Text style={styles.supportBold}>#{orderId}</Text>{t('TechDesc2')}<Text style={styles.supportBold}>1-800-WAFA-HDWR</Text>.
              </Text>
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
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  moreBtn: {
    padding: 5,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  heroIconBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
  },
  whiteCircle: {
    width: 44,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 15,
  },
  referencePill: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  refLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '700',
  },
  refValue: {
    fontSize: 10,
    fontWeight: '900',
  },
  deliveryBlock: {
    marginHorizontal: 30,
    padding: 25,
    borderRadius: 8,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  bgIcon: {
    position: 'absolute',
    top: 20,
    right: 15,
    opacity: 0.8,
  },
  deliveryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  deliveryLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  dateMain: {
    fontSize: 26,
    fontWeight: '900',
  },
  dateSub: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  deliveryDesc: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
    paddingRight: 20,
  },
  summaryBlock: {
    marginHorizontal: 30,
    borderWidth: 1,
    borderRadius: 8,
    padding: 25,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 20,
  },
  mockItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mockItemName: {
    fontSize: 12,
    fontWeight: '400',
  },
  mockItemQty: {
    fontSize: 12,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    marginVertical: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '900',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  graphicContainer: {
    marginHorizontal: 30,
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
  },
  industrialGraphic: {
    height: 250,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gearIcon: {
    opacity: 0.5,
  },
  actionsContainer: {
    marginHorizontal: 30,
    marginBottom: 20,
  },
  trackBtn: {
    flexDirection: 'row',
    height: 55,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  trackBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    marginLeft: 10,
  },
  shopBtn: {
    height: 55,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopBtnText: {
    color: '#34528c',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  supportBlock: {
    marginHorizontal: 30,
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: '#fff',
    minHeight: 80,
  },
  supportLeftBorder: {
    width: 4,
    height: '100%',
  },
  supportContent: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  supportLabel: {
    fontSize: 9,
    color: '#888',
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 5,
  },
  supportText: {
    fontSize: 10,
    lineHeight: 15,
  },
  supportBold: {
    fontWeight: '900',
  },
});

export default OrderConfirmation;

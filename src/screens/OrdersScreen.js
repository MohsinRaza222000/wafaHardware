import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useSelector } from 'react-redux';
import { apiRequest } from '../services/apiService';
import { ENDPOINTS } from '../config/api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useTranslation } from 'react-i18next';

const STATUS_COLORS = {
  pending:    '#e67e22',
  PENDING:    '#e67e22',
  processing: '#3498db',
  PROCESSING: '#3498db',
  delivered:  '#27ae60',
  DELIVERED:  '#27ae60',
  completed:  '#455a64',
  COMPLETED:  '#455a64',
  cancelled:  '#c0392b',
  CANCELLED:  '#c0392b',
};

const OrdersScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors, dark } = useTheme();
  
  // Resolve user identity from multiple potential state sources for maximum reliability
  const authUser = useSelector((state) => state.auth.user);
  const userProfile = useSelector((state) => state.user.profile);
  const resolvedUid = userProfile?.uid || authUser?.uid;

  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState(null);

  const fetchOrders = useCallback(async () => {
    // SECURITY: Strictly ensure we have a valid User ID before making any database requests
    if (!resolvedUid || typeof resolvedUid !== 'string' || resolvedUid.trim() === '') {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await apiRequest(ENDPOINTS.ORDERS_GET(resolvedUid));
      const transformed = data.map((o) => ({
        _id:      o._id,
        shortId:  o._id.length >= 18 ? o._id.substring(18).toUpperCase() : o._id.toUpperCase(),
        date:     new Date(o.createdAt).toLocaleDateString('en-PK', {
          year: 'numeric', month: 'short', day: 'numeric',
        }),
        total:    `Rs. ${(o.totalAmount || 0).toLocaleString()}`,
        status:   (o.status || 'pending').toUpperCase(),
        itemCount: o.items?.length || 0,
      }));
      setOrders(transformed);
    } catch (err) {
      setError(t('OrderLoadError'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [resolvedUid]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const onRefresh = () => { setRefreshing(true); fetchOrders(); };

  const cardBg     = dark ? '#1e1e1e' : '#ffffff';
  const dividerClr = dark ? '#333'    : '#eee';

  return (
    <ScreenContainer>
      <Header />
      <View style={[styles.headerRow, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.headerText} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.subtitle, { color: colors.accent }]}>{t('ACTIVESESSIONS')}</Text>
          <Text style={[styles.title, { color: colors.headerText }]}>{t('MyOrders')}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.primary }]}>{t('FETCHINGORDERS')}</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <MaterialCommunityIcons name="wifi-off" size={60} color="#666" />
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryBtn, { borderColor: colors.primary }]} onPress={fetchOrders}>
            <Text style={[styles.retryText, { color: colors.primary }]}>{t('RETRY')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        >
          {orders.length === 0 ? (
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons name="clipboard-text-search-outline" size={80} color={dark ? '#333' : '#ccc'} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('NoActiveOrders')}</Text>
              <Text style={styles.emptySubtitle}>
                {t('OrdersTrackingDesc')}
              </Text>
            </View>
          ) : (
            orders.map((order) => (
              <View key={order._id} style={[styles.orderCard, { backgroundColor: cardBg }]}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderId}># {order.shortId}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[order.status] || '#607d8b' }]}>
                    <Text style={styles.statusText}>{order.status}</Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: dividerClr }]} />

                <View style={styles.orderFooter}>
                  <View style={styles.footerCol}>
                    <Text style={styles.footerLabel}>{t('ASSETCOUNT')}</Text>
                    <Text style={[styles.footerValue, { color: colors.text }]}>{order.itemCount} {t('ItemsLabel')}</Text>
                  </View>
                  <View style={styles.footerCol}>
                    <Text style={styles.footerLabel}>{t('TOTALCREDIT')}</Text>
                    <Text style={[styles.footerValue, { color: colors.primary }]}>{order.total}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.viewBtn, { borderColor: colors.primary }]}
                    onPress={() => navigation.navigate('OrderHistory')}
                  >
                    <Text style={[styles.viewBtnText, { color: colors.primary }]}>{t('LOGDETAILS')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <BottomNav />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 10 },
  backBtn:   { marginRight: 15 },
  subtitle:  { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  title:     { fontSize: 24, fontWeight: '900' },
  scrollContent: { padding: 15, paddingBottom: 40 },
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText: { marginTop: 15, fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  errorText: { fontSize: 13, fontWeight: '600', textAlign: 'center', marginTop: 15, marginBottom: 20 },
  retryBtn:  { borderWidth: 1.5, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 4 },
  retryText: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  emptyBox:  { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyTitle:    { fontSize: 20, fontWeight: '900', marginTop: 20, marginBottom: 10 },
  emptySubtitle: { color: '#666', textAlign: 'center', lineHeight: 20 },
  orderCard: {
    borderRadius: 12, padding: 15, marginBottom: 15,
    elevation: 3, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  orderId:   { fontSize: 16, fontWeight: '800', color: '#999', letterSpacing: 1.5 },
  orderDate: { fontSize: 12, color: '#666', fontWeight: '600', marginTop: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 },
  statusText:  { color: '#fff', fontSize: 10, fontWeight: '900' },
  divider:   { height: 1, marginBottom: 15 },
  orderFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footerCol:   { flex: 1 },
  footerLabel: { fontSize: 8, fontWeight: '900', color: '#666', letterSpacing: 0.8, marginBottom: 2 },
  footerValue: { fontSize: 14, fontWeight: '700' },
  viewBtn:     { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 },
  viewBtnText: { fontSize: 10, fontWeight: '900' },
});

export default OrdersScreen;

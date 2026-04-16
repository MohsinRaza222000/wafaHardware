import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';


import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenContainer from '../components/ScreenContainer';
import { apiRequest } from '../services/apiService';
import { ENDPOINTS } from '../config/api';
import { showToast } from '../store/uiActions';
import { useTranslation } from 'react-i18next';


const AdminInventoryScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const { colors, dark } = useTheme();


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState(route.params?.filter || 'all'); // 'all' or 'low'

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(ENDPOINTS.PRODUCTS);
      setProducts(data || []);
    } catch (error) {
      console.error('Fetch Error:', error);
      Alert.alert('Error', 'Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (route.params?.filter) {
        setFilterMode(route.params.filter);
      }
      fetchProducts();
    }, [route.params?.filter])
  );

  const handleDelete = (id, title) => {
    Alert.alert(
      t('CONFIRMREMOVAL'),
      `${t('PermanentlyPurge')} ${title}?`,
      [
        { text: t('ABORT'), style: "cancel" },
        { 
          text: t('CONFIRMPURGE'), 
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await apiRequest(`${ENDPOINTS.PRODUCTS}/${id}`, { method: 'DELETE' });
              if (response.success) {
                dispatch(showToast(`${title} deleted`, 'success'));
                fetchProducts();
              }

            } catch (err) {
              Alert.alert('Error', 'Deletion failed.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const filteredProducts = products.filter(p => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      p.title?.toLowerCase().includes(query) || 
      p.category?.toLowerCase().includes(query) ||
      t(p.category?.replace(' ', ''))?.toLowerCase().includes(query);
    
    const matchesFilter = filterMode === 'low' ? (p.stock || 0) < 5 : true;
    
    return matchesSearch && matchesFilter;
  });

  const renderProductItem = ({ item }) => (
    <View style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardMain}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardDetails}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
            {item.stock < 5 && (
               <View style={styles.lowStockPill}>
                  <Text style={styles.lowStockText}>{t('LOW')}</Text>
               </View>
            )}
          </View>
          <Text style={[styles.cardSku, { color: colors.textSecondary }]}>{item.sku || 'NO-SKU'}</Text>
          
          <View style={styles.metricsBar}>
             <View style={styles.metric}>
                <Text style={styles.metricLabel}>{t('PRICE')}</Text>
                <Text style={[styles.metricValue, { color: colors.primary }]}>Rs. {item.price?.toLocaleString()}</Text>
             </View>
             <View style={styles.metricDivider} />
             <View style={styles.metric}>
                <Text style={styles.metricLabel}>{t('STOCK')}</Text>
                <Text style={[styles.metricValue, { color: item.stock < 5 ? '#ba1a1a' : '#4CAF50' }]}>
                  {item.stock || 0} {t('UNIT')}
                </Text>
             </View>
          </View>
        </View>
      </View>

      <View style={styles.cardActions}>
         <TouchableOpacity 
           style={[styles.actionBtn, { borderColor: colors.border }]}
           onPress={() => navigation.navigate('AddNewProduct', { product: item })}
         >
            <MaterialCommunityIcons name="pencil-outline" size={16} color={colors.text} />
            <Text style={[styles.actionBtnText, { color: colors.text }]}>{t('EDIT')}</Text>
         </TouchableOpacity>
         <TouchableOpacity 
           style={[styles.actionBtn, { backgroundColor: dark ? '#311' : '#ffebee', borderColor: dark ? '#522' : '#ffcdd2' }]}
           onPress={() => handleDelete(item._id, item.title)}
         >
            <MaterialCommunityIcons name="delete-outline" size={16} color="#ba1a1a" />
            <Text style={[styles.actionBtnText, { color: "#ba1a1a" }]}>{t('DELETE')}</Text>
         </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
           <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {/* Header */}

      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
         <View style={styles.headerTitleRow}>
            <MaterialCommunityIcons name="package-variant" size={24} color={colors.primary} />
            <Text style={[styles.headerTitle, { color: colors.text }]}>{t('INVENTORYMANAGEMENT')}</Text>
         </View>
         <TouchableOpacity 
           style={[styles.addBtn, { backgroundColor: colors.primary }]}
           onPress={() => navigation.navigate('AddNewProduct')}
         >
            <MaterialCommunityIcons name="plus" size={20} color="#fff" />
         </TouchableOpacity>
      </View>

      {/* Filter Tabs & Search */}
      <View style={[styles.controlsContainer, { backgroundColor: colors.background }]}>
         <View style={styles.filterTabs}>
            <TouchableOpacity 
              style={[styles.tab, filterMode === 'all' && { borderBottomColor: colors.primary }]}
              onPress={() => setFilterMode('all')}
            >
               <Text style={[styles.tabText, { color: filterMode === 'all' ? colors.primary : colors.textSecondary }]}>{t('ALLITEMS')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, filterMode === 'low' && { borderBottomColor: '#ba1a1a' }]}
              onPress={() => setFilterMode('low')}
            >
               <Text style={[styles.tabText, { color: filterMode === 'low' ? '#ba1a1a' : colors.textSecondary }]}>{t('LOWSTOCK')}</Text>
            </TouchableOpacity>
         </View>

         <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} />
            <TextInput 
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={t('SearchByNameCategory')}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialCommunityIcons name="close-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
         </View>
      </View>

      {loading && !products.length ? (
        <View style={styles.center}>
           <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList 
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
               <MaterialCommunityIcons name="package-variant-closed" size={60} color={colors.border} />
               <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                 {searchQuery || filterMode === 'low' ? t('NOPRODUCTSFOUND') : t('NOASSETSLOGGED')}
               </Text>
            </View>
          )}
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  controlsContainer: {
    padding: 20,
    gap: 15,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 20,
  },
  tab: {
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  productCard: {
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  cardDetails: {
    flex: 1,
    marginLeft: 15,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  lowStockPill: {
    backgroundColor: '#ba1a1a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lowStockText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#fff',
  },
  cardSku: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  metricsBar: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
    gap: 15,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: '#888',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '900',
  },
  metricDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#eee',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    gap: 8,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '900',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 15,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default AdminInventoryScreen;

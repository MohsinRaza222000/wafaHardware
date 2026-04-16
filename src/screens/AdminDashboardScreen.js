import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/authActions';
import { useTranslation } from 'react-i18next';

// Shared Components
import ScreenContainer from '../components/ScreenContainer';
import { apiRequest } from '../services/apiService';
import { ENDPOINTS } from '../config/api';

const { width } = Dimensions.get('window');

const AdminDashboardScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors, dark } = useTheme();

  const handleLogout = async () => {
    try {
      await auth().signOut();
      dispatch(clearUser());
    } catch (e) {
      console.log('Error signing out:', e);
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const [stats, setStats] = useState({
    activeUsers: 0,
    totalProducts: 0,
    activeOrders: 0,
    lowStock: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(ENDPOINTS.ADMIN_STATS);
      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error('Stats Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={styles.headerTitleContainer}>
          <MaterialCommunityIcons name="shield-check" size={24} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('SHOPOWNER')}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color={colors.primary} />
          <Text style={[styles.logoutText, { color: colors.primary }]}>{t('SIGNOUT')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background }]}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.sectionLabel}>{t('SHOPSTATUS')}</Text>
          <Text style={[styles.mainTitle, { color: colors.text }]}>{t('ShopOwner')}</Text>
        </View>

        {/* 3 Key Metrics Grid */}
        <View style={styles.metricsGrid}>
          {/* Active Users */}
          <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>{t('ALLCUSTOMERS')}</Text>
              <MaterialCommunityIcons name="account-group" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>{stats.activeUsers}</Text>
          </View>

          {/* Active Orders */}
          <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>{t('TODAYSORDERS')}</Text>
              <MaterialCommunityIcons name="clipboard-list" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>{stats.activeOrders}</Text>
          </View>

          {/* Product Details (Inventory) */}
          <View style={[styles.metricCard, { backgroundColor: colors.surface, width: '100%' }]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>{t('SHOPSTOCK')}</Text>
              <MaterialCommunityIcons name="package-variant-closed" size={20} color={colors.primary} />
            </View>
            <View style={styles.inventoryInfo}>
              <TouchableOpacity 
                style={styles.inventoryStatItem}
                onPress={() => navigation.navigate('AdminInventory', { filter: 'all' })}
              >
                <Text style={[styles.metricValue, { color: colors.text, fontSize: 32, marginBottom: 5 }]}>{stats.totalProducts}</Text>
                <Text style={styles.inventorySub}>{t('TOTALITEMS')}</Text>
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <TouchableOpacity 
                style={styles.inventoryStatItem}
                onPress={() => navigation.navigate('AdminInventory', { filter: 'low' })}
              >
                <Text style={[styles.metricValue, { color: '#ba1a1a', fontSize: 32, marginBottom: 5 }]}>{stats.lowStock}</Text>
                <Text style={styles.inventorySub}>{t('LOWSTOCK')}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.metricBtn, { backgroundColor: '#1b1c1c' }]}
              onPress={() => navigation.navigate('AdminInventory')}
            >
              <Text style={styles.metricBtnText}>{t('CHECKSTOCK')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>{t('APPSTATUS')}<Text style={{color: '#4CAF50'}}>{t('WORKINGFINE')}</Text></Text>
          <Text style={styles.footerText}>{t('LASTUPDATE')}</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    height: 80,
    borderBottomWidth: 1,
    paddingTop: 10,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    marginLeft: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a04100',
  },
  logoutText: {
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 5,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  welcomeSection: {
    padding: 25,
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#a04100',
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  metricsGrid: {
    padding: 25,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 65) / 2,
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  metricLabel: {
    fontSize: 10,
    color: '#545e76',
    fontWeight: '900',
    letterSpacing: 1,
  },
  metricValue: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 20,
  },
  metricBtn: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  inventoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  inventoryStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  inventorySub: {

    fontSize: 9,
    color: '#8e7164',
    fontWeight: '900',
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
  },
  footerInfo: {
    paddingHorizontal: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#8e7164',
    letterSpacing: 1,
    marginBottom: 5,
  },
});

export default AdminDashboardScreen;

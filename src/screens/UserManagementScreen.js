import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { MOCK_USERS } from '../config/constants';
import { useTheme } from '../context/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// Shared Components
import ScreenContainer from '../components/ScreenContainer';
import { apiRequest } from '../services/apiService';
import { ENDPOINTS } from '../config/api';

const { width } = Dimensions.get('window');

const UserManagementScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors, dark } = useTheme();

  // Real Data State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadRealUsers = async (isRefreshing = false) => {
    try {
      if (isRefreshing) setRefreshing(true);
      else setLoading(true);

      const data = await apiRequest(ENDPOINTS.USERS);
      
      // Map MongoDB User model to UI model
      const mappedUsers = (data || []).map(u => ({
        id: u._id,
        name: u.fullName,
        email: u.email,
        phone: u.phone || 'N/A',
        address: u.address || 'N/A',
        avatar: u.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        role: u.role || 'user',
        online: true // In a real app, this would come from a presence system
      }));

      setUsers(mappedUsers);
    } catch (err) {
      console.error('Fetch Users Error:', err.message);
      // Fallback or Alert
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadRealUsers();
    }, [])
  );



  const renderUserItem = ({ item }) => (
    <View style={[styles.userCard, { backgroundColor: dark ? '#1a1a1a' : '#fff', borderColor: dark ? '#333' : '#eee' }]}>
       <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
             <Image source={{ uri: item.avatar }} style={styles.avatar} />
             {item.online && <View style={styles.onlineDot} />}
          </View>
          <View style={styles.userInfo}>
             <Text style={[styles.userName, { color: dark ? '#fff' : '#333' }]}>{item.name}</Text>
             <Text style={styles.userEmail}>{item.email}</Text>
             {item.phone && <Text style={[styles.userEmail, { color: '#888', marginTop: 0 }]}>{item.phone}</Text>}
             {item.address && <Text style={[styles.userEmail, { color: '#888', marginTop: 0, fontStyle: 'italic' }]} numberOfLines={1}>{item.address}</Text>}
             <View style={[styles.roleBadge, { backgroundColor: dark ? '#333' : '#f0f0f0' }]}>
                <Text style={[styles.roleText, { color: dark ? '#bbb' : '#666' }]}>{item.role.toUpperCase()}</Text>
             </View>
          </View>
       </View>
        
       {/* Card Footer: Informational only */}
       <View style={styles.cardFooter}>
            <Text style={styles.timestampText}>{t('REGISTERED_ON')}: {new Date().toLocaleDateString()}</Text>
       </View>
    </View>
  );

  return (
    <ScreenContainer>
      {/* Top Bar / Header */}
      <View style={[styles.header, { backgroundColor: dark ? '#000' : '#fcfcfc' }]}>
         <View style={styles.headerLeft}>
            <MaterialCommunityIcons name="cog-refresh-outline" size={24} color="#F26B00" />
            <Text style={[styles.headerTitle, { color: dark ? '#fff' : '#000' }]}>{t('ADMINPANEL')}</Text>
         </View>
         <View style={[styles.avatarMini, { backgroundColor: '#4a5b6d' }]}>
             <Text style={styles.avatarText}>AU</Text>
         </View>
      </View>

      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={() => loadRealUsers(true)}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
             <MaterialCommunityIcons name="account-search-outline" size={60} color="#999" />
             <Text style={{ color: '#999', marginTop: 10 }}>{t('NOCUSTOMERSFOUND')}</Text>
          </View>
        )}
        ListHeaderComponent={() => (
           <View style={styles.listHeader}>
              <View style={styles.statusRow}>
                 <Text style={styles.statusLabel}>{t('DIRECTORYACCESS')} <Text style={{ color: loading ? '#93278f' : '#4CAF50', fontWeight: 'bold' }}>{loading ? t('SYNCING') : t('SECURE')}</Text></Text>
                 <Text style={[styles.pageTitle, { color: dark ? '#fff' : '#000' }]}>{t('USERDIRv1')}</Text>
              </View>
              
              <View style={styles.metricsRow}>
                 <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>{t('TOTALUSERS')}</Text>
                    <Text style={[styles.metricValue, { color: colors.primary }]}>{users.length}</Text>
                 </View>
                 <View style={styles.verticalDivider} />
                 <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>{t('ONLINE')}</Text>
                    <Text style={[styles.metricValue, { color: '#4CAF50' }]}>{users.filter(u => u.online).length}</Text>
                 </View>
              </View>
           </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginLeft: 10,
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  listContainer: {
    paddingHorizontal: 22,
    paddingTop: 35,
    paddingBottom: 40,
  },
  listHeader: {
    marginBottom: 35,
  },
  statusRow: {
    marginBottom: 25,
  },
  statusLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 5,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 9,
    color: '#999',
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#eee',
    marginHorizontal: 20,
  },
  userCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 10,
  },
  onlineDot: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  userEmail: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
    fontWeight: '500',
  },
  roleBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardFooter: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  timestampText: {
    fontSize: 9,
    color: '#bbb',
    fontStyle: 'italic',
  },
});

export default UserManagementScreen;

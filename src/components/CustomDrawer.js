import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { clearUser } from '../store/authActions';
import { clearUserProfile } from '../store/userActions';

const CustomDrawer = (props) => {
  const { navigation } = props;
  const { colors, dark } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert(
      t('Logout', 'Logout'),
      t('LogoutConfirm', 'Are you sure you want to log out?'),
      [
        { text: t('Cancel', 'Cancel'), style: 'cancel' },
        { 
          text: t('Yes', 'Yes'), 
          style: 'destructive',
          onPress: async () => {
            try {
              await auth().signOut();
              dispatch(clearUser());
              dispatch(clearUserProfile());
              // Navigation to Login usually happens via AppNavigator listener
            } catch (error) {
              console.error('Logout failed:', error);
            }
          }
        }
      ]
    );
  };

  const renderSectionHeader = (title) => (
    <View style={styles.sectionHeader}>
       <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t(title.replace(/\s+/g, ''), title).toUpperCase()}</Text>
       <View style={[styles.sectionLine, { backgroundColor: colors.border }]} />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Drawer Header */}
      <View style={[styles.drawerHeader, { backgroundColor: dark ? colors.surfaceSecondary : colors.primary }]}>
        <View style={styles.headerContent}>
          <View style={[styles.logoCircle, { backgroundColor: colors.surface }]}>
             <Text style={[styles.logoLetter, { color: dark ? colors.surfaceSecondary : colors.primary }]}>W</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.logoText}>{t('WafaHardware').toUpperCase()}</Text>
            <View style={styles.secureBadge}>
               <Text style={styles.secureDot}>●</Text>
               <Text style={styles.secureText}>SHAHPUR CITY · HARDWARE STORE</Text>
            </View>
          </View>
        </View>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        <View style={styles.menuContainer}>
          
          {renderSectionHeader('Shop')}
          <DrawerItem 
            icon="home-variant" 
            label={t('Home', 'Home')} 
            onPress={() => navigation.navigate('ShopFlow', { screen: 'Home' })} 
            colors={colors}
          />
          <DrawerItem 
            icon="view-grid" 
            label={t('CategoriesDrawer', 'Categories')} 
            onPress={() => navigation.navigate('ShopFlow', { screen: 'Categories' })} 
            colors={colors}
          />
          <DrawerItem 
            icon="cart" 
            label={t('Cart', 'Cart')} 
            onPress={() => navigation.navigate('ShopFlow', { screen: 'Cart' })} 
            colors={colors}
          />

          {renderSectionHeader('My Account')}
          <DrawerItem 
            icon="clipboard-text" 
            label={t('OrderHistory', 'ORDER HISTORY')} 
            onPress={() => navigation.navigate('OrderHistory')} 
            colors={colors}
          />
          <DrawerItem 
            icon="account" 
            label={t('Profile', 'My Profile')} 
            onPress={() => navigation.navigate('Profile')} 
            colors={colors}
          />
          <DrawerItem 
            icon="cog" 
            label={t('Settings', 'Settings')} 
            onPress={() => navigation.navigate('Settings')} 
            colors={colors}
          />
          <DrawerItem 
            icon="deskphone" 
            label={t('ContactUs', 'Contact Us')} 
            onPress={() => navigation.navigate('Contact')} 
            colors={colors}
          />
          <DrawerItem 
            icon="logout" 
            label={t('SIGNOUT', 'Log Out')} 
            onPress={handleLogout} 
            colors={colors}
          />
          
        </View>
      </DrawerContentScrollView>

      {/* Drawer Footer */}
      <View style={[styles.drawerFooter, { borderTopColor: colors.border, backgroundColor: dark ? colors.surfaceSecondary : colors.surfaceSecondary }]}>
        <View style={styles.footerInfo}>
           <Text style={styles.versionText}>WAFA HARDWARE v1.0.0</Text>
           <Text style={styles.copyrightText}>© 2026 WAFA HARDWARE · SHAHPUR CITY</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const DrawerItem = ({ iconSet: IconSet = MaterialCommunityIcons, icon, label, onPress, colors }) => (
  <TouchableOpacity 
    style={[styles.menuItem, { backgroundColor: 'transparent' }]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.itemIconContainer}>
       <IconSet name={icon} size={20} color={colors.text} />
    </View>
    <Text style={[styles.menuLabel, { color: colors.text }]}>{label.toUpperCase()}</Text>
  </TouchableOpacity>
);

const BRAND_ORANGE = '#d9651b';
const BRAND_RED = '#8B2323';

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 16,
    paddingTop: 20,
    backgroundColor: '#8B2323',
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoLetter: {
    fontSize: 28,
    fontWeight: '900',
    color: '#8B2323',
  },
  headerText: {
    flex: 1,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1.5,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
    opacity: 0.7,
  },
  secureDot: {
    fontSize: 8,
    color: '#27ae60',
  },
  secureText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
  },
  menuContainer: {
    paddingTop: 6,
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
    paddingHorizontal: 10,
    gap: 15,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    opacity: 0.1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 2,
  },
  itemIconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginRight: 10,
  },
  menuIcon: {
    fontSize: 16,
  },
  menuLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  drawerFooter: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderTopWidth: 1,
  },
  footerInfo: {
    alignItems: 'flex-start',
  },
  versionText: {
    fontSize: 8,
    color: '#777',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  copyrightText: {
    fontSize: 7,
    color: '#999',
    marginTop: 4,
    fontWeight: '700',
  },
});

export default CustomDrawer;

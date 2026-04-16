import React from 'react';
import { Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '../context/ThemeContext';

// Components
import CustomDrawer from '../components/CustomDrawer';

// Navigators
import ShopNavigator from './ShopNavigator';

// Individual Drawer Screens
import ContactUsScreen from '../screens/ContactUsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import OrderHistory from '../screens/OrderHistory';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      initialRouteName="ShopFlow"
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: { 
          backgroundColor: colors.background, 
          width: Dimensions.get('window').width * 0.72 
        },
      }}
    >
      {/* The main browsing and shopping stack */}
      <Drawer.Screen name="ShopFlow" component={ShopNavigator} options={{ drawerLabel: 'Home' }} />
      
      {/* Independent Drawer Screens */}
      <Drawer.Screen name="Orders" component={OrdersScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="OrderHistory" component={OrderHistory} />
      <Drawer.Screen name="Projects" component={ProjectsScreen} />
      <Drawer.Screen name="Contact" component={ContactUsScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

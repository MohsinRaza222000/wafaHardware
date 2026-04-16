import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';

// Screens
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminInventoryScreen from '../screens/AdminInventoryScreen';
import AddNewProductScreen from '../screens/AddNewProductScreen';
import UserManagementScreen from '../screens/UserManagementScreen';


const Stack = createNativeStackNavigator();




// Admin Bottom Tab Simulation
const AdminBottomBar = ({ navigation, activeRoute }) => {
  const { colors, dark } = useTheme();

  return (
    <View style={[styles.bottomBar, { backgroundColor: '#f0f0f0', borderTopColor: colors.border }]}>
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => navigation.navigate('AdminDashboard')}
      >
        <MaterialCommunityIcons name="view-dashboard" size={24} color={activeRoute === 'AdminDashboard' ? '#F26B00' : '#777'} />
        <Text style={[styles.tabLabel, { color: activeRoute === 'AdminDashboard' ? '#F26B00' : '#777' }]}>OVERVIEW</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => navigation.navigate('AdminInventory')}
      >
        <MaterialCommunityIcons name="package-variant" size={24} color={activeRoute === 'AdminInventory' ? '#F26B00' : '#777'} />
        <Text style={[styles.tabLabel, { color: activeRoute === 'AdminInventory' ? '#F26B00' : '#777' }]}>INVENTORY</Text>
      </TouchableOpacity>


      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => navigation.navigate('AdminUsers')}
      >
        <MaterialCommunityIcons name="account-group-outline" size={24} color={activeRoute === 'AdminUsers' ? '#F26B00' : '#777'} />
        <Text style={[styles.tabLabel, { color: activeRoute === 'AdminUsers' ? '#F26B00' : '#777' }]}>USERS</Text>
      </TouchableOpacity>
    </View>
  );
};

const AdminScreenWrapper = ({ children, navigation, routeName }) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {children}
      </View>
      <AdminBottomBar navigation={navigation} activeRoute={routeName} />
    </View>
  );
};

const AdminNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="AdminDashboard">
        {(props) => (
          <AdminScreenWrapper {...props} routeName="AdminDashboard">
            <AdminDashboardScreen {...props} />
          </AdminScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="AdminInventory">
        {(props) => (
          <AdminScreenWrapper {...props} routeName="AdminInventory">
            <AdminInventoryScreen {...props} />
          </AdminScreenWrapper>
        )}
      </Stack.Screen>

      <Stack.Screen name="AddNewProduct" component={AddNewProductScreen} options={{ animation: 'slide_from_right' }} />


      <Stack.Screen name="AdminUsers">
        {(props) => (
          <AdminScreenWrapper {...props} routeName="AdminUsers">
            <UserManagementScreen {...props} />
          </AdminScreenWrapper>
        )}
      </Stack.Screen>

    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({

  bottomBar: {
    flexDirection: 'row',
    height: 65,
    borderTopWidth: 1,
    paddingBottom: 5,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 8,
    fontWeight: '900',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});

export default AdminNavigator;

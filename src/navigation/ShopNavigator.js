import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ProductListing from '../screens/ProductListing';
import ProductDetails from '../screens/ProductDetails';
import CartScreen from '../screens/CartScreen';
import CheckOut from '../screens/CheckOut';
import Payment from '../screens/Payment';
import OrderReview from '../screens/OrderReview';
import OrderConfirmation from '../screens/OrderConfirmation';
import MapScreen from '../screens/MapScreen';

const Stack = createNativeStackNavigator();

const ShopNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="ProductListing" component={ProductListing} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="CheckOut" component={CheckOut} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="OrderReview" component={OrderReview} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
    </Stack.Navigator>
  );
};

export default ShopNavigator;

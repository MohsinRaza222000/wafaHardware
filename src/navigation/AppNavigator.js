import React, { useEffect, useState } from 'react';

import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { setUser, clearUser } from '../store/authActions';
import { fetchUserProfile, clearUserProfile } from '../store/userActions';

// Navigators
import DrawerNavigator from './DrawerNavigator';
import AdminNavigator from './AdminNavigator';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { colors, dark } = useTheme();
  const dispatch = useDispatch();
  const { isAuthenticated, isBooted, user } = useSelector((state) => state.auth);
  const [isVideoFinished, setIsVideoFinished] = useState(false);



  useEffect(() => {
    // 1. Initial Boot: Restore session and role from cache
    const initializeAuth = async () => {
      try {
        const cached = await AsyncStorage.getItem('cached_user_profile');
        if (cached) {
          const parsed = JSON.parse(cached);
          dispatch(setUser(parsed));
        }
      } catch (err) {
        console.warn('Boot session restore failed:', err);
      }
    };

    initializeAuth();

    // 2. Auth Listener: Sync with Firebase identity
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // We ONLY dispatch Firebase info. 
        // Our reducer's merge logic ensures we don't lose 'isAdminMode' if it's already set from Step 1 or Login.
        dispatch(setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'User',
        }));
        
        dispatch(fetchUserProfile(firebaseUser.uid));
      } else {
        dispatch(clearUser());
        dispatch(clearUserProfile());
      }
    });

    return unsubscribe;
  }, [dispatch]);



  // Handle the initial boot/check phase AND wait for the splash video to complete
  if (!isBooted || !isVideoFinished) {
    return <SplashScreen onVideoEnd={() => setIsVideoFinished(true)} />;
  }


  const isAdmin = 
    user?.email?.toLowerCase() === 'wafahardware@gmail.com' &&
    user?.isAdminMode === true;



  const navigationTheme = {
    ...dark ? DarkTheme : DefaultTheme,
    colors: {
      ...dark ? DarkTheme.colors : DefaultTheme.colors,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          ) : isAdmin ? (
            <Stack.Screen name="AdminMain" component={AdminNavigator} />
          ) : (
            <Stack.Screen name="Main" component={DrawerNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default AppNavigator;

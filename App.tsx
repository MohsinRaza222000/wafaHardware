import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import notifee, { AndroidStyle } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import i18n from './src/i18n';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import { store } from './src/store/store';
import { ThemeProvider } from './src/context/ThemeContext';
import { notificationService } from './src/services/notificationService';


// Navigators
import AppNavigator from './src/navigation/AppNavigator';

// Global Components
import AppLoader from './src/components/AppLoader';
import GlobalToast from './src/components/GlobalToast';


function App() {

  useEffect(() => {
    initApp();

    const unsubscribeForeground = handleForegroundNotifications();

    return () => {
      unsubscribeForeground && unsubscribeForeground();
    };
  }, []);

  // 🔥 INIT ALL
  const initApp = async () => {
    await requestUserPermission();
    await createChannel();
    await initFCM();
  };

  // 🔥 1. Permission (IMPORTANT for Android 13+)
  const requestUserPermission = async () => {
    try {
      await messaging().requestPermission();

      if (Platform.OS === 'android' && Platform.Version >= 33) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      }

      console.log('✅ Notification permission granted');
    } catch (error) {
      console.log('❌ Permission error:', error);
    }
  };

  // 🔥 2. Initialize FCM
  const initFCM = async () => {
    try {
      const enabled = await notificationService.getLocalPreference();
      const status = await notificationService.checkPermissionStatus();
      
      if (enabled && status === 'granted') {
          await notificationService.syncTopicSubscription(true);
      } else {
          await notificationService.syncTopicSubscription(false);
      }

      const token = await messaging().getToken();
      console.log('🔥 FCM Token:', token);

    } catch (error) {
      console.log('❌ FCM Init Error:', error);
    }
  };


  // 🔥 3. Create Notification Channel
  const createChannel = async () => {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: 4, // HIGH importance
      });
    }
  };

  // 🔥 4. Foreground Notifications
  const handleForegroundNotifications = () => {
    return messaging().onMessage(async remoteMessage => {
      console.log('📩 Foreground Message:', remoteMessage);

      const notifData = remoteMessage.data || {};
      const notifImage = remoteMessage.notification?.android?.imageUrl || remoteMessage.notification?.image || notifData.image;

      await notifee.displayNotification({
        title: remoteMessage.notification?.title || notifData.title || 'New Notification',
        body: remoteMessage.notification?.body || notifData.body || '',
        android: {
          channelId: 'default',
          smallIcon: 'ic_launcher',
          largeIcon: notifImage,
          style: notifImage ? { 
            type: AndroidStyle.BIGPICTURE, 
            picture: notifImage 
          } : undefined,
          pressAction: {
            id: 'default',
          },
        },
      });
    });
  };

  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <SafeAreaProvider>
          <ThemeProvider>
            <AppNavigator />
            <AppLoader />
            <GlobalToast />
          </ThemeProvider>

        </SafeAreaProvider>
      </Provider>
    </I18nextProvider>
  );
}

export default App;
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidStyle } from '@notifee/react-native';

// 🔥 Background & Quit State Notification Handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background Message:', remoteMessage);

  const notifData = remoteMessage.data || {};
  const notifImage = remoteMessage.notification?.android?.imageUrl || remoteMessage.notification?.image || notifData.image;

  // Only display dynamically if FCM doesn't auto-display a notification block
  if (!remoteMessage.notification) {
    await notifee.displayNotification({
      title: notifData.title || 'New Notification',
      body: notifData.body || '',
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
  }
});

AppRegistry.registerComponent(appName, () => App);

import messaging from '@react-native-firebase/messaging';
import { Platform, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOPIC = 'allUsers';
const PREF_KEY = '@notifications_enabled';

export const notificationService = {
  /**
   * Checks the current system notification permission status
   * Returns: 'granted', 'denied', or 'blocked'
   */
  checkPermissionStatus: async () => {
    const authStatus = await messaging().hasPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) return 'granted';
    
    // In many cases, if it's not enabled and we haven't asked yet, it's 'denied'
    // If we have asked and they said no, it's 'blocked' on newer Android/iOS.
    return authStatus === messaging.AuthorizationStatus.NOT_DETERMINED ? 'denied' : 'blocked';
  },

  /**
   * Request permission from the user
   */
  requestPermission: async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
      if (enabled) {
        await notificationService.setLocalPreference(true);
        await notificationService.syncTopicSubscription(true);
      }
      return enabled;
    } catch (error) {
      console.log('Permission Request Error:', error);
      return false;
    }
  },

  /**
   * Opens the system settings for the app
   */
  openSettings: () => {
    Linking.openSettings();
  },

  /**
   * Persists the user's preference locally for this device
   */
  setLocalPreference: async (enabled) => {
    try {
      await AsyncStorage.setItem(PREF_KEY, JSON.stringify(enabled));
    } catch (e) {
      console.error('Error saving pref:', e);
    }
  },

  /**
   * Retrieves the locally saved preference
   */
  getLocalPreference: async () => {
    try {
      const val = await AsyncStorage.getItem(PREF_KEY);
      return val === null ? true : JSON.parse(val); // Default to true
    } catch (e) {
      return true;
    }
  },

  /**
   * Syncs the FCM topic subscription based on preference
   */
  syncTopicSubscription: async (enabled) => {
    try {
      if (enabled) {
        await messaging().subscribeToTopic(TOPIC);
        console.log(`✅ Subscribed to ${TOPIC} on this device`);
      } else {
        await messaging().unsubscribeFromTopic(TOPIC);
        console.log(`❌ Unsubscribed from ${TOPIC} on this device`);
      }
    } catch (error) {
      console.log('Topic Sync Error:', error);
    }
  }
};

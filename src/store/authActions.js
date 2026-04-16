import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from '../services/apiService';
import { ENDPOINTS } from '../config/api';

export const SET_USER = 'SET_USER';
export const CLEAR_USER = 'CLEAR_USER';

export const setUser = (userData) => async (dispatch) => {
  // 1. Update Redux state
  dispatch({
    type: SET_USER,
    payload: userData,
  });

  // 2. Persist to AsyncStorage for "Instant Load" next time
  try {
    await AsyncStorage.setItem('cached_user_profile', JSON.stringify(userData));
  } catch (err) {
    console.warn('Could not cache user profile:', err);
  }
};

export const clearUser = () => async (dispatch) => {
  dispatch({ type: CLEAR_USER });
  try {
    await AsyncStorage.removeItem('cached_user_profile');
  } catch (err) {
    console.warn('Could not clear user cache:', err);
  }
};

export const fetchUserProfile = (uid) => async (dispatch) => {
  try {
    const response = await apiRequest(ENDPOINTS.USER_GET(uid));
    
    if (response && response.success && response.user) {
      dispatch({
        type: SET_USER,
        payload: response.user,
      });
      
      // Persist the full profile
      await AsyncStorage.setItem('cached_user_profile', JSON.stringify(response.user));
    }
  } catch (error) {
    console.warn('Fetch User Profile Error (DB sync failed):', error.message);
  }
};

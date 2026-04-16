import { apiRequest } from '../services/apiService';
import { ENDPOINTS } from '../config/api';
import { setLoading } from './uiActions';

export const SET_USER_PROFILE = 'SET_USER_PROFILE';
export const CLEAR_USER_PROFILE = 'CLEAR_USER_PROFILE';
export const SET_USER_LOADING = 'SET_USER_LOADING';

export const setUserProfile = (profileData) => ({
  type: SET_USER_PROFILE,
  payload: profileData,
});

export const clearUserProfile = () => ({
  type: CLEAR_USER_PROFILE,
});

export const fetchUserProfile = (uid) => async (dispatch) => {
  dispatch(setLoading(true, 'SYNCING PROFILE...'));
  
  try {
    const response = await apiRequest(ENDPOINTS.USER_GET(uid));
    
    if (response && response.success && response.user) {
      dispatch(setUserProfile(response.user));
    }
  } catch (error) {
    console.error('[REDUX] FETCH USER PROFILE ERROR:', error.message);
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateUserProfile = (profileData) => async (dispatch) => {
  try {
    const response = await apiRequest(ENDPOINTS.USER_UPDATE, {
      method: 'POST',
      body: JSON.stringify(profileData),
    });

    if (response && response.success && response.user) {
      dispatch(setUserProfile(response.user));
      return { success: true };
    }
    return { success: false, message: 'Update failed' };
  } catch (error) {
    console.error('[REDUX] UPDATE USER PROFILE ERROR:', error.message);
    return { success: false, message: error.message };
  }
};

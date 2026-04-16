export const SET_LOADING = 'SET_LOADING';
export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDE_TOAST = 'HIDE_TOAST';

export const setLoading = (isLoading, message = 'SYNCHRONIZING...') => ({
  type: SET_LOADING,
  payload: { isLoading, message },
});

export const showToast = (message, toastType = 'success') => ({
  type: SHOW_TOAST,
  payload: { message, toastType },
});

export const hideToast = () => ({
  type: HIDE_TOAST,
});

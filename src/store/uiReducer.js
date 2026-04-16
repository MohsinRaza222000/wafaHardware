import { SET_LOADING, SHOW_TOAST, HIDE_TOAST } from './uiActions';

const initialState = {
  loading: false,
  message: 'SYNCHRONIZING...',
  toast: {
    visible: false,
    message: '',
    toastType: 'success', // 'success', 'error', 'info'
  }
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload.isLoading,
        message: action.payload.message || 'SYNCHRONIZING...',
      };
    case SHOW_TOAST:
      return {
        ...state,
        toast: {
          visible: true,
          message: action.payload.message,
          toastType: action.payload.toastType || 'success',
        }
      };
    case HIDE_TOAST:
      return {
        ...state,
        toast: {
          ...state.toast,
          visible: false,
        }
      };
    default:
      return state;
  }
};

export default uiReducer;

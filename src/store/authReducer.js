import { SET_USER, CLEAR_USER } from './authActions';

const initialState = {
  user: null,
  isAuthenticated: false,
  isBooted: false, // track if the first firebase auth check has completed
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : action.payload,
        isAuthenticated: true,
        isBooted: true,
      };

    case CLEAR_USER:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isBooted: true,
      };
    default:
      return state;
  }
};

export default authReducer;

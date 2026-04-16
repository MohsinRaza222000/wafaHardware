import { SET_USER_PROFILE, CLEAR_USER_PROFILE, SET_USER_LOADING } from './userActions';

const initialState = {
  profile: null,
  loading: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false,
      };
    case SET_USER_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case CLEAR_USER_PROFILE:
      return {
        ...state,
        profile: null,
        loading: false,
      };
    default:
      return state;
  }
};

export default userReducer;

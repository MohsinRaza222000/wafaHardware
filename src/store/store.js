import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import cartReducer from './cartReducer';
import uiReducer from './uiReducer';
import authReducer from './authReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  cart: cartReducer,
  ui: uiReducer,
  auth: authReducer,
  user: userReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

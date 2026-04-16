import { apiRequest } from '../services/apiService';
import { ENDPOINTS } from '../config/api';
import { ToastAndroid, Platform } from 'react-native';
import { showToast } from './uiActions';


export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const INCREMENT_QUANTITY = 'INCREMENT_QUANTITY';
export const DECREMENT_QUANTITY = 'DECREMENT_QUANTITY';
export const CLEAR_CART = 'CLEAR_CART';
export const SET_CART = 'SET_CART';

// Helper to sync with MongoDB
const syncCartWithDB = async (userId, items) => {
  if (!userId) return;
  try {
    await apiRequest(ENDPOINTS.CART_SYNC, {
      method: 'POST',
      body: JSON.stringify({ userId, items }),
    });
  } catch (error) {
    // Silently fail or handle error without cluttering console
  }
};

export const addToCart = (product) => async (dispatch, getState) => {
  dispatch({ type: ADD_TO_CART, payload: product });
  dispatch(showToast('Product added to cart', 'success'));

  
  const { auth, cart } = getState();
  if (auth.user) await syncCartWithDB(auth.user.uid, cart.items);
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({ type: REMOVE_FROM_CART, payload: id });
  const { auth, cart } = getState();
  if (auth.user) await syncCartWithDB(auth.user.uid, cart.items);
};

export const incrementQuantity = (id) => async (dispatch, getState) => {
  dispatch({ type: INCREMENT_QUANTITY, payload: id });
  const { auth, cart } = getState();
  if (auth.user) await syncCartWithDB(auth.user.uid, cart.items);
};

export const decrementQuantity = (id) => async (dispatch, getState) => {
  dispatch({ type: DECREMENT_QUANTITY, payload: id });
  const { auth, cart } = getState();
  if (auth.user) await syncCartWithDB(auth.user.uid, cart.items);
};

export const clearCart = () => async (dispatch, getState) => {
  dispatch({ type: CLEAR_CART });
  const { auth } = getState();
  if (auth.user) await syncCartWithDB(auth.user.uid, []);
};

export const fetchCart = (userId) => async (dispatch) => {
  try {
    const rawItems = await apiRequest(ENDPOINTS.CART_GET(userId));
    // Transform populated items from backend to flat mobile state
    // Filter out items where productId might be null (product deleted from DB)
    const items = rawItems
      .filter(item => item.productId) 
      .map(item => ({
        id: item.productId._id,
        title: item.productId.title,
        price: `Rs. ${item.productId.price.toLocaleString()}`,
        priceValue: item.productId.price,
        image: item.productId.image,
        sku: item.productId.sku || 'N/A',
        quantity: item.quantity
      }));
    dispatch({ type: SET_CART, payload: items });
  } catch (error) {
    // Handle error without console clutter
  }
};

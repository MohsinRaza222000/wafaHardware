export const BASE_URL = 'http://192.168.1.22:5000'; // Updated to your current local IP 192.168.1.14

export const ENDPOINTS = {
  // Auth & User Sync
  USER_SYNC: `${BASE_URL}/api/users/sync`,
  USER_GET: (uid) => `${BASE_URL}/api/users/profile/${uid}`,
  USER_UPDATE: `${BASE_URL}/api/users/sync`, // Reuses upsert route for profile updates
  USERS: `${BASE_URL}/api/users`,
  
  // Cart Sync
  CART_SYNC: `${BASE_URL}/api/cart/sync`,
  CART_GET: (userId) => `${BASE_URL}/api/cart/${userId}`,
  
  // Products
  PRODUCTS: `${BASE_URL}/api/products`,
  PRODUCT_DETAILS: (id) => `${BASE_URL}/api/products/${id}`,
  
  // Orders
  ORDERS_SYNC: `${BASE_URL}/api/orders`,
  ORDERS_GET: (userId) => `${BASE_URL}/api/orders/user/${userId}`,
  
  // Admin Stats
  ADMIN_STATS: `${BASE_URL}/api/admin/stats`,
};

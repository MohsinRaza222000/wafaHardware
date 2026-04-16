import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  INCREMENT_QUANTITY,
  DECREMENT_QUANTITY,
  CLEAR_CART,
  SET_CART,
} from './cartActions';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      let priceValue = 0;
      if (typeof newItem.price === 'string') {
        // Remove "Rs.", "Rs", currency text and unit suffixes like /sheet, /sq.ft, /pair etc.
        const cleaned = newItem.price.replace(/[^0-9,.]/g, '');
        const match = cleaned.match(/[\d,]+/);
        if (match) {
           priceValue = parseInt(match[0].replace(/,/g, ''), 10) || 0;
        }
      } else if (typeof newItem.price === 'number') {
        priceValue = newItem.price;
      }

      if (!existingItem) {
        return {
          ...state,
          totalQuantity: state.totalQuantity + 1,
          totalAmount: state.totalAmount + priceValue,
          items: [
            ...state.items,
            {
              id: newItem.id,
              title: newItem.title,
              price: newItem.price,
              priceValue: priceValue,
              sku: newItem.sku,
              image: newItem.image,
              quantity: 1,
              totalPrice: priceValue,
            },
          ],
        };
      } else {
        return {
          ...state,
          totalQuantity: state.totalQuantity + 1,
          totalAmount: state.totalAmount + priceValue,
          items: state.items.map(item => 
            item.id === newItem.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  totalPrice: item.totalPrice + priceValue,
                }
              : item
          ),
        };
      }
    }
    
    case REMOVE_FROM_CART: {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      
      if (existingItem) {
        return {
          ...state,
          totalQuantity: state.totalQuantity - existingItem.quantity,
          totalAmount: state.totalAmount - existingItem.totalPrice,
          items: state.items.filter((item) => item.id !== id),
        };
      }
      return state;
    }
    
    case INCREMENT_QUANTITY: {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      
      if (existingItem) {
        return {
          ...state,
          totalQuantity: state.totalQuantity + 1,
          totalAmount: state.totalAmount + existingItem.priceValue,
          items: state.items.map(item => 
            item.id === id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  totalPrice: item.totalPrice + item.priceValue,
                }
              : item
          ),
        };
      }
      return state;
    }
    
    case DECREMENT_QUANTITY: {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      
      if (existingItem) {
        if (existingItem.quantity === 1) {
          return {
            ...state,
            totalQuantity: state.totalQuantity - 1,
            totalAmount: state.totalAmount - existingItem.priceValue,
            items: state.items.filter((item) => item.id !== id),
          };
        } else {
          return {
            ...state,
            totalQuantity: state.totalQuantity - 1,
            totalAmount: state.totalAmount - existingItem.priceValue,
            items: state.items.map(item => 
              item.id === id
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                    totalPrice: item.totalPrice - item.priceValue,
                  }
                : item
            ),
          };
        }
      }
      return state;
    }
    
    case CLEAR_CART: {
      return initialState;
    }

    case SET_CART: {
      const items = action.payload;
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
      return {
        ...state,
        items,
        totalQuantity,
        totalAmount,
      };
    }

    default:
      return state;
  }
};

export default cartReducer;

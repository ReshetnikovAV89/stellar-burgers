import { combineReducers } from '@reduxjs/toolkit';

import { authReducer } from './slices/authSlice';
import { constructorReducer } from './slices/constructorSlice';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { feedReducer } from './slices/feedSlice';
import { profileOrdersReducer } from './slices/profileOrdersSlice';
import { orderDetailsReducer } from './slices/orderDetailsSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  auth: authReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer,
  orderDetails: orderDetailsReducer
});

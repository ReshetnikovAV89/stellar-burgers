import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '../../utils/types';
import type { TWsStatus } from '../ws/wsActions';
import { profileOrdersWsActions } from '../ws/wsActions';

type TProfileOrdersState = {
  orders: TOrder[];
  wsStatus: TWsStatus;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  wsStatus: 'offline',
  error: null
};

type TProfileOrdersWsPayload = {
  success: boolean;
  orders: TOrder[];
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(profileOrdersWsActions.connecting, (state) => {
        state.wsStatus = 'connecting';
        state.error = null;
      })
      .addCase(profileOrdersWsActions.open, (state) => {
        state.wsStatus = 'online';
        state.error = null;
      })
      .addCase(profileOrdersWsActions.close, (state) => {
        state.wsStatus = 'offline';
      })
      .addCase(
        profileOrdersWsActions.error,
        (state, action: PayloadAction<string>) => {
          state.error = action.payload;
          state.wsStatus = 'offline';
        }
      )
      .addCase(
        profileOrdersWsActions.message,
        (state, action: PayloadAction<string>) => {
          const data = JSON.parse(action.payload) as TProfileOrdersWsPayload;
          if (!data?.success) return;
          state.orders = data.orders;
        }
      );
  }
});

export const profileOrdersReducer = profileOrdersSlice.reducer;

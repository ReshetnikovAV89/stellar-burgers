import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '../../utils/types';
import type { TWsStatus } from '../ws/wsActions';
import { feedWsActions } from '../ws/wsActions';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  wsStatus: TWsStatus;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  wsStatus: 'offline',
  error: null
};

type TFeedWsPayload = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(feedWsActions.connecting, (state) => {
        state.wsStatus = 'connecting';
        state.error = null;
      })
      .addCase(feedWsActions.open, (state) => {
        state.wsStatus = 'online';
        state.error = null;
      })
      .addCase(feedWsActions.close, (state) => {
        state.wsStatus = 'offline';
      })
      .addCase(feedWsActions.error, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        state.wsStatus = 'offline';
      })
      .addCase(
        feedWsActions.message,
        (state, action: PayloadAction<string>) => {
          try {
            const data = JSON.parse(action.payload) as TFeedWsPayload;
            if (!data?.success) return;
            state.orders = data.orders;
            state.total = data.total;
            state.totalToday = data.totalToday;
          } catch {
            state.error = 'WebSocket error: invalid message format';
            state.wsStatus = 'offline';
          }
        }
      );
  }
});

export const feedReducer = feedSlice.reducer;

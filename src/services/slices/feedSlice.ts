import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '../../utils/types';
import { getFeedsApi } from '../../utils/burger-api';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

type TFeedsResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeedOrders = createAsyncThunk<
  TFeedsResponse,
  void,
  { rejectValue: string }
>('feed/fetchFeedOrders', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return data;
  } catch (err) {
    const message =
      err && typeof err === 'object' && 'message' in err
        ? String((err as { message?: unknown }).message)
        : 'Failed to fetch feed orders';
    return rejectWithValue(message);
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeedError: (state) => {
      state.error = null;
    },
    setFeed: (
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeedOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeedOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch feed orders';
      });
  }
});

export const { clearFeedError, setFeed } = feedSlice.actions;
export const feedReducer = feedSlice.reducer;

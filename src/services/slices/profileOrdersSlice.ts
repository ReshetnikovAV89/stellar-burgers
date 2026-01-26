import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { TOrder } from '../../utils/types';
import { getOrdersApi } from '../../utils/burger-api';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('profileOrders/fetchProfileOrders', async (_, { rejectWithValue }) => {
  try {
    const data = await getOrdersApi();
    if (Array.isArray(data)) {
      return data as TOrder[];
    }
    if (data && typeof data === 'object' && 'orders' in data) {
      return (data as { orders: TOrder[] }).orders;
    }
    return [];
  } catch (err) {
    const message =
      err && typeof err === 'object' && 'message' in err
        ? String((err as { message?: unknown }).message)
        : 'Failed to fetch profile orders';
    return rejectWithValue(message);
  }
});

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    clearProfileOrdersError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch profile orders';
      });
  }
});

export const { clearProfileOrdersError } = profileOrdersSlice.actions;
export const profileOrdersReducer = profileOrdersSlice.reducer;

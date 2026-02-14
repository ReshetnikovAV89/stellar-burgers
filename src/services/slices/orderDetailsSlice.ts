import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type OrderDetailsState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderDetailsState = {
  order: null,
  isLoading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk<
  TOrder | null,
  number,
  { rejectValue: string }
>('orderDetails/fetchOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const data = await getOrderByNumberApi(number);
    return data.orders?.[0] ?? null;
  } catch {
    return rejectWithValue('Error');
  }
});

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Error';
      });
  }
});

export const orderDetailsReducer = orderDetailsSlice.reducer;

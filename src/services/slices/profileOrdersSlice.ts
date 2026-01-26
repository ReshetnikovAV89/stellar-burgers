import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '../../utils/types';
import { getCookie } from '../../utils/cookie';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

type TProfileOrdersResponse = {
  success: boolean;
  orders: TOrder[];
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk<
  TProfileOrdersResponse,
  void,
  { rejectValue: string }
>('profileOrders/fetchProfileOrders', async (_, { rejectWithValue }) => {
  try {
    const token = getCookie('accessToken');

    if (!token) {
      return rejectWithValue('Unauthorized');
    }

    const res = await fetch('https://norma.nomoreparties.space/api/orders', {
      headers: {
        authorization: token
      }
    });

    const data = (await res.json()) as TProfileOrdersResponse;

    if (!res.ok || !data?.success) {
      return rejectWithValue('Failed to fetch profile orders');
    }

    return data;
  } catch {
    return rejectWithValue('Failed to fetch profile orders');
  }
});

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProfileOrders.fulfilled,
        (state, action: PayloadAction<TProfileOrdersResponse>) => {
          state.isLoading = false;
          state.orders = action.payload.orders;
        }
      )
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch profile orders';
      });
  }
});

export const profileOrdersReducer = profileOrdersSlice.reducer;

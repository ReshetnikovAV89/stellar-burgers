import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TIngredient, TOrder } from '../../utils/types';

type ConstructorItem = {
  id: string;
  ingredient: TIngredient;
};

type ConstructorState = {
  bun: TIngredient | null;
  items: ConstructorItem[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: ConstructorState = {
  bun: null,
  items: [],
  orderRequest: false,
  orderModalData: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>(
  'burgerConstructor/createOrder',
  async (ingredientsIds, { rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ingredientsIds);
      return data.order;
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to create order';
      return rejectWithValue(message);
    }
  }
);

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.bun = ingredient;
        return;
      }
      state.items.push({ id: nanoid(), ingredient });
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index <= 0 || index >= state.items.length) return;
      const temp = state.items[index - 1];
      state.items[index - 1] = state.items[index];
      state.items[index] = temp;
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < 0 || index >= state.items.length - 1) return;
      const temp = state.items[index + 1];
      state.items[index + 1] = state.items[index];
      state.items[index] = temp;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.items = [];
    },
    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.bun = null;
        state.items = [];
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
        state.orderModalData = null;
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  clearOrderModal
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;

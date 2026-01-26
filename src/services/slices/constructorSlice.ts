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

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'constructor/createOrder',
  async (ingredientIds) => {
    const res = await orderBurgerApi(ingredientIds);
    return res.order;
  }
);

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
        return;
      }

      state.items.push({
        id: nanoid(),
        ingredient: action.payload
      });
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.items = [];
      state.orderRequest = false;
      state.orderModalData = null;
    },
    clearOrderModal: (state) => {
      state.orderRequest = false;
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
  clearConstructor,
  clearOrderModal
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;

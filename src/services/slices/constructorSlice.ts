import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';

type ConstructorItem = {
  id: string;
  ingredient: TIngredient;
};

type ConstructorState = {
  bun: TIngredient | null;
  items: ConstructorItem[];
};

const initialState: ConstructorState = {
  bun: null,
  items: []
};

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
    }
  }
});

export const { addIngredient, removeIngredient, clearConstructor } =
  constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;

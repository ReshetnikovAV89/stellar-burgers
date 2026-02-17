import { ingredientsReducer, fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

const ingredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 50,
    image: 'bun.png',
    image_mobile: 'bun-m.png',
    image_large: 'bun-l.png'
  }
];

describe('ingredientsSlice reducer', () => {
  test('pending sets isLoading true and clears error', () => {
    const state0 = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    const state1 = ingredientsReducer(
      state0,
      fetchIngredients.pending('', undefined)
    );

    expect(state1.isLoading).toBe(true);
    expect(state1.error).toBeNull();
  });

  test('fulfilled sets items and isLoading false', () => {
    const state0 = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    const state1 = ingredientsReducer(
      state0,
      fetchIngredients.fulfilled(ingredients, '', undefined)
    );

    expect(state1.isLoading).toBe(false);
    expect(state1.items).toEqual(ingredients);
  });

  test('rejected sets error and isLoading false', () => {
    const state0 = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    const state1 = ingredientsReducer(
      state0,
      fetchIngredients.rejected(
        new Error('boom'),
        '',
        undefined,
        'Failed to load ingredients'
      )
    );

    expect(state1.isLoading).toBe(false);
    expect(state1.error).toBe('Failed to load ingredients');
  });
});

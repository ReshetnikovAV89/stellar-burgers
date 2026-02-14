import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  setBun
} from './constructorSlice';
import { TIngredient } from '../../utils/types';

const bun: TIngredient = {
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
  image_large: 'bun-l.png',
  __v: 0
};

const main1: TIngredient = {
  _id: 'main-1',
  name: 'Начинка 1',
  type: 'main',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 80,
  image: 'm1.png',
  image_mobile: 'm1-m.png',
  image_large: 'm1-l.png',
  __v: 0
};

const main2: TIngredient = {
  _id: 'main-2',
  name: 'Начинка 2',
  type: 'main',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 90,
  image: 'm2.png',
  image_mobile: 'm2-m.png',
  image_large: 'm2-l.png',
  __v: 0
};

describe('constructorSlice reducer', () => {
  test('addIngredient should add item with generated id', () => {
    const state0 = constructorReducer(undefined, { type: 'UNKNOWN' });

    const state1 = constructorReducer(state0, addIngredient(main1));

    expect(state1.items).toHaveLength(1);
    expect(state1.items[0].ingredient._id).toBe(main1._id);
    expect(state1.items[0].id).toEqual(expect.any(String));
    expect(state1.items[0].id.length).toBeGreaterThan(0);
  });

  test('removeIngredient should remove item by id', () => {
    const state0 = constructorReducer(undefined, { type: 'UNKNOWN' });

    const state1 = constructorReducer(state0, addIngredient(main1));
    const state2 = constructorReducer(state1, addIngredient(main2));

    const idToRemove = state2.items[0].id;

    const state3 = constructorReducer(state2, removeIngredient(idToRemove));

    expect(state3.items).toHaveLength(1);
    expect(state3.items[0].ingredient._id).toBe(main2._id);
  });

  test('moveIngredientUp should swap item with previous', () => {
    const state0 = constructorReducer(undefined, { type: 'UNKNOWN' });

    const state1 = constructorReducer(state0, addIngredient(main1));
    const state2 = constructorReducer(state1, addIngredient(main2));

    const state3 = constructorReducer(state2, moveIngredientUp(1));

    expect(state3.items[0].ingredient._id).toBe(main2._id);
    expect(state3.items[1].ingredient._id).toBe(main1._id);
  });

  test('moveIngredientDown should swap item with next', () => {
    const state0 = constructorReducer(undefined, { type: 'UNKNOWN' });

    const state1 = constructorReducer(state0, addIngredient(main1));
    const state2 = constructorReducer(state1, addIngredient(main2));

    const state3 = constructorReducer(state2, moveIngredientDown(0));

    expect(state3.items[0].ingredient._id).toBe(main2._id);
    expect(state3.items[1].ingredient._id).toBe(main1._id);
  });

  test('setBun should set bun', () => {
    const state0 = constructorReducer(undefined, { type: 'UNKNOWN' });

    const state1 = constructorReducer(state0, setBun(bun));

    expect(state1.bun?._id).toBe(bun._id);
  });
});

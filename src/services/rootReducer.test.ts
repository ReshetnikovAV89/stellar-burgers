import { rootReducer } from './rootReducer';

describe('rootReducer', () => {
  test('should return initial state', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        items: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        items: [],
        orderRequest: false,
        orderModalData: null
      },
      auth: expect.any(Object),
      feed: expect.any(Object),
      profileOrders: expect.any(Object),
      orderDetails: expect.any(Object)
    });
  });
});

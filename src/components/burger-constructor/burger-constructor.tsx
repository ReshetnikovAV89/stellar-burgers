import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import type { TConstructorIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearOrderModal,
  createOrder
} from '../../services/slices/constructorSlice';
import { getCookie } from '../../utils/cookie';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const bun = useSelector((state) => state.burgerConstructor.bun);
  const items = useSelector((state) => state.burgerConstructor.items);
  const orderRequest = useSelector(
    (state) => state.burgerConstructor.orderRequest
  );
  const orderModalData = useSelector(
    (state) => state.burgerConstructor.orderModalData
  );

  const constructorItems = useMemo(
    () => ({
      bun,
      ingredients: items.map((item) => ({
        ...item.ingredient,
        id: item.id
      })) as unknown as TConstructorIngredient[]
    }),
    [bun, items]
  );

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModalHandler = () => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) =>
          sum + ingredient.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onSubmit={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};

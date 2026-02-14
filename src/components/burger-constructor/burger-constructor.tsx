import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import type { TConstructorIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearOrderModal,
  createOrder
} from '../../services/slices/constructorSlice';
import { fetchFeedOrders } from '../../services/slices/feedSlice';
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

  const constructorItems = useMemo(() => {
    const ingredients: TConstructorIngredient[] = items.map((item) => ({
      ...item.ingredient,
      id: item.id
    })) as unknown as TConstructorIngredient[];

    return {
      bun,
      ingredients
    };
  }, [bun, items]);

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = items.reduce(
      (sum, item) => sum + item.ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, items]);

  const closeOrderModalHandler = () => {
    dispatch(clearOrderModal());
  };

  const onOrderClick = () => {
    const accessToken = getCookie('accessToken');

    if (!accessToken) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!bun) return;

    const ids = [bun._id, ...items.map((i) => i.ingredient._id), bun._id];

    dispatch(createOrder(ids))
      .unwrap()
      .then(() => {
        dispatch(fetchFeedOrders());
      })
      .catch(() => {});
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};

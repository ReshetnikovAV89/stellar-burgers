import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';

import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orderDetailsSlice';
import { TIngredient, TOrder } from '../../utils/types';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);

  const ingredients = useSelector((state) => state.ingredients.items);
  const feedOrders = useSelector((state) => state.feed.orders);
  const profileOrders = useSelector((state) => state.profileOrders.orders);
  const { order: loadedOrder, isLoading } = useSelector(
    (state) => state.orderDetails
  );

  const orderFromStore = useMemo<TOrder | null>(() => {
    if (!Number.isFinite(orderNumber)) return null;

    return (
      feedOrders.find((o) => o.number === orderNumber) ||
      profileOrders.find((o) => o.number === orderNumber) ||
      null
    );
  }, [feedOrders, profileOrders, orderNumber]);

  const orderData = orderFromStore || loadedOrder;

  useEffect(() => {
    if (!Number.isFinite(orderNumber)) return;
    if (orderFromStore) return;
    if (loadedOrder?.number === orderNumber) return;

    dispatch(fetchOrderByNumber(orderNumber));
  }, [dispatch, orderNumber, orderFromStore, loadedOrder?.number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

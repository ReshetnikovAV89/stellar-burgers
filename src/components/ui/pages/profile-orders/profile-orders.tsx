import { FC } from 'react';
import { OrdersListUI } from '@ui';
import type { TOrder } from '../../../../utils/types';

type TProps = {
  orders: TOrder[];
};

export const ProfileOrdersUI: FC<TProps> = ({ orders }) => (
  <OrdersListUI orderByDate={orders} />
);

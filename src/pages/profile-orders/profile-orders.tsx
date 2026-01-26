import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { profileOrdersWsActions } from '../../services/ws/wsActions';
import { getCookie } from '../../utils/cookie';

const WS_USER_ORDERS_URL = 'wss://norma.nomoreparties.space/orders';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.profileOrders.orders);

  useEffect(() => {
    const rawToken = getCookie('accessToken');
    if (!rawToken) return;

    const token = rawToken.replace(/^Bearer\s+/i, '');

    dispatch(
      profileOrdersWsActions.connect(`${WS_USER_ORDERS_URL}?token=${token}`)
    );

    return () => {
      dispatch(profileOrdersWsActions.disconnect());
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};

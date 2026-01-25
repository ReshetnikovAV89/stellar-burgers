import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { feedWsActions } from '../../services/ws/wsActions';

const WS_FEED_URL = 'wss://norma.nomoreparties.space/orders/all';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.feed.orders);

  useEffect(() => {
    dispatch(feedWsActions.connect(WS_FEED_URL));
    return () => {
      dispatch(feedWsActions.disconnect());
    };
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => {}} />;
};

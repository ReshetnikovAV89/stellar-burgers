import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { feedWsActions } from '../../services/ws/wsActions';

const WS_FEED_URL = 'wss://norma.nomoreparties.space/orders/all';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feed.orders);
  const wsStatus = useSelector((state) => state.feed.wsStatus);
  const error = useSelector((state) => state.feed.error);

  useEffect(() => {
    dispatch(feedWsActions.connect(WS_FEED_URL));
    return () => {
      dispatch(feedWsActions.disconnect());
    };
  }, [dispatch]);

  const handleGetFeeds = useCallback(() => {
    dispatch(feedWsActions.disconnect());
    dispatch(feedWsActions.connect(WS_FEED_URL));
  }, [dispatch]);

  if (wsStatus === 'connecting') {
    return <Preloader />;
  }

  if (error) {
    return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};

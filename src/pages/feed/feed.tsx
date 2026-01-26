import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeedOrders } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.feed.orders);

  useEffect(() => {
    dispatch(fetchFeedOrders());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeedOrders());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};

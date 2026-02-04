import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth
}) => {
  const location = useLocation();
  const { user, isAuthChecked } = useSelector((state) => state.auth);

  if (!isAuthChecked) {
    return null;
  }

  const isAuthenticated = Boolean(user);

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = (
      location.state as {
        from?: { pathname?: string; search?: string; hash?: string };
      } | null
    )?.from;
    const to = from
      ? {
          pathname: from.pathname || '/',
          search: from.search || '',
          hash: from.hash || ''
        }
      : { pathname: '/' };
    return <Navigate to={to} replace />;
  }

  return children;
};

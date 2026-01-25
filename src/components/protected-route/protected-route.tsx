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

  if (onlyUnAuth && isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

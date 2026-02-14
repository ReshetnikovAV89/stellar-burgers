import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/authSlice';

type LocationState = {
  from?: { pathname?: string };
};

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.auth.error);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const locationState = location.state as LocationState | null;
  const fromPath = locationState?.from?.pathname ?? '/';

  useEffect(() => {
    if (user) {
      navigate(fromPath, { replace: true });
    }
  }, [user, navigate, fromPath]);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};

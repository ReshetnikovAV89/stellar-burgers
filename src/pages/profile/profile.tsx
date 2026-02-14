import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/authSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    });
  }, [user]);

  const isFormChanged = useMemo(() => {
    const name = user?.name ?? '';
    const email = user?.email ?? '';

    return (
      formValue.name !== name ||
      formValue.email !== email ||
      Boolean(formValue.password)
    );
  }, [formValue, user]);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    const payload: { name?: string; email?: string; password?: string } = {};

    if (formValue.name !== (user?.name ?? '')) {
      payload.name = formValue.name;
    }

    if (formValue.email !== (user?.email ?? '')) {
      payload.email = formValue.email;
    }

    if (formValue.password) {
      payload.password = formValue.password;
    }

    dispatch(updateUser(payload));
    setFormValue((previousState) => ({
      ...previousState,
      password: ''
    }));
  };

  const handleCancel = (event: SyntheticEvent) => {
    event.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((previousState) => ({
      ...previousState,
      [event.target.name]: event.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};

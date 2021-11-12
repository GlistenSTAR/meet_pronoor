import { navigate } from 'svelte-navigator';

import api from '../utils/api';
import { user, isAuthenticated, errors } from '../store';

// Load User
export const loadUser = async () => {
  const res = await api.get('/users/auth');

  if (res.msg === 'success') {
    user.set(res.user);
    isAuthenticated.set(true);
  } else {
    console.log(res.data);
  }
};

// Register User
export const register = async newUser => {
  const res = await api.post('/users/signup', newUser);

  if (res.msg === 'success') {
    errors.set({});
    navigate('/', { replace: true });
    return res.msg;
  } else {
    console.log(res.data);
    errors.set(res.data);
  }
};

// Login User
export const login = async userData => {
  const res = await api.post('/users/signin', userData);
  if (res.msg === 'success') {
    localStorage.setItem('token', res.token);
    isAuthenticated.set(true);
    loadUser();
    errors.set({});
    navigate('/', { replace: true });
    return res.msg;
  } else {
    console.log(res.data);
    errors.set(res.data);
  }
};

// Logout User
export const logout = async () => {
  localStorage.removeItem('token');
  user.set([]);
  isAuthenticated.set(false);
  errors.set({});
  navigate('/auth/login', { replace: true });
}

// Update User
export const updateUserData = async userData => {
  const res = await api.put('/users/update/user', userData);
  if (res.msg === 'success') {
    errors.set({});
    return res.msg;
  } else {
    console.log(res.data);
    errors.set(res.data);
  }
}

// Change password
export const changePassword = async pwData => {
  const res = await api.put('/users/changePw', pwData);

  if (res.msg === 'success') {
    console.log(res.msg);
    errors.set({});
    return res.msg;
  } else {
    console.log(res.data);
    errors.set(res.data);
  }
}
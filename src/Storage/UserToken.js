import { havingItem, removeItems } from './LocalStorage';

export function isTokenExpired(exp) {
  const now = Math.floor(Date.now() / 1000);
  return exp < now || (exp - now) < 360;
}

export const makeBearerToken = token => `Bearer ${token}`;

export const havingToken = (callback, defaultValue = null) => havingItem('token', callback, defaultValue);

export const getToken = () => localStorage.getItem('token');

export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const storeTokens = ({ token, refreshToken }) => {
  localStorage.setItem('token', token);
  localStorage.setItem('refresh_token', refreshToken);
};

export const storeRefreshToken = token => localStorage.setItem('refresh_token', token);

export const clearTokens = () => removeItems('token', 'refresh_token');

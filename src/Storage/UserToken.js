import { havingItem, removeItems } from './LocalStorage';

export function isTokenExpired(exp) {
  const now = Math.floor(Date.now() / 1000);
  return exp < now || (exp - now) < 360;
}

export const makeBearerToken = token => `Bearer ${token}`;

export const havingToken = (callback, defaultValue = null) => havingItem('token', callback, defaultValue);

export const havingTokenPayload = (callback, defaultValue = null) => havingItem('token_payload', payload => callback(JSON.parse(payload)), defaultValue);

export const getToken = () => localStorage.getItem('token');

export const getTokenPayload = () => havingTokenPayload(payload => payload);

export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const hasRefreshToken = () => getRefreshToken() !== null;

export const storeTokens = ({ token, refreshToken, payload }) => {
  localStorage.setItem('token', token);
  localStorage.setItem('refresh_token', refreshToken);
  localStorage.setItem('token_payload', JSON.stringify(payload));
  return { token, refreshToken, payload };
};

export const clearTokens = () => removeItems('token', 'refresh_token', 'token_payload');

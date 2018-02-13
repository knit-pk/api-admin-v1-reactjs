import { hydraClient, fetchHydra } from '@api-platform/admin';
import { isTokenExpired, getRefreshToken, storeTokens, makeBearerToken, getTokenPayload, getToken } from '../Storage/UserToken';
import { adminLogin, makeRefreshTokenLoginRequest } from './AuthClient';

const refreshTokenLogin = `${process.env.REACT_APP_API_HOST}/token/refresh`;

const makeUser = () => ({
  authenticated: false,
});

const makeAuthUser = ({ id, username, token }) => ({
  id,
  username,
  token: makeBearerToken(token),
  authenticated: true,
});

export const resolveUser = () => {
  const token = getToken();
  const payload = getTokenPayload();

  if (!token || !payload) {
    return makeUser();
  }

  const { exp, id, username } = payload;
  if (!isTokenExpired(exp)) {
    return makeAuthUser({ id, username, token });
  }

  const refreshToken = getRefreshToken();
  if (refreshToken) {
    return adminLogin(makeRefreshTokenLoginRequest(refreshTokenLogin, { refreshToken }))
      .then((tokens) => {
        storeTokens(tokens);
        return makeAuthUser({
          id: tokens.payload.id,
          username: tokens.payload.username,
          token: tokens.token,
        });
      });
  }

  return makeUser();
};

const fetchWithAuth = (url, options = {}) => fetchHydra(url, Object.assign({
  headers: new Headers({ Accept: 'application/ld+json' }),
}, options, { user: resolveUser() }));

export default api => (hydraClient(api, fetchWithAuth));

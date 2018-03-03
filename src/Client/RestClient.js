import { hydraClient, fetchHydra } from '@api-platform/admin';
import { isTokenExpired, getRefreshToken, storeTokens, makeBearerToken, getTokenPayload, getToken } from '../Storage/UserToken';
import { adminLogin, makeRefreshTokenLoginRequest } from './AuthClient';

const refreshTokenLogin = `${process.env.REACT_APP_API_URL}/token/refresh`;

const makeUser = () => ({
  authenticated: false,
});

const makeAuthUser = ({ id, username, token }) => ({
  id,
  username,
  token: makeBearerToken(token),
  authenticated: true,
});

const getUser = () => {
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
    return adminLogin(makeRefreshTokenLoginRequest(refreshTokenLogin, refreshToken))
      .then((tokens) => {
        storeTokens(tokens);
        return makeAuthUser({
          id: tokens.payload.id,
          username: tokens.payload.username,
          token: tokens.token,
        });
      })
      // TODO: Display error
      .catch(() => makeUser());
  }

  return makeUser();
};

export const resolveUser = () => new Promise(resolve => resolve(getUser()));

const fetchResolvingUser = (url, options = {}) => {
  const defaultHeaders = {
    headers: new Headers({ Accept: 'application/ld+json' }),
  };

  return resolveUser().then(user => fetchHydra(url, Object.assign({}, defaultHeaders, options, { user })));
};

export default api => (hydraClient(api, fetchResolvingUser));

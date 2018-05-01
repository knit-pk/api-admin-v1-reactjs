import { isTokenExpired, getRefreshToken, storeTokens, makeBearerToken, getTokenPayload, getToken } from '../Storage/UserToken';
import { adminLogin, makeRefreshTokenLoginRequest } from './AuthClient';
import generateUrl from '../Services/UrlGenerator';
import { APP_REFRESH_TOKEN_PATH } from '../Config';

const makeUser = () => ({
  authenticated: false,
});

const makeAuthUser = ({ id, username, token }) => ({
  id,
  username,
  token: makeBearerToken(token),
  authenticated: true,
});

export const getUser = () => {
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
    return adminLogin(makeRefreshTokenLoginRequest(generateUrl(APP_REFRESH_TOKEN_PATH), refreshToken))
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

const addUserResolvingCapabilities = fetch => (url, options = {}) => Promise.resolve(getUser()).then(user => fetch(url, Object.assign({}, options, { user })));

export default addUserResolvingCapabilities;

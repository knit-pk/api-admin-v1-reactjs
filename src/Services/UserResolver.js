import {
  isTokenExpired, getRefreshToken, makeBearerToken, getTokenPayload, getToken,
} from '../Storage/UserToken';
import { adminLogin, makeRefreshTokenLoginRequest } from '../Client/AuthClient';
import { APP_REFRESH_TOKEN_PATH } from '../Config';

const makeUser = (user = { authenticated: false }) => ({ ...user });

const resolveUserData = request => adminLogin(request)
  .then(({ token, payload }) => makeUser({
    id: payload.id,
    username: payload.username,
    token: makeBearerToken(token),
    authenticated: true,
  }))
  .catch(() => makeUser);

const getUser = () => {
  const token = getToken();
  const payload = getTokenPayload();

  if (!token || !payload) {
    return makeUser();
  }

  const { exp, id, username } = payload;
  if (!isTokenExpired(exp)) {
    return makeUser({
      id,
      username,
      token: makeBearerToken(token),
      authenticated: true,
    });
  }

  const refreshToken = getRefreshToken();
  if (refreshToken) {
    return resolveUserData(makeRefreshTokenLoginRequest(APP_REFRESH_TOKEN_PATH, refreshToken));
  }

  return makeUser();
};


export default () => Promise.resolve(getUser());

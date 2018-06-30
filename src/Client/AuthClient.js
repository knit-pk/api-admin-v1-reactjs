import {
  AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK,
} from 'react-admin';
import { storeTokens, clearTokens, getRefreshToken } from '../Storage/UserToken';
import decodeTokens from '../Services/UserTokensDecoder';
import { APP_LOGIN_PATH } from '../Config';
import generateUrl from '../Services/UrlGenerator';

const makeLoginRequest = (path, payload) => new Request(generateUrl(path), {
  method: 'POST',
  body: JSON.stringify(payload),
  headers: new Headers({ 'Content-Type': 'application/json' }),
});

export const makeRefreshTokenLoginRequest = (path, refreshToken) => makeLoginRequest(path, { refresh_token: refreshToken });

export const makeCredentialsLoginRequest = (path, { username, password }) => makeLoginRequest(path, { username, password });

export const adminLogin = request => fetch(request)
  .then((response) => {
    if (response.status !== 200) {
      throw new Error('Invalid credentials');
    }
    return response;
  })
  .then(response => response.json())
  .then(decodeTokens)
  .then(storeTokens);

/**
 * Authentication client
 *
 * @param {*} type
 * @param {*} params
 */
function authClient(type, params) { // eslint-disable-line
  switch (type) {
    case AUTH_LOGIN:
      const { username, password } = params;
      return adminLogin(makeCredentialsLoginRequest(APP_LOGIN_PATH, { username, password }));

    case AUTH_LOGOUT:
      clearTokens();
      break;

    case AUTH_ERROR:
      if (params.response.status === 401 || params.response.status === 403) {
        clearTokens();
        return Promise.reject();
      }
      return Promise.resolve();

    // TODO: Possibly not needed condition
    case AUTH_CHECK:
      return getRefreshToken() ? Promise.resolve() : Promise.reject();

    default:
      return Promise.resolve();
  }
}

export default (type, params) => authClient(type, params);

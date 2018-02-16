import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'admin-on-rest';
import { storeTokens, clearTokens, getRefreshToken } from '../Storage/UserToken';
import decodeTokens from './UserTokensDecoder';

const tokenLogin = `${process.env.REACT_APP_API_HOST}/token`;

const makeLoginRequest = (url, payload) => new Request(url, {
  method: 'POST',
  body: JSON.stringify(payload),
  headers: new Headers({ 'Content-Type': 'application/json' }),
});

export const makeRefreshTokenLoginRequest = (url, refreshToken) => makeLoginRequest(url, { refresh_token: refreshToken });

export const makeCredentialsLoginRequest = (url, { username, password }) => makeLoginRequest(url, { username, password });

// TODO: Catch
export const adminLogin = request => fetch(request)
  .then((response) => {
    if (response.status !== 200) {
      throw new Error('Invalid credentials');
    }
    return response;
  })
  .then(response => response.json())
  .then(decodeTokens);

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
      return adminLogin(makeCredentialsLoginRequest(tokenLogin, { username, password }))
        .then(storeTokens);

    case AUTH_LOGOUT:
      clearTokens();
      break;

    case AUTH_ERROR:
      if (params.response.status === 401 || params.response.status === 403) {
        clearTokens();
        return Promise.reject();
      }
      return Promise.resolve();

    case AUTH_CHECK:
      return getRefreshToken() ? Promise.resolve() : Promise.reject();

    default:
      return Promise.resolve();
  }
}

export default (type, params) => authClient(type, params);

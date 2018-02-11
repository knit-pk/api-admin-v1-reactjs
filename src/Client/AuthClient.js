import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'admin-on-rest';
import jwtDecode from 'jwt-decode';
import { storeTokens, clearTokens, havingToken, isTokenExpired } from '../Storage/UserToken';

const tokenLogin = `${process.env.REACT_APP_API_HOST}/token`;

/**
 * Determine if admin roles present in roles array
 *
 * @param {Array<string>} roles
 * @return {boolean}
 */
function isAdmin(roles) {
  return roles.indexOf('ROLE_ADMIN') !== -1 || roles.indexOf('ROLE_SUPER_ADMIN') !== -1;
}


export function checkResponseStatus(response) {
  if (response.status !== 200) {
    throw new Error('Invalid credentials.');
  }

  return response.json();
}

export function checkAdminRoles(response) {
  const { roles, username } = jwtDecode(response.token);

  if (!isAdmin(roles)) {
    throw new Error(`User ${username} is not an admin.`);
  }

  return response;
}

export const mapUserTokenData = response => ({ token: response.token, refreshToken: response.refresh_token });

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
      const requestLogin = new Request(tokenLogin, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      return fetch(requestLogin)
        .then(checkResponseStatus)
        .then(checkAdminRoles)
        .then(mapUserTokenData)
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
      const tokenData = havingToken(token => jwtDecode(token));
      return (tokenData && !isTokenExpired(tokenData.exp)) ? Promise.resolve() : Promise.reject();

    default:
      return Promise.resolve();
  }
}

export default (type, params) => authClient(type, params);

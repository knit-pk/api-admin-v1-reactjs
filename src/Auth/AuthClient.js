import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR } from 'admin-on-rest';
import jwtDecode from 'jwt-decode';

const tokenLogin = `${process.env.REACT_APP_API_HOST}/token`;

/**
 * Clear local storage befoure logout
 */
function clearLocalStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expires_at');
}

export function checkResponse(response) {
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.statusText);
  }

  return response.json();
}

export function saveTokens({ token, refresh_token }) {
  const decodedToken = jwtDecode(token);

  localStorage.setItem('token', token);
  localStorage.setItem('token_expires_at', decodedToken.exp);
  localStorage.setItem('refresh_token', refresh_token);
}

/**
 * Authenticate client
 *
 * @param {*} type
 * @param {*} params
 */
function authClient(type, params) {
  switch (type) {
    case AUTH_LOGIN:
      const { username, password } = params;
      const requestLogin = new Request(tokenLogin, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      return fetch(requestLogin)
        .then(checkResponse)
        .then(saveTokens);

    case AUTH_LOGOUT:
      clearLocalStorage();
      break;

    case AUTH_ERROR:
      if (params.response.status === 401 || params.response.status === 403) {
        clearLocalStorage();
        return Promise.reject();
      }
      return Promise.resolve();

    default:
      return Promise.resolve();
  }
}

export default (type, params) => authClient(type, params);

import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'admin-on-rest';
import jwtDecode from 'jwt-decode';

const tokenLogin = `${process.env.REACT_APP_API_HOST}/token`;

/**
 * Clear local storage befoure logout
 */
function clearLocalStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('token_data');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('should_reload');
}

/**
 * Determine if admin roles present in roles array
 *
 * @param {Array<string>} roles
 * @return {boolean}
 */
function isAdmin(roles) {
  return roles.indexOf('ROLE_ADMIN') !== -1 || roles.indexOf('ROLE_SUPER_ADMIN') !== -1;
}


export function checkStatus(response) {
  if (response.status !== 200) {
    throw new Error('Invalid credentials.');
  }

  return response.json();
}

// eslint-disable-next-line
export function checkTokenAndStoreData({ token, refresh_token }) {
  const tokenData = jwtDecode(token);

  if (!isAdmin(tokenData.roles)) {
    throw new Error(`User ${tokenData.username} is not an admin.`);
  }

  localStorage.setItem('token', token);
  localStorage.setItem('token_data', JSON.stringify(tokenData));
  localStorage.setItem('refresh_token', refresh_token);

  return tokenData;
}

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
        .then(checkStatus)
        .then(checkTokenAndStoreData)
        .then((data) => {
          // Haxes to force re-download authorized documentation
          if (localStorage.getItem('should_reload') === 'FORCE') {
            localStorage.removeItem('should_reload');
            // eslint-disable-next-line
            location.replace(location.href.split('#')[0])
          }
          return data;
        });

    case AUTH_LOGOUT:
      clearLocalStorage();
      break;

    case AUTH_ERROR:
      if (params.response.status === 401 || params.response.status === 403) {
        clearLocalStorage();
        return Promise.reject();
      }
      return Promise.resolve();

    case AUTH_CHECK:
      return localStorage.getItem('token_data') ? Promise.resolve() : Promise.reject();

    default:
      return Promise.resolve();
  }
}

export default (type, params) => authClient(type, params);

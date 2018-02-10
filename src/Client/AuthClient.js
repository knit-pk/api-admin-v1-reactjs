import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'admin-on-rest';
import jwtDecode from 'jwt-decode';
import { removeItems } from '../Storage/LocalStorage';

const tokenLogin = `${process.env.REACT_APP_API_HOST}/token`;

const data = {
  loggedIn: false,
};

/**
 * Clear local storage befoure logout
 */
function clearData() {
  removeItems('token', 'token_data', 'refresh_token');
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
  data.loggedIn = true;

  return tokenData;
}

/**
 * Authentication client
 *
 * @param {*} type
 * @param {*} params
 */
function authClient(type, params) { // eslint-disable-line
  console.log(data);
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
        .then(checkTokenAndStoreData);

    case AUTH_LOGOUT:
      clearData();
      break;

    case AUTH_ERROR:
      if (params.response.status === 401 || params.response.status === 403) {
        clearData();
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

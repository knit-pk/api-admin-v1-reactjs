import { hydraClient, fetchHydra } from '@api-platform/admin';
import { checkResponse, checkTokenAndStoreData } from '../Client/AuthClient';

const refreshTokenLogin = `${process.env.REACT_APP_API_HOST}/token/refresh`;

/**
 * Determine if token is already expired or expires in less than 360 seconds.
 *
 * @param {number} exp
 * @return {boolean}
 */
function isTokenExpired(exp) {
  // If token expired or is going to expire in 360 seconds..
  const now = Math.floor(Date.now() / 1000);
  return exp < now || (exp - now) < 360;
}

/**
 * @todo TokenData object
 * @return {Object} available keys: id, iat, exp, username, roles: []
 */
function getTokenData() {
  const tokenData = localStorage.getItem('token_data');

  if (tokenData === null) {
    return null;
  }

  return JSON.parse(tokenData);
}

const fetchWithAuth = (url, options = {}) => {
  const optionsMerged = Object.assign({
    headers: new Headers({ Accept: 'application/ld+json' }),
  }, options);

  const tokenData = getTokenData();
  const refreshToken = localStorage.getItem('refresh_token');

  if (
    refreshToken !== null &&
    tokenData !== null &&
    isTokenExpired(tokenData.exp)
  ) {
    const requestRefresh = new Request(refreshTokenLogin, {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return fetch(requestRefresh)
      .then(checkResponse)
      .then(checkTokenAndStoreData)
      .then(({ username, id }) => {
        optionsMerged.user = {
          username,
          id,
          authenticated: true,
          token: `Bearer ${localStorage.getItem('token')}`,
        };
        return fetchHydra(url, optionsMerged);
      });
  }

  const token = localStorage.getItem('token');
  optionsMerged.user = {
    authenticated: token !== null,
  };

  if (optionsMerged.user.authenticated) {
    optionsMerged.user.token = `Bearer ${token}`;
    optionsMerged.user.username = tokenData.username;
    optionsMerged.user.id = tokenData.id;
  }

  return fetchHydra(url, optionsMerged);
};

export default api => (hydraClient(api, fetchWithAuth));

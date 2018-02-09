import { hydraClient, fetchHydra } from '@api-platform/admin';
import { checkStatus, checkTokenAndStoreData } from '../Client/AuthClient';
import { havingItem } from '../Storage/LocalStorage';

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


const fetchWithAuth = (url, options = {}) => {
  const optionsMerged = Object.assign({
    headers: new Headers({ Accept: 'application/ld+json' }),
  }, options);

  const tokenData = havingItem('token_data', data => JSON.parse(data));
  const refreshToken = localStorage.getItem('refresh_token');

  if (tokenData !== null && isTokenExpired(tokenData.exp)) {
    const requestRefresh = new Request(refreshTokenLogin, {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return fetch(requestRefresh)
      .then(checkStatus)
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

  return fetchHydra(url, Object.assign(optionsMerged, havingItem('token', token => ({
    user: {
      authenticated: true,
      token: `Bearer ${token}`,
      username: tokenData.username,
      id: tokenData.id,
    },
  }), { authenticated: false })));
};

export default api => (hydraClient(api, fetchWithAuth));

import { hydraClient, fetchHydra } from '@api-platform/admin';
import jwtDecode from 'jwt-decode';
import { checkResponseStatus, checkAdminRoles, mapUserTokenData } from '../Client/AuthClient';
import { isTokenExpired, getRefreshToken, havingToken, storeTokens, makeBearerToken } from '../Storage/UserToken';

const refreshTokenLogin = `${process.env.REACT_APP_API_HOST}/token/refresh`;


const fetchWithAuth = (url, options = {}) => {
  const optionsMerged = Object.assign({
    headers: new Headers({ Accept: 'application/ld+json' }),
  }, options);

  const tokenData = havingToken(token => jwtDecode(token));
  const refreshToken = getRefreshToken();

  if (tokenData && isTokenExpired(tokenData.exp) && refreshToken) {
    const requestRefresh = new Request(refreshTokenLogin, {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return fetch(requestRefresh)
      .then(checkResponseStatus)
      .then(checkAdminRoles)
      .then(storeTokens)
      .then((response) => {
        storeTokens(mapUserTokenData(response));
        const { username, id } = jwtDecode(response.token);
        optionsMerged.user = {
          id,
          username,
          token: makeBearerToken(response.token),
          authenticated: true,
        };
        return fetchHydra(url, optionsMerged);
      });
  }

  return fetchHydra(url, Object.assign(optionsMerged, havingToken(token => ({
    user: {
      id: tokenData.id,
      username: tokenData.username,
      token: makeBearerToken(token),
      authenticated: true,
    },
  }), { authenticated: false })));
};

export default api => (hydraClient(api, fetchWithAuth));

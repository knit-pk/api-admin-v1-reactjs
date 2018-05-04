import jwtDecode from 'jwt-decode';

/**
 * @typedef {Object} UserTokenPayload Decoded JWT Token content
 *
 * @property {string} id User's id (UUIDv4 32 chars)
 * @property {string} username User's nickname
 * @property {Array<string>} roles User's roles
 * @property {int} iat Unix timestamp (invalidated at)
 * @property {int} exp Unix timestamp (expires at)
 */

/**
 * @typedef {Object} UserTokens
 *
 * @property {string} token JWT Authorization Token
 * @property {string} refreshToken Refresh token
 * @property {UserTokenPayload} payload JWT Token Payload
 */

/**
 * Determine if admin roles present in roles array
 *
 * @param {Array<string>} roles
 *
 * @return {boolean}
 */
function isAdmin(roles) {
  return roles.indexOf('ROLE_ADMIN') !== -1 || roles.indexOf('ROLE_SUPER_ADMIN') !== -1;
}

/**
 * Decode login response
 *
 * @param {Object} data response content
 *
 * @returns {UserTokens}
 */
export function decode(data) {
  const payload = jwtDecode(data.token);
  const { username, roles } = payload;

  if (!isAdmin(roles)) {
    throw new Error(`User ${username} is not an admin.`);
  }

  return {
    token: data.token,
    refreshToken: data.refresh_token,
    payload,
  };
}


export default decode;


import parseHydraDocumentation from '@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation';
import jwtDecode from 'jwt-decode';
import { havingToken, isTokenExpired, makeBearerToken } from '../Storage/UserToken';


const makeFetchHeaders = () => new Headers(havingToken((token) => {
  const { exp } = jwtDecode(token);
  if (!isTokenExpired(exp)) {
    return { Authorization: makeBearerToken(token) };
  }

  return {};
}, {}));

export default jsonldEntrypoint => parseHydraDocumentation(jsonldEntrypoint, { headers: makeFetchHeaders() });

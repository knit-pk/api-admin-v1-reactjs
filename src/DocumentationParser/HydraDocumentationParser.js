
import parseHydraDocumentation from '@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation';
import { resolveUser } from '../Client/RestClient';


const makeFetchHeaders = () => {
  const headers = {};
  const user = resolveUser();
  if (user.authenticated) {
    headers.Authorization = user.token;
  }
  return new Headers(headers);
};

export default jsonldEntrypoint => parseHydraDocumentation(jsonldEntrypoint, { headers: makeFetchHeaders() });

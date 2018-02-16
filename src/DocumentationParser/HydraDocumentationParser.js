
import parseHydraDocumentation from '@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation';
import { resolveUser } from '../Client/RestClient';
import { storeHydraDocs, havingHydraDocs } from '../Storage/HydraDocs';


function parseHydraDocumentationForUser(jsonldEntrypoint) {
  return resolveUser().then(({ authenticated, token }) => {
    const headers = {};
    if (authenticated) {
      headers.authorization = token;
    }
    return new Headers(headers);
  }).then(headers => parseHydraDocumentation(jsonldEntrypoint, { headers }))
    .then(({ api }) => {
      storeHydraDocs(api);
      return { api };
    });
}

function parseHydraDocumentationCached(jsonldEntrypoint) {
  return havingHydraDocs(api => new Promise(resolve => resolve({ api })), parseHydraDocumentationForUser(jsonldEntrypoint));
}

export default parseHydraDocumentationCached;

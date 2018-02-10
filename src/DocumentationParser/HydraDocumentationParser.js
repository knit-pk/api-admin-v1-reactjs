
import parseHydraDocumentation from '@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation';
import { havingItem } from '../Storage/LocalStorage';

const makeFetchHeaders = () => new Headers(havingItem('token', token => ({ Authorization: `Bearer ${token}` }), {}));

export default jsonldEntrypoint => parseHydraDocumentation(jsonldEntrypoint, { headers: makeFetchHeaders() });

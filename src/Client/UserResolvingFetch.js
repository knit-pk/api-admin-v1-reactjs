import resolveUser from '../Services/UserResolver';

const addUserResolvingCapabilities = fetch => (url, options = {}) => resolveUser()
  .then(user => fetch(url, Object.assign({}, options, { user })));

export default addUserResolvingCapabilities;

import React, { Component } from 'react';
import { HydraAdmin } from '@api-platform/admin';
import { Redirect } from 'react-router-dom';
import parseHydraDocumentation from '@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation';
import AuthClient from './Client/AuthClient';
import RestClient from './Client/RestClient';

const entrypoint = `${process.env.REACT_APP_API_HOST}`;
const fetchHeaders = {};

const token = localStorage.getItem('token');
if (typeof token !== 'undefined') {
  fetchHeaders.Authorization = `Bearer ${token}`;
}

const apiDocumentationParser = jsonldEntrypoint => parseHydraDocumentation(jsonldEntrypoint, { headers: new Headers(fetchHeaders) })
  .then(
    ({ api, customRoutes = [] }) => ({
      api,
      customRoutes,
      hasError: false,
      loaded: true,
    }),
    ({ status, api, customRoutes = [] }) => {
      switch (status) {
        case 401:
          customRoutes.push({
            props: {
              path: '/',
              render: () => (
                <Redirect to={'/login'} />
              ),
            },
          });
          break;
        default:
          return Promise.reject({ api, customRoutes });
      }


      return Promise.resolve({
        api,
        customRoutes,
        hasError: true,
        loaded: true,
      });
    },
  );

class App extends Component {
  render() {
    return (<HydraAdmin
      apiDocumentationParser={apiDocumentationParser}
      entrypoint={entrypoint}
      restClient={RestClient}
      authClient={AuthClient}
    />);
  }
}

export default App;

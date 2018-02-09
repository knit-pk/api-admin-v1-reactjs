
import React from 'react';
import { Redirect } from 'react-router-dom';
import parseHydraDocumentation from '@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation';

const fetchHeaders = {};

const token = localStorage.getItem('token');
if (typeof token !== 'undefined') {
  fetchHeaders.Authorization = `Bearer ${token}`;
}

export default jsonldEntrypoint => parseHydraDocumentation(jsonldEntrypoint, { headers: new Headers(fetchHeaders) })
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
                <Redirect to="/login" />
              ),
            },
          });
          localStorage.setItem('should_reload', 'FORCE');
          break;
        default:
          // eslint-disable-next-line
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

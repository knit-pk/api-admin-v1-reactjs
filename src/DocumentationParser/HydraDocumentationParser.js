
import React from 'react';
import { Redirect } from 'react-router-dom';
import parseHydraDocumentation from '@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation';
import { havingItem } from '../Storage/LocalStorage';

const makeFetchHeaders = () => new Headers(havingItem('token', token => ({ Authorization: `Bearer ${token}` }), {}));

export default jsonldEntrypoint => parseHydraDocumentation(jsonldEntrypoint, { headers: makeFetchHeaders() })
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

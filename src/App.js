import React from 'react';
import { HydraAdmin } from '@api-platform/admin';
import DocumentationParser from './DocumentationParser/HydraDocumentationParser';
import AuthClient from './Client/AuthClient';
import RestClient from './Client/RestClient';

const entrypoint = `${process.env.REACT_APP_API_HOST}`;

export default () => (<HydraAdmin
  entrypoint={entrypoint}
  apiDocumentationParser={DocumentationParser}
  restClient={RestClient}
  authClient={AuthClient}
/>);

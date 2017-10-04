import React, { Component } from 'react';
import { HydraAdmin } from '@api-platform/admin';
import AuthClient from './Client/AuthClient';
import RestClient from './Client/RestClient';

const entrypoint = `${process.env.REACT_APP_API_HOST}`;

class App extends Component {
  render() {
    return <HydraAdmin entrypoint={entrypoint} restClient={RestClient} authClient={AuthClient} />;
  }
}

export default App;

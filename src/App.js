import React, { Component } from 'react';
import HydraAdminFix from './Admin/HydraAdminFix';
import AuthClient from './Auth/AuthClient';

const entrypoint = `${process.env.REACT_APP_API_HOST}`;

class App extends Component {
  render() {
    return <HydraAdminFix entrypoint={entrypoint} authClient={AuthClient} />;
  }
}

export default App;

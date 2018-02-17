import React, { Component } from 'react';
import { AdminBuilder } from '@api-platform/admin';
import Dashboard from './Dashboard/Dashboard';
import documentationParser from './DocumentationParser/HydraDocumentationParser';
import authClient from './Client/AuthClient';
import restClient from './Client/RestClient';
import adminLoginSaga from './Sagas/AdminLoginSaga';
import { getRefreshToken } from './Storage/UserToken';
import { removeHydraDocs } from './Storage/HydraDocs';
import './App.css';

const entrypoint = `${process.env.REACT_APP_API_HOST}`;

if (!getRefreshToken()) {
  localStorage.setItem('should_reload', 'FIRST_TIME');
}

const updateHydraDocs = () => {
  removeHydraDocs();
  window.location.reload();
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { api: null };
  }

  componentDidMount() {
    documentationParser(entrypoint).then(({ api }) => {
      this.setState({ api });
    });
  }

  render() {
    if (this.state.api === null) {
      return <div>Loading...</div>;
    }

    return (<AdminBuilder
      dashboard={() => <Dashboard updateSchema={updateHydraDocs} />}
      customSagas={[adminLoginSaga]}
      api={this.state.api}
      title="KNIT Admin"
      authClient={authClient}
      restClient={restClient(this.state.api)}
    />);
  }
}

export default App;

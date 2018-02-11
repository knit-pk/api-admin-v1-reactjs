import React, { Component } from 'react';
import { AdminBuilder } from '@api-platform/admin';
import Dashboard from './Dashboard/Dashboard';
import documentationParser from './DocumentationParser/HydraDocumentationParser';
import authClient from './Client/AuthClient';
import restClient from './Client/RestClient';
import adminLoginSaga from './Sagas/AdminLoginSaga';

const entrypoint = `${process.env.REACT_APP_API_HOST}`;

// check if token exists and is not expired
if (!localStorage.getItem('token')) {
  localStorage.setItem('should_reload', 'FIRST_TIME');
}

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
      dashboard={() => <Dashboard updateSchema={() => location.reload()} />} // eslint-disable-line
      customSagas={[adminLoginSaga]}
      api={this.state.api}
      title="KNIT Admin"
      authClient={authClient}
      restClient={restClient(this.state.api)}
    />);
  }
}

export default App;

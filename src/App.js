import React, { Component } from 'react';
import { AdminBuilder } from '@api-platform/admin';
import documentationParser from './DocumentationParser/HydraDocumentationParser';
import authClient from './Client/AuthClient';
import restClient from './Client/RestClient';
import Dashboard from './Dashboard/Dashboard';
import adminLoginSaga from './Sagas/AdminLoginSaga';

const entrypoint = `${process.env.REACT_APP_API_HOST}`;

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = { api: null };
  }

  reloadPage = () => {
    // eslint-disable-next-line
    location.reload()
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
      test="test"
      dashboard={() => <Dashboard updateSchema={this.reloadPage} />}
      customSagas={[adminLoginSaga]}
      api={this.state.api}
      title="KNIT Admin"
      authClient={authClient}
      restClient={restClient(this.state.api)}
    />);
  }
}

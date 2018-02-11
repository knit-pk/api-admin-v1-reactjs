import React, { Component } from 'react';
import { AdminBuilder } from '@api-platform/admin';
import DocumentationParser from './DocumentationParser/HydraDocumentationParser';
import AuthClient from './Client/AuthClient';
import RestClient from './Client/RestClient';
import Dashboard from './Dashboard/Dashboard';
import adminLoginSaga from './Sagas/AdminLoginSaga';

const entrypoint = `${process.env.REACT_APP_API_HOST}`;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { api: null };
  }

  componentDidMount() {
    DocumentationParser(entrypoint).then(({ api }) => {
      this.setState({ api });
    });
  }

  render() {
    if (this.state.api === null) {
      return <div>Loading...</div>;
    }

    return (<AdminBuilder
      dashboard={Dashboard}
      customSagas={[adminLoginSaga]}
      api={this.state.api}
      title="KNIT Admin"
      authClient={AuthClient}
      restClient={RestClient(this.state.api)}
    />);
  }
}

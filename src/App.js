import React, { Component } from 'react';
import {
  AdminBuilder, hydraClient, fetchHydra, fieldFactory as adminFieldFactory,
} from '@api-platform/admin';
import Dashboard from './Dashboard/Dashboard';
import documentationParser from './DocumentationParser/HydraDocumentationParser';
import authClient from './Client/AuthClient';
import customSagas from './Sagas';
import customReducers from './Reducers';
import addUserResolvingCapabilities from './Client/UserResolvingFetch';
import addImageUploadCapabilities from './Client/ImageHandlingFetch';
import customizeAdminFieldFactory from './Services/AdminFieldFactory';
import './App.css';
import { APP_ENTRYPOINT } from './Config';

const hydraFetch = addImageUploadCapabilities(addUserResolvingCapabilities(fetchHydra));
const hydraClientFactory = api => (hydraClient(api, hydraFetch));
const fieldFactory = customizeAdminFieldFactory(adminFieldFactory);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { api: null };
  }

  componentDidMount() {
    documentationParser(APP_ENTRYPOINT).then(({ api }) => {
      this.setState({ api });
    });
  }

  render() {
    if (this.state.api === null) {
      return <div>Loading...</div>;
    }

    return (
      <AdminBuilder
        dashboard={Dashboard}
        customSagas={customSagas}
        customReducers={customReducers}
        api={this.state.api}
        title="KNIT Admin"
        authProvider={authClient}
        dataProvider={hydraClientFactory(this.state.api)}
        fieldFactory={fieldFactory}
      />
    );
  }
}

export default App;

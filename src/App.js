import React, {Component} from 'react';
import { AdminBuilder } from '@api-platform/admin';
import DocumentationParser from './DocumentationParser/HydraDocumentationParser';
import AuthClient from './Client/AuthClient';
import RestClient from './Client/RestClient';
import Dashboard from './Dashboard'
import adminLoginSaga from './Sagas/AdminLoginSaga';

const entrypoint = `${process.env.REACT_APP_API_HOST}`;
const userLogin = (payload, pathName) => ({
  type: 'DD',
  payload,
  meta: { auth: true, pathName },
});

export default class App extends Component {
  state = {
    api: null
  };

  componentDidMount() {
    DocumentationParser(entrypoint).then(({api}) => {
      this.setState({api})
    })
  }

  render() {
    if (null === this.state.api) {
      return <div>Loading...</div>;
    }

    return <AdminBuilder
      dashboard={Dashboard}
      customSagas={[ adminLoginSaga ]}
      api={this.state.api}
      title={"KNIT Admin"}
      authClient={AuthClient}
      restClient={RestClient(this.state.api)}
    />
  }
}

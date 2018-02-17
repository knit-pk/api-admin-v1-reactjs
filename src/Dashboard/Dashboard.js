import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { ViewTitle } from 'admin-on-rest/lib/mui';
import PropTypes from 'prop-types';
import { hydraRefreshMetadata } from '../Actions/HydraActions';

class Dashboard extends Component {
  render() {
    return (
      <Card>
        <ViewTitle title="Dashboard" />
        <CardText>Welcome to Admin of KNIT API</CardText>
        <FlatButton label="Reload to update admin schema" onClick={() => this.props.hydraRefreshMetadata(0)} />
      </Card>);
  }
}

Dashboard.propTypes = {
  hydraRefreshMetadata: PropTypes.func.isRequired,
};

export default connect(null, { hydraRefreshMetadata })(Dashboard);

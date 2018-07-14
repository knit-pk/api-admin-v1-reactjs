import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, CardContent } from '@material-ui/core';
import { ViewTitle } from 'ra-ui-materialui';
import PropTypes from 'prop-types';
import { hydraRefreshMetadata } from '../Actions/HydraActions';

class Dashboard extends Component {
  render() {
    return (
      <Card>
        <ViewTitle title="Dashboard" />
        <CardContent>Welcome to Admin of KNIT API</CardContent>
        <Button onClick={() => this.props.hydraRefreshMetadata(0)}>Reload to update admin schema</Button>
      </Card>);
  }
}

Dashboard.propTypes = {
  hydraRefreshMetadata: PropTypes.func.isRequired,
};

export default connect(null, { hydraRefreshMetadata })(Dashboard);

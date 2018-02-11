import React, { Component } from 'react';
import { Card, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { ViewTitle } from 'admin-on-rest/lib/mui';
import PropTypes from 'prop-types';

class Dashboard extends Component {
  render() {
    return (
      <Card>
        <ViewTitle title="Dashboard" />
        <CardText>Welcome to Admin of KNIT API</CardText>
        <FlatButton label="Reload to update admin schema" onClick={this.props.updateSchema} />
      </Card>);
  }
}

Dashboard.propTypes = {
  updateSchema: PropTypes.func.isRequired,
};

export default Dashboard;

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
        <CardText>Lorem ipsum sic dolor amet...</CardText>
        <FlatButton label="Update schema" onClick={this.props.updateSchema} />
      </Card>);
  }
}

Dashboard.propTypes = {
  updateSchema: PropTypes.func.isRequired,
};

export default Dashboard;

import React, { Component } from 'react';
import { Card, CardText } from 'material-ui/Card';
import { ViewTitle } from 'admin-on-rest/lib/mui';

export default class Dashboard extends Component {
  render() {
    return (
      <Card>
        <ViewTitle title="Dashboard" />
        <CardText>Lorem ipsum sic dolor amet...</CardText>
      </Card>);
  }
}

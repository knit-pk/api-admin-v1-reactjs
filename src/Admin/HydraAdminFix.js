
import React from 'react';
import { HydraAdmin, AdminBuilder, fetchHydra } from '@api-platform/admin';
import { checkResponse, saveTokens } from '../Auth/AuthClient';

const refreshTokenLogin = `${process.env.REACT_APP_API_HOST}/token/refresh`;

function isTokenGoingToBeExpired() {
  let exp = localStorage.getItem('token_expires_at');
  if (exp === null) {
    return true;
  }

  exp = parseInt(exp, 10);
  const now = Math.floor(Date.now() / 1000);
  return exp < now || (exp - now) < 360;
}


const fetchWithAuth = (url, options = {}) => {
  const optionsMerged = Object.assign({
    headers: new Headers({ Accept: 'application/ld+json' }),
  }, options);

  const refreshToken = localStorage.getItem('refresh_token');
  if (refreshToken !== null && isTokenGoingToBeExpired()) {
    const requestRefresh = new Request(refreshTokenLogin, {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return fetch(requestRefresh)
      .then(checkResponse)
      .then(saveTokens)
      .then(() => {
        optionsMerged.user = {
          authenticated: true,
          token: `Bearer ${localStorage.getItem('token')}`,
        };
        return fetchHydra(url, optionsMerged);
      });
  }

  const token = localStorage.getItem('token');
  optionsMerged.user = {
    authenticated: token !== null,
  };

  if (optionsMerged.user.authenticated) {
    optionsMerged.user.token = `Bearer ${token}`;
  }

  return fetchHydra(url, optionsMerged);
};

class HydraAdminFix extends HydraAdmin {
  render() {
    if (this.state.loaded === false) {
      return typeof this.props.loading === 'function' ? (
        <this.props.loading />
      ) : (
        <span className="loading">{this.props.loading}</span>
      );
    }

    if (this.state.hasError === true) {
      return typeof this.props.error === 'function' ? (
        <this.props.error />
      ) : (
        <span className="error">{this.props.error}</span>
      );
    }

    return (
      <AdminBuilder
        {...this.props}
        api={this.state.api}
        customRoutes={this.props.customRoutes.concat(this.state.customRoutes)}
        restClient={this.props.restClient(this.state.api, fetchWithAuth)}
      />
    );
  }
}

export default HydraAdminFix;

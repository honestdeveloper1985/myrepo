import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { ApolloProvider } from 'react-apollo';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import * as ReactGA from 'react-ga';

// Polyfill fetch
import 'isomorphic-fetch';
import './style/index.css';

import routes from './routes';
import createApolloClient from './helpers/create-apollo-client';

const subscriptionsURL = process.env.NODE_ENV !== 'production'
  ? 'ws://localhost:3010/subscriptions'
  : 'ws://api.githunt.com/subscriptions';

const wsClient = new SubscriptionClient(subscriptionsURL, {
  reconnect: true,
});

// Initialize Analytics
ReactGA.initialize('UA-74643563-4');

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

const client = createApolloClient({
  networkInterface: wsClient,
  initialState: window.__APOLLO_STATE__, // eslint-disable-line no-underscore-dangle
  ssrForceFetchDelay: 100,
  connectToDevTools: true,
});

render((
  <ApolloProvider client={client}>
    <Router history={browserHistory} onUpdate={logPageView}>
      {routes}
    </Router>
  </ApolloProvider>
), document.getElementById('content'));
